import { getLogger } from "../../common/logger" ;
import { Role, ServerUser } from "../../common/model/User";
import { hash } from "../crypto";
import { getDatabase, makeRecord } from "./util";
// import { findOne, getUsersCollection, insert, update } from "./util";

const rootLogger = getLogger("db/user-management");

interface UserStub {
  password: string,
  passwordExpired: boolean,
  role: Role,
  salt: string,
  userName: string,
}

export const getUserByUserName = async (userName:string): Promise<ServerUser|null> => {
  const db = await getDatabase();
  console.log(db);
  /// @ts-ignore
  return db.users.findOne({ userName });
};

export const createUser = async (userStub: UserStub, createdBy: string): Promise<ServerUser> => {
  if (!createdBy) {
    throw new Error("[createUser] createdBy arg must be specified.");
  }

  const {
    password,
    passwordExpired,
    role = Role.User,
    salt,
    userName,
  } = userStub;

  /// @ts-ignore
  const userRecord:ServerUser = makeRecord({
    password,
    passwordExpired,
    role,
    salt,
    userName,
  }, createdBy);

  const db = await getDatabase();
  await db.getUsers().insert(userRecord);
  return userRecord;
};

/**
 * @param updatedUser - the updated user. Expect userName to stay the same.
 * @param updatedBy -
 */
export const updateUser = async (updatedUser: ServerUser, updatedBy: string): Promise<ServerUser> => {
  const logger = getLogger("updateUser", rootLogger);
  if (!updatedBy) {
    logger.error("updatedBy not specified.")
    throw new Error("[updateUser] updatedBy arg must be specified.");
  }

  // @ts-ignore
  const userRecord:ServerUser = makeRecord(updatedUser, updatedBy);
  const db = await getDatabase();
  const { userName } = updatedUser;
  await db.getUsers().update({ userName }, userRecord);
  return userRecord
};

// /** Verify the user's login details.*/
export const getVerifiedUser = async (userName: string, password: string):Promise<ServerUser|null> => {
  const user = await getUserByUserName(userName);
  if (user && (await hash(password, user.salt)) === user.password) {
    return user;
  }

  return null;
};
