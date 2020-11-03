import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query,
    // Mutation,
    // Subscription,
  },
  context: {
    db,
    pubSub,
  },
});

server.start(() => {
  console.log("Server is running on localhost:4000");
});
