const ip = require('ip');

const postResover = {
  Query: {
    async allPosts(_, { category, curPage }, ctx) {
      const db = ctx.db.collection(category);
      const posts = await db
        .find()
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db.countDocuments();
      return { postInfo: posts, postCount: count };
    },

    async getPost(_, { category, number }, ctx) {
      const clientIp = ip.address();

      const db = ctx.db.collection(category);
      const post = await db
        .findOneAndUpdate(
          { _id: number },
          {
            $inc: { views: 1 },
          },
          { returnOriginal: false }
        )
        .catch((e) => {
          throw new Error('post not Found');
        });
      if (post.value.likeUser.includes(clientIp)) {
        return { post: post.value, alreadyLike: true };
      } else {
        return { post: post.value, alreadyLike: false };
      }
    },
  },

  Mutation: {
    async createPost(
      parent,
      { postInput: { nickname, password, title, content, category } },
      ctx
    ) {
      const clientIp = ip.address();
      const db = ctx.db.collection(category);
      const counterDB = ctx.db.collection('counters');

      async function getNextSequenceValue(sequenceName) {
        const sequenceDocument = await counterDB.findOneAndUpdate(
          { _id: sequenceName },
          { $inc: { sequence_value: 1 } },
          { returnOriginal: false, upsert: true }
        );

        return sequenceDocument.value.sequence_value;
      }

      const savedPost = await db
        .insertOne({
          _id: await getNextSequenceValue(category),
          nickname,
          password,
          title,
          content,
          createdAt: new Date().toISOString(),
          comments: [],
          commentCount: 0,
          likeCount: 0,
          views: 0,
          category,
          likeUser: [],
          ip: clientIp,
        })
        .catch((e) => {
          throw new Error('An error occurred during upload.');
        });

      return savedPost.ops[0]._id;
    },

    async likePost(_, { category, number }, ctx) {
      const clientIp = ip.address();

      const db = ctx.db.collection(category);

      await db.findOneAndUpdate(
        { _id: number },
        {
          $addToSet: { likeUser: clientIp },
          $inc: { likeCount: 1 },
        }
      );
      return true;
    },

    async unlikePost(_, { category, number }, ctx) {
      const clientIp = ip.address();

      const db = ctx.db.collection(category);

      await db.findOneAndUpdate(
        { _id: number },
        {
          $pull: { likeUser: clientIp },
          $inc: { likeCount: -1 },
        }
      );
      return true;
    },
  },
};

export default postResover;
