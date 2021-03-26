import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro';
import resolvers from '../../graphql/resolvers/resolvers';
import typeDefs from '../../graphql/schema/typeDefs';
import { MongoClient } from 'mongodb';

const getUserIp = (req) => {
  return req?.headers?.['x-forwarded-for'];
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let db;

const apolloServer = new ApolloServer({
  schema,
  context: async (ctx) => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        if (!dbClient.isConnected()) await dbClient.connect();

        db = dbClient.db('kpop'); // database name
      } catch (e) {
        throw new Error('데이터베이스 연결이 불안정합니다. 다시 시도해주세요.');
      }
    }
    return { ...ctx, db, userIp: getUserIp(ctx.req) };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
