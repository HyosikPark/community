import { counter } from '@fortawesome/fontawesome-svg-core';

const postResover = {
  Query: {
    async allPosts(_, { category, curPage }, ctx) {
      const db = ctx.db.collection(category);
      const posts = await db
        .find()
        .sort({ createdAt: -1 })
        .skip(curPage * 1 - 1)
        .limit(1)
        .toArray()
        .catch((e) => {
          throw new Error('An error occurred while loading the data.');
        });

      const count = await db.count();
      return { postInfo: posts, postCount: count };
    },
  },
  Mutation: {
    async createPost(
      parent,
      { postInput: { nickname, password, title, content, category } },
      ctx
    ) {
      const db = ctx.db.collection(category);
      const counterDB = ctx.db.collection('counters');

      async function getNextSequenceValue(sequenceName) {
        const find = await counterDB.findOne({ _id: sequenceName });

        if (!find) {
          const newCounter = await counterDB.insertOne({
            _id: sequenceName,
            sequence_value: 1,
          });
          console.log(1);
          return newCounter.ops[0].sequence_value;
        }

        const sequenceDocument = await counterDB.findOneAndUpdate(
          { _id: sequenceName },
          { $inc: { sequence_value: 1 } },
          { returnOriginal: false }
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
        })
        .catch((e) => {
          console.log(e);
          throw new Error('An error occurred during upload.');
        });

      return { ...savedPost.ops[0] };
    },
  },
};

export default postResover;
