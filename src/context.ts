import { createPubSub } from "graphql-yoga";
import { db } from "./db";

const pubSub = createPubSub();

export const context = {
  db,
  pubSub,
};

export type Context = typeof context;
