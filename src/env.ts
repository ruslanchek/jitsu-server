export const ENV = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_SECONDS: Number(process.env.JWT_EXPIRES_SECONDS),

  PG_SYNC: Boolean(process.env.PG_SYNC === 'true'),
  PG_HOST: process.env.PG_HOST,
  PG_PORT: Number(process.env.PG_PORT),
  PG_USER: process.env.PG_USER,
  PG_PASS: process.env.PG_PASS,
  PG_DB: process.env.PG_DB,

  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_KEY: process.env.S3_KEY,
  S3_SECRET: process.env.S3_SECRET,
  S3_BUCKET: process.env.S3_BUCKET,
};
