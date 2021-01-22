import { TimeStamp } from "./TimeStamp";

export interface Entity extends Record<string, unknown> {
  id: string,
  createdAt: TimeStamp,
  createdBy: string,
  updatedAt: TimeStamp,
  updatedBy: string,
}
