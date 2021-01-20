const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const myPlugin = {

    // Fires whenever a GraphQL request is received from a client.
    requestDidStart(requestContext) {
      console.log('Request started! Query:\n' +
        requestContext.request.query);
  
      return {
  
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        parsingDidStart(requestContext) {
          console.log('Parsing started!');
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        validationDidStart(requestContext) {
          console.log('Validation started!');
        },
  
      }
    },
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    plugins: [
        myPlugin
    ]
})

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected. ')
        return server.listen({ port: PORT })
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
      console.error(err)
    })