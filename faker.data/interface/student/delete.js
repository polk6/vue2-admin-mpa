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
  let { studentId } = req.body;
  for (let i = 0; i < dataList.length; i++) {
    if (dataList[i].studentId == studentId) {
      dataList.splice(i, 1);
      break;
    }
  }
  dataCache.set(_cache_key, dataList);
  return null;
};
