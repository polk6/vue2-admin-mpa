import axios from 'axios';
import { utils as _utils } from './utils.js';
import _msg from './msg.js';

var axiosInstance = axios.create({
  // timeout: 1000 * 30
});

// request inject
axiosInstance.interceptors.request.use(function(config) {
  // Do something before request is sent
  config.headers.common['x-csrf-token'] = _utils.getCookie('csrfToken');
  config.headers.common['token'] = _utils.getSessionStorage('token');
  return config;
});

// response inject
axiosInstance.interceptors.response.use(
  (res) => {
    _msg.hideLoading();
    if (res.data.code === 0) {
      return res.data.data;
    } else if (res.data.code === 403) {
      _msg.toast('token无效，请重登录', 'error');
    } else {
      _msg.toast(res.data.message, 'error');
      return Promise.reject(res.data.message);
    }
  },
  (error) => {
    _msg.hideLoading();
    _msg.toast('系统异常，请稍后重试', 'error');
    return Promise.reject(error);
  }
);

var http = {
  /**
   * 以get方式请求获取JSON数据
   * @param {String} url 请求地址
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 附加的请求参数
   * @param {Boolean} opts.showLoading 是否显示'载入中'提示框，默认false
   * @param {Boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   */
  get: function(url, opts = {}) {
    let { showLoading = false, clearTrimParam = true } = opts;

    if (showLoading) {
      _msg.showLoading();
    }

    // trim
    if (clearTrimParam) {
      for (var key in opts.params) {
        if (toString.call(opts.params[key]) == '[object String]') {
          opts.params[key] = opts.params[key].toString().trim();
        }
      }
    }

    return axiosInstance.get(url, { params: opts.params });
  },

  /**
   * 以post方式请求获取JSON数据
   * @param {String} url 请求地址
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 附加的请求参数
   * @param {Boolean} opts.showLoading 是否显示'载入中'提示框，默认true
   * @param {Boolean} opts.clearTrimParam 是否清除属性的前后空格，默认true
   * @param {Boolean} opts.isFormData 是否使用application/x-www-form-urlencoded，默认false
   */
  post: function(url, opts = {}) {
    let { showLoading = false, clearTrimParam = true, isFormData = false } = opts;

    if (showLoading) {
      _msg.showLoading();
    }

    // trim
    if (clearTrimParam) {
      for (var key in opts.params) {
        if (toString.call(opts.params[key]) == '[object String]') {
          opts.params[key] = opts.params[key].toString().trim();
        }
      }
    }

    // headers
    let contentType = 'application/json';
    if (isFormData) {
      // 以.net core 为例，参数签名为[FromForm]，此处修改 Content-Type
      contentType = 'application/x-www-form-urlencoded';
      opts.params = this.toQueryString(opts.params);
    }

    return axiosInstance.post(url, opts.params, {
      headers: {
        'Content-Type': contentType
      }
    });
  },

  /**
   * 上传文件
   * @param {Object} url 上传地址Url
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 上传的参数
   * @param {Object} opts.formData 上传的formData
   * @param {Function} opts.uploadingCallback 上传中的回调函数
   */
  uploadFile: function(url, opts = {}) {
    let queryString = this.toQueryString(opts.params);
    url += '?' + queryString;

    return axiosInstance.post(url, opts.formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: function(progressEvent) {
        opts.uploadingCallback && opts.uploadingCallback(progressEvent);
      }
    });
  },

  /**
   * 跨域请求
   * @param {String} url 请求地址
   * @param {Object} opts 配置项，可包含以下成员:
   * @param {Object} opts.params 附加的请求参数
   * @param {Boolean} opts.showLoading 是否显示'载入中'提示框，默认false
   * @param {Function} opts.successCallback 成功接收内容时的回调函数
   */
  jsonp: function(url, opts = {}) {
    if (opts.params) {
      url = url + '?' + this.toQueryString(opts.params);
    }
    axios
      .get(url)
      .then(function(res) {
        opts.successCallback && opts.successCallback(res.data);
      })
      .catch(function(err) {
        _msg.toast(`${err.message}`, 'error');
        throw err;
      });
  },

  /**
   * 将`name` - `value`对转换为支持嵌套结构的对象数组
   *
   *     var objects = toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
   *
   *     // objects then equals:
   *     [
   *         { name: 'hobbies', value: 'reading' },
   *         { name: 'hobbies', value: 'cooking' },
   *         { name: 'hobbies', value: 'swimming' },
   *     ];
   *
   *     var objects = toQueryObjects('dateOfBirth', {
   *         day: 3,
   *         month: 8,
   *         year: 1987,
   *         extra: {
   *             hour: 4
   *             minute: 30
   *         }
   *     }, true); // Recursive
   *
   *     // objects then equals:
   *     [
   *         { name: 'dateOfBirth[day]', value: 3 },
   *         { name: 'dateOfBirth[month]', value: 8 },
   *         { name: 'dateOfBirth[year]', value: 1987 },
   *         { name: 'dateOfBirth[extra][hour]', value: 4 },
   *         { name: 'dateOfBirth[extra][minute]', value: 30 },
   *     ];
   *
   * @param {String} name
   * @param {object | Array} value
   * @param {boolean} [recursive=false] 是否递归
   * @return {array}
   */
  toQueryObjects: function(name, value, recursive) {
    var objects = [],
      i,
      ln;

    if (_utils.isArray(value)) {
      for (i = 0, ln = value.length; i < ln; i++) {
        if (recursive) {
          objects = objects.concat(toQueryObjects(name + '[' + i + ']', value[i], true));
        } else {
          objects.push({
            name: name,
            value: value[i]
          });
        }
      }
    } else if (_utils.isObject(value)) {
      for (i in value) {
        if (value.hasOwnProperty(i)) {
          if (recursive) {
            objects = objects.concat(toQueryObjects(name + '[' + i + ']', value[i], true));
          } else {
            objects.push({
              name: name,
              value: value[i]
            });
          }
        }
      }
    } else {
      objects.push({
        name: name,
        value: value
      });
    }

    return objects;
  },

  /**
   * 把对象转换为查询字符串
   * e.g.:
   *     toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
   *     toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
   *     toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
   * @param {Object} object 需要转换的对象
   * @param {Boolean} [recursive=false] 是否递归
   * @return {String} queryString
   */
  toQueryString: function(obj, recursive) {
    var paramObjects = [],
      params = [],
      i,
      j,
      ln,
      paramObject,
      value;

    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        paramObjects = paramObjects.concat(this.toQueryObjects(i, obj[i], recursive));
      }
    }

    for (j = 0, ln = paramObjects.length; j < ln; j++) {
      paramObject = paramObjects[j];
      value = paramObject.value;

      if (_utils.isEmpty(value)) {
        value = '';
      } else if (_utils.isDate(value)) {
        value =
          value.getFullYear() +
          '-' +
          Ext.String.leftPad(value.getMonth() + 1, 2, '0') +
          '-' +
          Ext.String.leftPad(value.getDate(), 2, '0') +
          'T' +
          Ext.String.leftPad(value.getHours(), 2, '0') +
          ':' +
          Ext.String.leftPad(value.getMinutes(), 2, '0') +
          ':' +
          Ext.String.leftPad(value.getSeconds(), 2, '0');
      }

      params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
    }

    return params.join('&');
  }
};

export { http, axiosInstance };
