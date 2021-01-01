import commentResolver from './commentResolver';
import postResover from './postResolver';

const resolvers = {
  Query: {
    ...postResover.Query,
  },
  Mutation: {
    ...postResover.Mutation,
    ...commentResolver.Mutation,
  },
};

export default resolvers;
