import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
const mongoose = require("mongoose");
const Developer = require("./model/developer");

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

mongoose
  .connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => {
    Developer.find().then((isSuper) => {
      if (isSuper == 0) {
        const developer = new Developer({
          email: "jstrfaheem065@gmail.com",
          password:
            "$2b$12$4ffLoL5xlDNxz.WhmI6cbeld4415PhxwFaNzRY1SLYlkay/Tipy7u",
        });
        developer.save();
      }
    });

    server.start(() => {
      console.log("Server is running on localhost:4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
