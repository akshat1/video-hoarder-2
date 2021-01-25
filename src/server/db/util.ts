import { getLogger, Logger } from "../../common/logger";
import { Entity } from "../../common/model/Entity";
import { Item } from "../../common/model/Item";
import { ServerUser } from "../../common/model/User";
import { promises as fs } from "fs";
import _, { DebouncedFunc } from "lodash";
import path from "path";
import { v4 } from "uuid";

// TingoDB has not been updated in the last few years.
// And having a full blown DB is overkill for something that will almost always have a single user.
// We _do_ want to persist our data.
// So for now, our "database" is going to be a single JSON file.
// If this becomes a bottleneck, we can switch to a directory of JSON files.
// And if _that_ becomes a bottleneck, we can consider a database solution.

type Query = Object;

export const makeRecord = (stub: Record<string, unknown>, updatedBy: string):Record<string, unknown> => {
  const timeStamp = new Date().toISOString();
  return {
    ...stub,
    id: stub.id || v4(),
    createdAt: stub.createdAt || timeStamp,
    updatedAt: timeStamp,
    createdBy: stub.createdBy || updatedBy,
    updatedBy,
  };
};

type OnMutateType = DebouncedFunc<() => Promise<void>>;

interface CollectionArgs<ValueType extends Entity> {
  records: ValueType[]
  onMutate: OnMutateType
  name: string
}

class Collection<ValueType extends Entity> {
  records: Entity[];
  onMutate: OnMutateType;
  logger: Logger;

  constructor(args: CollectionArgs<ValueType>) {
    this.records = args.records
    this.onMutate = args.onMutate;
    this.logger = getLogger(`[Collection ${args.name}]`);
  }

  findOne(query:Query) {
    this.logger.debug("findOne", { query, records: this.records });
    return _.find(this.records, query, 0);
  }

  find(query:Query) {
    this.logger.debug("find", { query, records: this.records });
    return _.filter(this.records, query);
  }
    
  async insert(...items: ValueType[]) {
    const logger = getLogger("insert", this.logger);
    logger.debug("Insert", items.length, "items");
    items.forEach((item) => {
      if (this.findOne(item)) {
        logger.error("Found duplicate record");
        throw new Error(`Duplicate record with id ${item.id}`);
      }

      logger.debug("Add to list");
      this.records.push(...items);
    });

    logger.debug("Call onMutate");
    await this.onMutate();
  }

  async save(...items:ValueType[]) {
    const logger = getLogger("save", this.logger);
    logger.debug("Save", items.length, "items");
    items.forEach(item => {
      const existing = this.find(item);
      if (existing) {
        logger.debug("Found existing record. Update.");
        _.assign(existing, item);
      } else {
        logger.debug("This is a new record. Insert.");
        this.records.push(item);
      }
    });

    logger.debug("Call onMutate");
    await this.onMutate();
  }
  
  /**
   * @param criteria - The search query.
   * @param update - The mutation.
   * @returns - The number of records affected.
   */
  async update(criteria: Query, update: Record<string, unknown>): Promise<number> {
    const items = this.find(criteria);
    items.forEach(item => _.assign(item, update));
    this.onMutate();
    return items.length;
  }

  /**
   * @param criteria - the selection query
   * @returns - number of records removed
   */
  async remove(criteria: Query): Promise<number> {
    const numInitialRecords = this.records.length;
    /// @ts-ignore - We know we'll always get an array of the same type back.
    this.records = _.reject(this.records, criteria);
    await this.onMutate();
    return numInitialRecords - this.count();
  }

  toArray():Entity[] {
    return Array.from(this.records);
  }

  count(): number {
    return this.records.length;
  }
}

const dummyCollection = new Collection<Entity>({
  records: [],
  onMutate: _.debounce(() => Promise.resolve(), 5000),
  name: "dummy",
});

/**
 * An extremely simple implementation of a Database. This can lead to data loss, but no data in our database is going
 * to be critical so that's fine for now. At some point I might replace this with something more robust, if needed.
 */
class Database {
  dataLoaded: boolean;
  location: string;
  private users: Collection<ServerUser>;
  private jobs: Collection<Item>;
  logger: Logger;

  constructor(location: string) {
    this.logger = getLogger("Database");
    this.logger.debug("constructor", { location });
    this.dataLoaded = false
    this.location = location;
    this.users = dummyCollection;
    this.jobs = dummyCollection;
  }

  async loadData() {
    const logger = getLogger("loadData", this.logger);
    // Data is only loaded once.
    if (!this.dataLoaded) {
      logger.debug("Data not loaded");
      let data;
      try {
        // If an error occurrs, assume the file doesn't exist and carry on. We'll create a new file
        // when we write to disk.
        const buff = (await fs.readFile(this.location, "utf-8"));
        logger.debug("Got JSON from disk");
        data = JSON.parse(buff.toString());
        logger.debug("Parsed");
      } catch (error) {
        logger.error(error);
      }
      
      logger.debug("Populate users collection");
      this.users = new Collection({
        records: data?.userRecords || [],
        onMutate: this.writeToDisk,
        name: "users",
      });

      this.jobs = new Collection({
        records: data?.jobRecords || [],
        onMutate: this.writeToDisk,
        name: "jobs",
      })
    }
  }

  writeToDisk = _.debounce(async () => {
    const logger = getLogger("writeToDisk", this.logger);
    logger.debug("JSON -> String");
    const buff = JSON.stringify(
      {
        users: this.users?.toArray() || [],
      },
      undefined,
      2,
    );
    logger.debug("Write to disk");
    await fs.writeFile(this.location, buff, "utf-8");
    logger.debug("Done");
  }, 5000);

  getUsers() {
    return this.users;
  }

  getJobs() {
    return this.jobs;
  }
}

let database:Database;

export const getDatabase = ():Database => {
  if (!database) {
    database = new Database(path.join(process.cwd(), "database.json"));
    database.loadData();
  }

  return database;
}
