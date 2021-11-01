const NodeCache = require('node-cache');
const dataCache = new NodeCache({ useClones: true, deleteOnExpire: false });

exports.dataCache = dataCache;
