/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://bd2hire_owner:0k7XWqLcEVOx@ep-small-heart-a1u61w7c.ap-southeast-1.aws.neon.tech/bd2hire?sslmode=require',
    }
  };
  