module.exports = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    DEV_END_POINT: process.env.DEV_END_POINT,
    PRO_END_POINT: process.env.PRO_END_POINT,
    S3_ACCESS_ID: process.env.S3_ACCESS_ID,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
  },
};
