const resolvers = {
  Query: {
    users(_parent, _args, _context, _info) {
      return _context.db
        .collection('user')
        .findOne()
        .then((data) => {
          return { ...data, id: data._id };
        });
    },
  },
  // Mutation: {},
};

export default resolvers;
