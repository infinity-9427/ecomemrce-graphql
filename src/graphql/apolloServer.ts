import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';

import { typeDefs } from './typeDefs/index.js';
import { resolvers } from './resolvers/index.js';

export async function setupApolloServer(
  app: express.Express,
  path = '/graphql',
  port: number | string = 5000
) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    path,
    cors(),
    bodyParser.json(),
    (req, res, next) => {
      return (expressMiddleware(server) as any)(req, res, next);
    }
  );

  return httpServer;
}
