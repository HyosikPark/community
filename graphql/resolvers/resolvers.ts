import commentResolver from './commentResolver';
import postResover from './postResolver';
import searchPostResolver from './searchPostResolver';

const resolvers = {
  Query: {
    ...postResover.Query,
    ...searchPostResolver.Query,
  },
  Mutation: {
    ...postResover.Mutation,
    ...commentResolver.Mutation,
  },
};

export default resolvers;
