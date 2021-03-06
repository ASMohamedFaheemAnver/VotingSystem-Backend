import "@babel/polyfill";
import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import mongoose from "mongoose";
import Developer from "./model/developer";

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    // Subscription,
  },
  context(request) {
    return {
      pubSub,
      request,
    };
  },
});

mongoose
  .connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => {
    Developer.find().then((isSuper) => {
      if (isSuper == 0) {
        const developer = new Developer({
          email: "jstrfaheem065@gmail.com",
          password: "password",
        });
        developer.save().catch((err) => {
          console.log(err.message);
        });
      }
    });

    server.start({ port: process.env.PORT || 4000 }, () => {
      console.log("Server is running on localhost:4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
