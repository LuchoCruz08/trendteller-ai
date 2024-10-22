/* eslint-disable import/no-anonymous-default-export */
export default {
  dialect: "postgresql",
  schema: "./utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: "postgresql://trendteller-ai_owner:a1T5uDAEILHr@ep-round-rice-a51fm0qo.us-east-2.aws.neon.tech/trendteller-ai?sslmode=require",
    connectionString: "postgresql://trendteller-ai_owner:a1T5uDAEILHr@ep-round-rice-a51fm0qo.us-east-2.aws.neon.tech/trendteller-ai?sslmode=require",
  },
};
