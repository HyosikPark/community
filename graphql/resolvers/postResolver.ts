const postResover = {
  Query: {
    async getPosts(_, __, ctx) {
      ctx.db.collection('post').findOne();
    },
  },
  Mutation: {
    async createPost() {},
  },
};

export default postResover;
