import { createSchema } from "graphql-yoga";
import { Context } from "./context";
import { GraphQLError } from "graphql";
import fs from "node:fs";
import path from "node:path";

export const schema = createSchema<Context>({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "schema/schema.graphql"),
    "utf-8"
  ),
  resolvers: {
    Query: {
      cvs: (_parent, _args, { db }) => db.cvs,
      cvById: (_parent, { id }, { db }) => {
        const cv = db.cvs.find((cv) => cv.id === id);
        if (!cv)
          throw new GraphQLError("CV Not Found", {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        return cv;
      },
    },
    Cv: {
      skills: (parent, _args, { db }) => {
        const skills = [];
        for (const element of db.cv_skill_relations) {
          if (parent.id === element.cv) {
            skills.push(db.skills.find((skill) => skill.id === element.skill));
          }
        }
        return skills;
      },
      user: (parent, _args, { db }) => {
        const cv = db.cvs.find((cv) => cv.id === parent.id)!;
        const user = db.users.find((user) => user.id === cv.user);
        if (!user) {
          throw new GraphQLError(`Could not find user ${cv.user}`, {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        }
        return user;
      },
    },
    Mutation: {
      addCv: (parent, { input }, { db, pubSub }) => {
        const cv = { ...input };
        const user = db.users.find((user) => user.id === input.user);
        if (!user) {
          throw new GraphQLError(`User with ID ${input.user} not found`, {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        }
        cv.id = db.cvs[db.cvs.length - 1].id + 1;
        db.cvs.push(cv);
        pubSub.publish("cvOperation", { message: `Cv ${cv.id} added`, cv: cv });
        return cv;
      },
      updateCv: (parent, { input }, { db, pubSub }) => {
        const index = db.cvs.findIndex((cv) => cv.id === input.id);
        if (index < 0) {
          throw new GraphQLError(`CV with ID ${input.id} not found`, {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        }
        const user = db.users.find((user) => user.id === input.user);
        if (!user) {
          throw new GraphQLError(`User with ID ${input.user} not found`, {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        }
        db.cvs[index] = { ...input };
        const res = db.cvs[index];
        pubSub.publish("cvOperation", {
          message: `Cv ${input.id} updated`,
          cv: res,
        });
        return res;
      },
      deleteCv: (parent, { id }, { db, pubSub }) => {
        const index = db.cvs.findIndex((cv) => cv.id === id);
        if (index < 0) {
          throw new GraphQLError(`CV with ID ${id} not found`, {
            extensions: {
              http: {
                status: 404,
              },
            },
          });
        }
        const cv = db.cvs[index];
        db.cvs.splice(index, 1);
        db.cv_skill_relations = db.cv_skill_relations.filter(
          (cv_skill_relation) => cv_skill_relation.cv !== id
        );
        pubSub.publish("cvOperation", {
          message: `Cv ${id} deleted`,
          cv: cv,
        });
        return db.cvs;
      },
    },
    Subscription: {
      cvOperation: {
        subscribe: (parent, args, { db, pubSub }) =>
          pubSub.subscribe("cvOperation"),
        resolve: (payload) => {
          return payload;
        },
      },
    },
  },
});
