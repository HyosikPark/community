import postResover from './postResolver';

const resolvers = {
  Query: {
    ...postResover.Query,
  },
  Mutation: {
    ...postResover.Mutation,
  },
};

export default resolvers;
