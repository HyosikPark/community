import commentResolver from './commentResolver';
import isAuthResolver from './isAuthResolver';
import postResover from './postResolver';
import searchPostResolver from './searchPostResolver';

const resolvers = {
  Query: {
    ...postResover.Query,
    ...searchPostResolver.Query,
    ...isAuthResolver.Query,
  },
  Mutation: {
    ...postResover.Mutation,
    ...commentResolver.Mutation,
  },
};

export default resolvers;
