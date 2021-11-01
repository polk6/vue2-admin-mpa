'use strict';
const merge = require('webpack-merge');
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    VUE2_ADMIN_MPA_NEV: JSON.stringify(process.env.VUE2_ADMIN_MPA_NEV),
});
