const faker = require('faker');
const { dataCache } = require('../../dataCache');
faker.locale = 'zh_CN';
let _ctx = null;
let _cache_key = 'STUDENT_LIST';

exports.loadCtx = function(ctx) {
  _ctx = ctx;
};

exports.exec = function() {
  let { req, res } = _ctx;
  // init
  let dataList = dataCache.get(_cache_key);
  if (dataList == undefined) {
    dataList = [];
    dataCache.set(_cache_key, dataList);
  }
  let en = req.body;
  en.studentId = `${Date.now()}_${Number.parseInt(Math.random() * Math.random() * 10000)}`;
  dataList.unshift(en);
  dataCache.set(_cache_key, dataList);

  return en;
};
