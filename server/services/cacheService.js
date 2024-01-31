const { credentialsCache } = require('../credentialsCache');

const updateCache = (data) => {
  // Update the in-memory cache with latest data
  credentialsCache.length = 0;
  credentialsCache.push(...data);
};

module.exports = {
  updateCache,
};