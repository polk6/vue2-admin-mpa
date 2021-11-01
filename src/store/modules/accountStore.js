import { utils as _utils } from '../../assets/js/utils.js';

/**
 * 账户store
 */
const state = () => ({
  /**
   * token
   */
  token: '',

  /**
   * 当前账号的信息
   */
  accountInfo: null,

  /**
   * 路由tab
   */
  routerTabList: [],

  /**
   * 当前路由tab
   */
  routerTabActiveObj: {
    menuId: '',
    menuName: '',
    menuPath: ''
  },

  /**
   * menuTree
   */
  menuTree: [],

  /**
   * 主题色
   */
  theme: 'theme-classic'
});

// mutations
const mutations = {
  /**
   * 设置账号信息
   * @param {Object} accountInfo 账号对象
   */
  SET_ACCOUNT_INFO: function(state, { accountInfo }) {
    state.accountInfo = accountInfo;
  },

  /**
   * 设置token
   * @param {String} token token
   */
  SET_TOKEN: function(state, { token }) {
    state.token = token;
  },

  /**
   * 设置 menu tree
   * @param {Array} menuTree menuTree
   */
  SET_MENU_TREE: function(state, { menuTree }) {
    state.menuTree = menuTree;
  },

  /**
   * 设置路由tab
   * @param {Array} routerTabList routerTabList
   */
  SET_ROUTER_TAB_LIST: function(state, { routerTabList }) {
    state.routerTabList = routerTabList;
  },

  /**
   * 设置当前路由tab
   * @param {Object} menuObj 菜单对象
   */
  SET_ROUTER_TAB_ACTIVE_OBJ: function(state, { menuObj }) {
    state.routerTabActiveObj = menuObj;
  },

  /**
   * 设置主题
   * @param {String} theme 主题名称
   */
  SET_THEME: function(state, { theme }) {
    state.theme = theme;
  }
};

