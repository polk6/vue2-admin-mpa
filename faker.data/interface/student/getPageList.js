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
    for (var i = 0; i < 100; i++) {
      dataList.push({
        studentId: `${Date.now()}_${Number.parseInt(Math.random() * Math.random() * 10000)}_${faker.datatype.number(4)}`,
        name: faker.name.lastName() + faker.name.firstName(),
        age: faker.datatype.number({ min: 18, max: 23 }),
        phone: faker.phone.phoneNumber(),
        gender: faker.datatype.number(1) % 2 == 0 ? '1' : '2' // 1:男,2:女
      });
    }
    dataCache.set(_cache_key, dataList);
  }
  // filter
  let { keyWord, gender, pageIndex, pageSize } = req.query;
  if (keyWord) {
    dataList = dataList.filter((item) => {
      return item.name.includes(keyWord);
    });
  }
  if (gender) {
    dataList = dataList.filter((item) => {
      return item.gender == gender;
    });
  }

  // page
  let rowCount = dataList.length;
  let pages = Math.ceil(rowCount / pageSize);
  let rowIndex = (pageIndex - 1) * pageSize;
  if (rowIndex <= 0) {
    rowIndex = 0;
  }
  dataList = dataList.splice(rowIndex, pageSize);
  return {
    dataList,
    rowCount,
    pages
  };
};
