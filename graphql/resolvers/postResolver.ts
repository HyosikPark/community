const ip = require('ip');

const postResover = {
  Query: {
    async allPosts(_, { category, curPage }, ctx) {
      // get category posts
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category })
        .sort({ createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db.find({ category }).count();

      return { postInfo: posts, postCount: count };
    },

    async allPostsSortByLike(_, { category, curPage }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category })
        .sort({ likeCount: -1, createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db.find({ category }).count();

      return { postInfo: posts, postCount: count };
    },

    async allPostsSortByViews(_, { category, curPage }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category })
        .sort({ views: -1, createdAt: -1 })
        .skip(15 * (curPage - 1))
        .limit(15)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db.find({ category }).count();

      return { postInfo: posts, postCount: count };
    },

    async hotPosts(_, __, ctx) {
      // get Home menu Allposts
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category: { $ne: 'Notice' } })
        .sort({ likeCount: -1, createdAt: -1 })
        .limit(20)
        .toArray();
      return posts;
    },

    async getPost(_, { category, number }, ctx) {
      const clientIp = ctx.userIp;
      const db = ctx.db.collection('post');

      const post = await db
        .findOneAndUpdate(
          { category, number },
          {
            $inc: { views: 1 },
          },
          { returnOriginal: false }
        )
        .catch((e) => {
          throw new Error('post not Found');
        });

      if (post.value.likeUser.includes(String(clientIp))) {
        return { post: post.value, alreadyLike: true };
      } else {
        return { post: post.value, alreadyLike: false };
      }
    },
  },

  Mutation: {
    async createPost(
      _,
      { postInput: { nickname, password, title, content, category } },
      ctx
    ) {
      const clientIp = ctx.userIp;
      const db = ctx.db.collection('post');
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
          number: await getNextSequenceValue(category),
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

      return savedPost.ops[0].number;
    },

    async editPost(
      _,
      { editInput: { category, number, nickname, password, title, content } },
      ctx
    ) {
      const db = ctx.db.collection('post');
      await db
        .findOneAndUpdate(
          { category, number },
          {
            $set: { nickname, password, title, content },
          }
        )
        .catch((e) => {
          throw new Error('edit Error');
        });

      return true;
    },

    async deletePost(_, { category, number }, ctx) {
      const db = ctx.db.collection('post');
      await db.deleteOne({ category, number }).catch((e) => {
        throw new Error('delete Error');
      });

      return true;
    },

    async likePost(_, { category, number }, ctx) {
      const clientIp = ctx.userIp;

      const db = ctx.db.collection('post');

      await db.findOneAndUpdate(
        { category, number },
        {
          $addToSet: { likeUser: clientIp },
          $inc: { likeCount: 1 },
        }
      );
      return true;
    },

    async unlikePost(_, { category, number }, ctx) {
      const clientIp = ctx.userIp;

      const db = ctx.db.collection('post');

      await db.findOneAndUpdate(
        { category, number },
        {
          $pull: { likeUser: clientIp },
          $inc: { likeCount: -1 },
        }
      );
      return true;
    },

    async hotPosts(_, { number }, ctx) {
      const db = ctx.db.collection('post');
      const posts = await db
        .find({ category: { $ne: 'Notice' } })
        .sort({ likeCount: -1, createdAt: -1 })
        .skip(20 * number)
        .limit(20)
        .toArray();
      return posts;
    },
  },
};

export default postResover;
