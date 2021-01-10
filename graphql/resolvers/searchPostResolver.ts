const searchPostResolver = {
  Query: {
    async searchByTitle(_, { category, curPage, value }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category, title: { $regex: value } })
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db
        .find({ category, title: { $regex: value } })
        .count();

      return { postInfo: posts, postCount: count };
    },

    async searchByContent(_, { category, curPage, value }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category, content: { $regex: value } })
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db
        .find({ category, content: { $regex: value } })
        .count();

      return { postInfo: posts, postCount: count };
    },

    async searchByTitleAndContent(_, { category, curPage, value }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({
          category,
          $or: [{ title: { $regex: value } }, { content: { $regex: value } }],
        })
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db
        .find({
          category,
          $or: [{ title: { $regex: value } }, { content: { $regex: value } }],
        })
        .count();

      return { postInfo: posts, postCount: count };
    },

    async searchByNickname(_, { category, curPage, value }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category, nickname: { $regex: value } })
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db
        .find({ category, nickname: { $regex: value } })
        .count();

      return { postInfo: posts, postCount: count };
    },
  },
};

export default searchPostResolver;
