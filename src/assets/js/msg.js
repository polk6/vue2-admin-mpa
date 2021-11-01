let _vueObj = null; // Vue实例对象
let _loadingObj = null;
let _loadingTimer = null;

/**
 * 消息模块
 * 包含：确认框、信息提示框
 * @requires element-ui
 */
var msg = {
  /**
   * 提示框
   * @param {String} msg 信息内容 success / info(默认) / warning / error
   */
  alert: function(msg, type = '') {
    return _vueObj.$alert(msg, '提示', {
      type,
      confirmButtonText: '确定'
    });
  },

  /**
   * 确认框
   * @param {String} msg 信息内容
   */
  confirm: function(msg, callback) {
    return _vueObj.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    });
  },

  /**
   * 显示正在加载
   * @param {String} title 显示的title
   */
  showLoading: function(title) {
    this.hideLoading();
    if (!_vueObj) {
      return;
    }
    _loadingObj = _vueObj.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    // 5秒后自行关闭
    _loadingTimer && clearTimeout(_loadingTimer);
    _loadingTimer = setTimeout(() => {
      _loadingObj && _loadingObj.close();
    }, 5000);
  },

  /**
   * 关闭正在加载
   */
  hideLoading: function() {
    _loadingObj && _loadingObj.close();
    _loadingTimer && clearTimeout(_loadingTimer);
  },

  /**
   * 自动消失的提示框
   * @param {String} msg 信息内容
   * @param {String} type 消息类型； success(默认) / info / warning / error
   */
  toast: function(msg, type = 'success') {
    _vueObj.$message({
      message: msg,
      type: type
    });
  }
};

/**
 * 注册到Vue上
 * @param {Vue} Vue
 */
msg.install = Vue => {
  _vueObj = Vue.prototype;
};

export default msg;
