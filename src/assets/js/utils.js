const lazyload = (name) => (resolve) => require([`@/pages/${name}`], resolve);

const generaMenu = (routers, data) => {
  data.forEach((item) => {
    let menu = Object.assign({}, item);
    menu.component = lazyload(menu.component);
    if (!!item && !!item.children) {
      menu.children = [];
      generaMenu(menu.children, item.children);
    }
    routers.push(menu);
  });
};

/**
 * 工具模块，不依赖第三方代码
 */
var utils = {
  /**
   * 是否为JSON字符串
   * @param {String} str json字符串
   * @return {Boolean}
   */
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  },

  /**
   * 去除字符串首尾两端空格
   * @param {String} str
   * @return {String}
   */
  trim(str) {
    if (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    } else {
      return '';
    }
  },

  /**
   * 脱敏
   * @param {String} value 脱敏的值
   * @param {Number} preNum 保留前面几个
   * @param {Number} endNum 保留后面几个
   *
   */
  desensitization: function(value, preNum = 0, endNum = null) {
    if (value) {
      var valueNew = '';
      preNum = preNum - 1; // 前面个数 转换为 位数
      if (endNum == null) {
        endNum = value.length;
      } else {
        endNum = value.length - endNum;
      }
      valueNew = value
        .split('')
        .map((item, index) => {
          if (index > preNum && index < endNum) {
            return '*';
          } else {
            return item;
          }
        })
        .join('');
      return valueNew;
    } else {
      return '';
    }
  },

  /**
   * 判断是否Array对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isArray: function(value) {
    return toString.call(value) === '[object Array]';
  },

  /**
   * 判断是否日期对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isDate: function(value) {
    return toString.call(value) === '[object Date]';
  },

  /**
   * 判断是否Object对象
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isObject: function(value) {
    return toString.call(value) === '[object Object]';
  },

  /**
   * 判断是否为空
   * @param {Object} value 判断的对象
   * @return {Boolean}
   */
  isEmpty: function(value) {
    return value === null || value === undefined || value === '' || (this.isArray(value) && value.length === 0);
  },

  /**
   * 含有数据
   * @param {Object} value 判断的值
   * @return {Boolean}
   */
  hasValue: function(value) {
    return !this.isEmpty(value);
  },

  /**
   * 判断是否移动电话
   * @param {Number} value 判断的值
   * @return {Boolean}
   */
  isMobilePhone: function(value) {
    // 移动电话
    return /^1[3|4|5|7|8|9|6][0-9]\d{4,8}$/.test(value);
  },

  /**
   * 判断是否为邮箱
   * @param {String} value 判断的值
   * @return {Boolean}
   */
  isEmail: function(value) {
    return /^[a-zA-Z\-_0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/.test(value);
  },

  /**
   * 设置SessionStorage的值
   * @param {String} key 键
   * @param {Object} value 要存的对象
   */
  setSessionStorage: function(key, value) {
    key = this.getModuleKey(key);
    if (this.isObject(value) || this.isArray(value)) {
      value = this.toJsonStr(value);
    }
    sessionStorage[key] = value;
  },

  /**
   * 获取SessionStorage的值
   * @param {String} key 键
   * @param {Boolean} isDeserialize 是否反序列化
   */
  getSessionStorage: function(key, isDeserialize = true) {
    key = this.getModuleKey(key);
    var rs = sessionStorage[key];
    if (isDeserialize) {
      try {
        if (rs != undefined) {
          var obj = this.toJson(rs);
          rs = obj;
        }
      } catch (error) {}
    }

    return rs;
  },

  /**
   * 清除SessionStorage的值
   * @param {String} key 键
   */
  removeSessionStorage: function(key) {
    key = this.getModuleKey(key);
    return sessionStorage.removeItem(key);
  },

  /**
   * 设置LocalStorage的值
   * @param {String} key 键
   * @param {Object} value 要存的对象
   */
  setLocalStorage: function(key, value) {
    key = this.getModuleKey(key);
    if (this.isObject(value) || this.isArray(value)) {
      value = this.toJsonStr(value);
    }
    localStorage[key] = value;
  },

  /**
   * 清除SessionStorage的值
   * @param {String} key 键
   */
  removeSessionStorage: function(key) {
    key = this.getModuleKey(key);
    return sessionStorage.removeItem(key);
  },

  /**
   * 获取LocalStorage的值
   * @param {String} key 键
   */
  getLocalStorage: function(key) {
    key = this.getModuleKey(key);
    var rs = localStorage[key];
    try {
      if (rs != undefined) {
        var obj = this.toJson(rs);
        rs = obj;
      }
    } catch (error) {}
    return rs;
  },

  /**
   * 清除LocalStorage的值
   * @param {String} key 键
   */
  removeLocalStorage: function(key) {
    key = this.getModuleKey(key);
    return localStorage.removeItem(key);
  },

  getModuleKey: function(key) {
    //http://192.168.1.65:30800/basehome/#/share/microFont/mianApp?token=1249e3ef66543646c832de97a5dce44639d

    var moduleName = window.location.pathname; //  得到 /basehome/
    moduleName = moduleName.substring(0, moduleName.length - 1); //   得到 /basehome
    moduleName = moduleName.substring(moduleName.lastIndexOf('/') + 1, moduleName.length); // 得到 basehome
    return moduleName + '_' + key;
  },

  /**
   * 对传入的时间值进行格式化。后台传入前台的时间有两种个是：Sql时间和.Net时间
   * @param {String|Date} sValue 传入的时间字符串
   * @param {String|Boolean} dateFormat  日期格式，日期格式：eg：'Y-m-d H:i:s'
   * @return {String} 2014-03-01 这种格式
   * @example
   * 1) Sql时间格式：2015-02-24T00:00:00
   * 2) .Net时间格式：/Date(1410744626000)/
   */
  getDateTimeStr: function(sValue, dateFormat = 'Y-m-d') {
    var dt;
    // 1.先解析传入的时间对象，
    if (sValue) {
      // 不为Date格式，就转换为DateTime类型
      if (toString.call(sValue) !== '[object Date]') {
        // 1)纯数字
        if (toString.call(sValue) === '[object Number]') {
          dt = new Date(sValue);
        } else {
          // 2.字符串
          sValue = sValue + '';
          sValue = sValue.replace(/-/g, '/');
          if (sValue.indexOf('T') > 0) {
            // 1)格式：2015-02-24T00:00:00
            var timestr = sValue.replace('T', ' ').replace(/-/g, '/'); //=> 2015/02/24 00:00:00
            dt = new Date(timestr);
          } else if (sValue.indexOf('Date') >= 0) {
            // 2).Net格式：/Date(1410744626000)/
            //Convert date type that .NET can bind to DateTime
            //var date = new Date(parseInt(sValue.substr(6)));
            var timestr = sValue.toString().replace(/\/Date\((\d+)\)\//gi, '$1'); //
            dt = new Date(Math.abs(timestr));
          } else {
            dt = new Date(sValue);
          }
        }
      } else {
        dt = sValue;
      }
    } else {
      return '';
    }

    // 2.转换
    // 1)转换成对象 'Y-m-d H:i:s'
    var obj = {}; //返回的对象，包含了 year(年)、month(月)、day(日)
    obj.Y = dt.getFullYear(); //年
    obj.m = dt.getMonth() + 1; //月
    obj.d = dt.getDate(); //日期
    obj.H = dt.getHours();
    obj.i = dt.getMinutes();
    obj.s = dt.getSeconds();
    //2.2单位的月、日都转换成双位
    if (obj.m < 10) {
      obj.m = '0' + obj.m;
    }
    if (obj.d < 10) {
      obj.d = '0' + obj.d;
    }
    if (obj.H < 10) {
      obj.H = '0' + obj.H;
    }
    if (obj.i < 10) {
      obj.i = '0' + obj.i;
    }
    if (obj.s < 10) {
      obj.s = '0' + obj.s;
    }
    // 3.解析
    var rs = dateFormat
      .replace('Y', obj.Y)
      .replace('m', obj.m)
      .replace('d', obj.d)
      .replace('H', obj.H)
      .replace('i', obj.i)
      .replace('s', obj.s);
    return rs;
  },

  /**
   * 把总秒数转换为时分秒
   * @param {Number} seconds 秒数
   * @param {String} dateFormat 日期格式
   * @return {String}
   * @example
   * 100 => 00:01:40
   */
  getSFM: function(seconds, dateFormat = 'H:i:s') {
    var obj = {};
    obj.H = Number.parseInt(seconds / 3600);
    obj.i = Number.parseInt((seconds - obj.H * 3600) / 60);
    obj.s = Number.parseInt(seconds - obj.H * 3600 - obj.i * 60);
    if (obj.H < 10) {
      obj.H = '0' + obj.H;
    }
    if (obj.i < 10) {
      obj.i = '0' + obj.i;
    }
    if (obj.s < 10) {
      obj.s = '0' + obj.s;
    }

    // 3.解析
    var rs = dateFormat
      .replace('H', obj.H)
      .replace('i', obj.i)
      .replace('s', obj.s);
    return rs;
  },

  /**
   * 是否同一天
   * @param {Date} dt1 dt1
   * @param {Date} dt2 dt2
   * @return {Boolean}
   */
  isSomeDay: function(dt1, dt2) {
    if (dt1.getFullYear() == dt2.getFullYear() && dt1.getMonth() == dt2.getMonth() && dt1.getDate() == dt2.getDate()) {
      return true;
    }
    return false;
  },

  /**
   * 获取当前时间
   */
  getCurrentTime: function() {
    let yy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    let dd = new Date().getDate();
    let hh = new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
  },

  /**
   * 获取明天之后时间
   * @param int days 天数
   * @return 返回日期 yyyy-MM-dd HH:mm:ss
   */
  getDateAfterTodayTime: function(days) {
    const nextDay = new Date(new Date().getTime() + days * 24 * 3600 * 1000);
    let yy = nextDay.getFullYear();
    let mm = nextDay.getMonth() + 1 < 10 ? '0' + (nextDay.getMonth() + 1) : nextDay.getMonth() + 1;
    let dd = nextDay.getDate();
    let hh = nextDay.getHours();
    let mf = nextDay.getMinutes() < 10 ? '0' + nextDay.getMinutes() : nextDay.getMinutes();
    let ss = nextDay.getSeconds() < 10 ? '0' + nextDay.getSeconds() : nextDay.getSeconds();
    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
  },

  /**
   * 对象转换为json字符串
   * @param  {JSON} jsonObj Json对象
   * @return {String} Json字符串
   */
  toJsonStr: function(jsonObj) {
    return JSON.stringify(jsonObj);
  },

  /**
   * 讲json字符串转换为json对象
   * @param {String} jsonStr Json对象字符串
   * @return {JSON} Json对象
   */
  toJson: function(jsonStr) {
    return JSON.parse(jsonStr);
  },

  /**
   * 获取cookie的某个偏移范围的值
   * @param {Number} offset 偏移
   * @private
   */
  _getCookieVal: function(offset) {
    var endstr = document.cookie.indexOf(';', offset);
    if (endstr == -1) {
      endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
  },

  /**
   * 获取指定key的cookie
   * @param {String} key cookie的key
   * @return {Object}
   */
  getCookie: function(key) {
    var arg = key + '=',
      alen = arg.length,
      clen = document.cookie.length,
      i = 0,
      j = 0;

    while (i < clen) {
      j = i + alen;
      if (document.cookie.substring(i, j) == arg) {
        return this._getCookieVal(j);
      }
      i = document.cookie.indexOf(' ', i) + 1;
      if (i === 0) {
        break;
      }
    }
    return null;
  },

  /**
   * 设置cookie
   * @param {String} key cookie的key
   * @param {String} value cookie的value
   */
  setCookie: function(key, value) {
    var argv = arguments,
      argc = arguments.length,
      expires = argc > 2 ? argv[2] : null,
      path = argc > 3 ? argv[3] : '/',
      domain = argc > 4 ? argv[4] : null,
      secure = argc > 5 ? argv[5] : false;

    document.cookie =
      key +
      '=' +
      escape(value) +
      (expires === null ? '' : '; expires=' + expires.toGMTString()) +
      (path === null ? '' : '; path=' + path) +
      (domain === null ? '' : '; domain=' + domain) +
      (secure === true ? '; secure' : '');
  },

  /**
   * 是否含有特殊字符
   * @param  {String} value 传入的值
   * @return {Boolean} true 含有特殊符号;false 不含有特殊符号
   */
  isHaveSpecialChar: function(value) {
    var oldLength = value.length;
    var newLength = value.replace(/[`~!@#$%^&*_+=\\{}:"<>?\[\];',.\/~！@#￥%……&*——+『』：“”《》？【】；‘’，。？ \[\]()（）]/g, '').length;
    if (newLength < oldLength) {
      return true;
    }
    return false;
  },

  /**
   * 合并数组内成员的某个对象
   * @param {Array} arr 需要合并的数组
   * @param {String} fieldName 数组成员内的指定字段
   * @param {String} split 分隔符，默认为','
   * @example
   * var arr = [{name:'tom',age:13},{name:'jack',age:13}] => (arr, 'name') => tom,jack
   */
  joinArray: function(arr, fieldName, split) {
    split = split == undefined ? ',' : split;
    var rs = arr
      .map((item) => {
        return item[fieldName];
      })
      .join(split);
    return rs;
  },

  /**
   * 扩充sourceObj
   * @param {Object} sourceObj
   * @param {Object} targetObj
   */
  extend: function(sourceObj, targetObj) {
    var keys = Object.keys(sourceObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (targetObj[key] !== undefined) {
        sourceObj[key] = targetObj[key];
      }
    }
  },

  /**
   * 下载文件
   * @param {URL} url 文件url
   */
  downloadFile: function(url) {
    // 获取文件名
    let fileName = url.substr(url.lastIndexOf('/') + 1).replace(/-\d+/, '');
    // 1)建立个a标签
    var aElement = document.createElement('a');
    aElement.href = url;
    aElement.download = fileName;
    aElement.target = '_blank';
    // 2)创建点击事件
    var clickEvent = new MouseEvent('click');
    aElement.dispatchEvent(clickEvent); // 派发
  },

  /**
   * 获取文件名称
   * @param {String} filePath 文件路径
   */
  getFileName: function(filePath) {
    let fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    fileName = fileName.replace(/-\d{13}./, '.'); // 去除文件名称内的时间戳
    return fileName;
  },

  /**
   * 获取url内quest string的值
   * @param {String} name quest string name
   * @param {String} url 网址
   */
  getUrlParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    let regular = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    let val = regular.exec(url);
    if (!val) {
      return null;
    }
    if (!val[2]) {
      return '';
    }
    return decodeURIComponent(val[2].replace(/\+/g, ' '));
  },

  /**
   * 防抖
   * @param {Function}} fn 执行程序
   * @param {Number} delay 间隔
   */
  debounce: function(fn, delay = 300) {
    //默认300毫秒
    var timer = null;
    return function() {
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, args); // this 指向vue
      }, delay);
    };
  },

  /**
   * 防抖 for vue
   * @param {Vue} self vue instance
   * @param {Function}} fn 执行程序
   * @param {Number} delay 间隔,默认300毫秒
   */
  debounceForVue: function(self, fn, delay = 300) {
    let fnName = '__' + fn.name.replace(/\W/g, '');
    if (!self[fnName]) {
      self[fnName] = this.debounce(fn, delay);
    }
    self[fnName]();
  },

  /**
   * 获取tree的匹配项
   * @param {Array} treeList tree
   * @param {String} matchPropertyName 匹配的属性名称
   * @param {String} matchValue 匹配的值
   */
  getTreeItem: function(treeList, matchPropertyName, matchValue) {
    let matchItem = null;
    if (Array.isArray(treeList)) {
      for (let i = 0; i < treeList.length; i++) {
        const item = treeList[i];
        if (item.childrens && item.childrens.length > 0) {
          let treeList = item.childrens;
          matchItem = this.getTreeItem(treeList, matchPropertyName, matchValue);
        }

        if (item[matchPropertyName] == matchValue) {
          matchItem = item;
        }

        if (matchItem) {
          break;
        }
      }
    }
    return matchItem;
  }
};

export { utils, generaMenu };
