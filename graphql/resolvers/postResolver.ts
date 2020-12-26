const postResover = {
  Query: {
    async allPosts(_, __, ctx) {
      const posts = await ctx.db
        .collection('post')
        .find()
        .toArray()
        .then((e) => e.reverse())
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      return posts;
    },
  },
  Mutation: {
    async createPost(
      parent,
      { postInput: { nickname, password, title, content } },
      ctx
    ) {
      const db = ctx.db.collection('post');

      const savedPost = await db
        .insertOne({
          nickname,
          password,
          title,
          content,
          createdAt: new Date().toISOString(),
          comments: [],
          commentCount: 0,
          likeCount: 0,
        })
        .catch((e) => {
          throw new Error('An error occurred during upload.');
        });

      return { ...savedPost.ops[0] };
    },
  },
};

export default postResover;
