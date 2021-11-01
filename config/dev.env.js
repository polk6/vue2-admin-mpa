'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE2_ADMIN_MPA_NEV: JSON.stringify(process.env.VUE2_ADMIN_MPA_NEV),
})
