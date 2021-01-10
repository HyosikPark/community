import commentResolver from './commentResolver';
import postResover from './postResolver';
import searchPostResolver from './searchPostResolver';

const resolvers = {
  Query: {
    ...postResover.Query,
  },
  Mutation: {
    ...postResover.Mutation,
    ...commentResolver.Mutation,
    ...searchPostResolver.Mutation,
  },
};

export default resolvers;
