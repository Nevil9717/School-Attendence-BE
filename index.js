require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloError,
} = require("apollo-server-core");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("./db/connection");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    if (!token) return new Error("Not authenticated");
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return { user };
    } catch (error) {
      throw new ApolloError("Invalid or expired token.", "UNAUTHENTICATED");
    }
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is Running at: ${port}.`);
  });
});