// actions
const actions = {
  /**
   * 设置个人信息
   */
  setAccountInfo: function(context, { userInfo }) {
    context.commit('SET_ACCOUNT_INFO', { accountInfo: userInfo });
  },

  /**
   * 退出
   */
  logout: function(context, payload) {
    context.commit('SET_ACCOUNT_INFO', { accountInfo: null });
    context.commit('SET_TOKEN', { token: null });
  },

  /**
   * 设置token(刷新token)
   */
  setToken: function(context, { token }) {
    context.commit('SET_TOKEN', { token: token });
  },

  /**
   * 设置 menu tree
   * @param {Array} menuTree menuTree
   */
  setMenuTree: function(context, { menuTree }) {
    context.commit('SET_MENU_TREE', { menuTree: menuTree });
  },

  /**
   * getMenuByPath
   */
  getMenuByPath: function(context, { menuPath }) {
    let menuTree = context.state.menuTree.concat();
    let menuObj = _utils.getTreeItem(menuTree, 'menuPath', menuPath);
    return menuObj;
  },

  /**
   * getMenuById
   */
  getMenuById: function(context, { menuId }) {
    let menuTree = context.state.menuTree.concat();
    let menuObj = _utils.getTreeItem(menuTree, 'menuId', menuId);
    return menuObj;
  },

  /**
   * 添加路由tab
   * @param {string} menuId 菜单id
   * @param {string} menuName 菜单标题
   * @param {string} menuPath 菜单path
   */
  addTab: function(context, { menuId, menuName, menuPath }) {
    // 1.校验
    // 去除 /#, e.g. /#/a => /a
    if (menuPath.startsWith('/#')) {
      menuPath = menuPath.substring(2);
    }
    // 第三方网址：放入统一iframepage组件进行管理
    if (menuPath.startsWith('http')) {
      menuPath = `/layout/iframePage?url=${menuPath}`;
    }

    // 2.没有menuId
    if (!menuId) {
      // 根据 menuPath 查找具体菜单
      let menuTree = context.state.menuTree.concat();
      let menuObj = _utils.getTreeItem(newMenuList, 'menuPath', menuPath);
      if (menuObj) {
        menuId = menuObj.menuId;
        menuName = menuObj.menuName;
      } else {
        // medicalAdvice/doctorAdvice?a=1 => medicalAdvice/doctorAdvice
        let len = menuPath.length;
        if (menuPath.indexOf('?') >= 0) {
          len = menuPath.indexOf('?');
        }
        let urlHash  = menuPath.substring(0, len);
        menuId = urlHash;
      }
    }

    // 3.判断是否已存在此菜单tab
    let newRouterTabList = context.state.routerTabList.concat();
    let menuIndex = newRouterTabList.findIndex((item) => {
      return item.menuId == menuId;
    });
    // 1)若不存在，添加到tab
    if (menuIndex <= -1) {
      newRouterTabList.push({ menuId, menuName, menuPath });
      context.commit('SET_ROUTER_TAB_LIST', {
        routerTabList: newRouterTabList
      });
    } else if (menuPath != newRouterTabList[menuIndex].menuPath) {
      // 2)若存在，判断menuPath是否变更
      newRouterTabList[menuIndex] = { menuId, menuName, menuPath };
      context.commit('SET_ROUTER_TAB_LIST', {
        routerTabList: newRouterTabList
      });
    }

    // 4.设置acitve tab
    context.commit('SET_ROUTER_TAB_ACTIVE_OBJ', {
      menuObj: { menuId, menuName, menuPath }
    });
  },

  /**
   * 去除路由tab
   * @param {string} menuId 菜单id
   * @param {string} menuName 菜单标题
   * @param {string} menuPath 菜单path
   */
  removeTab: function(context, { menuId, menuName, menuPath }) {
    let newRouterTabList = context.state.routerTabList.concat();
    let removeRouterTabIndex = 0;
    // 1.去除tab
    for (let i = 0; i < newRouterTabList.length; i++) {
      const routerTabItem = newRouterTabList[i];
      if (routerTabItem.menuId == menuId) {
        newRouterTabList.splice(i, 1);
        removeRouterTabIndex = i;
        break;
      }
    }
    context.commit('SET_ROUTER_TAB_LIST', {
      routerTabList: newRouterTabList
    });

    // 2.若去除的tab为激活的tab
    if (context.state.routerTabActiveObj && context.state.routerTabActiveObj.menuId == menuId) {
      // 1)删除的是最后一个
      if (removeRouterTabIndex >= newRouterTabList.length) {
        removeRouterTabIndex = newRouterTabList.length - 1;
      }
      context.commit('SET_ROUTER_TAB_ACTIVE_OBJ', {
        menuObj: newRouterTabList[removeRouterTabIndex]
      });
    }
  },

  /**
   * 设置主题名称
   * @param {String} theme 主题名称
   */
  setTheme: function(context, { theme }) {
    let classList = [];
    document.body.classList.forEach((className) => {
      if (!className.includes('theme-')) {
        classList.push(className);
      }
    });
    classList.push(theme);
    document.body.className = classList.join(' ');
    context.commit('SET_THEME', { theme: theme });
    _utils.setLocalStorage('theme', theme);
  }
};

// getters
const getters = {
  /**
   * 当前账户信息
   */
  accountInfo: function(state) {
    return state.accountInfo;
  },

  /**
   * token
   */
  token: function(state) {
    return state.token;
  },

  /**
   * menuTree
   */
  menuTree: function(state) {
    return state.menuTree;
  },

  /**
   * routerTabList
   */
  routerTabList: function(state) {
    return state.routerTabList;
  },

  /**
   * routerTabActiveObj
   */
  routerTabActiveObj: function(state) {
    return state.routerTabActiveObj;
  },

  /**
   * theme
   */
  theme: function(state) {
    return state.theme;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
