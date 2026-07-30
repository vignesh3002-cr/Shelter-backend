const environments = {
  Development: {
    baseUrl: process.env.DEV_BASE_URL,
    scope: process.env.DEV_SCOPE,
  },

  Production: {
    baseUrl: process.env.PROD_BASE_URL,
    scope: process.env.D365_SCOPE,
  },
};

export default environments;