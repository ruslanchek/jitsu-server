export const ENV = {
  PORT: process.env.PORT || 4000,

  PG_SYNC: Boolean(process.env.PG_SYNC === 'true'),
  PG_HOST: process.env.PG_HOST,
  PG_PORT: Number(process.env.PG_PORT),
  PG_USER: process.env.PG_USER,
  PG_PASS: process.env.PG_PASS,
  PG_DB: process.env.PG_DB,
};