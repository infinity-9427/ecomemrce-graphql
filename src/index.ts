import { createApp } from './app.js';
import { setupApolloServer } from './graphql/apolloServer.js';

const PORT: number | string = process.env.PORT || 5000;
const { app } = createApp({ port: PORT });

async function startServer() {
  const httpServer = await setupApolloServer(app, '/graphql', PORT);

  httpServer.listen(PORT, () => {
    console.log(`GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
