const { v4 } = require("uuid");
/**
 * this is a neat trick to mock a unique ID API
 * it assumes developers might not always know if we have
 * an ID ahead of time
 */
exports.getUniqueId = async (id) => id || v4();
