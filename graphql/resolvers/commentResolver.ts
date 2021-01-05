const ObjectID = require('mongodb').ObjectID;
const ip = require('ip');

const commentResolver = {
  Mutation: {
    async createComment(
      _,
      { commentInput: { category, number, nickname, password, content } },
      ctx
    ) {
      const clientIp = ip.address();

      const db = ctx.db.collection('post');

      const post = await db.findOneAndUpdate(
        { category, number },
        {
          $push: {
            comments: {
              _id: new ObjectID(),
              nickname,
              password,
              content,
              createdAt: new Date().toISOString(),
              ip: clientIp,
            },
          },
          $inc: { commentCount: 1 },
        },
        { returnOriginal: false }
      );
      const comment = post.value.comments;

      return comment[comment.length - 1];
    },

    async deleteComment(_, { category, number, _id }, ctx) {
      const db = ctx.db.collection('post');

      await db.findOneAndUpdate(
        { category, number },
        {
          $pull: {
            comments: {
              _id: ObjectID(_id),
            },
          },
          $inc: { commentCount: -1 },
        }
      );

      return true;
    },
  },
};

export default commentResolver;
