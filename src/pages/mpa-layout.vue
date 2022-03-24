<!-- mpa-layout: multi page application -->
<template>
  <div class="mpa-layout-wrapper">
    <!-- side -->
    <nav class="mpa-layout-side">
      <!-- 用户信息 -->
      <div class="mpa-layout-side__account">
        <div class="title">vue2-admin-mpa</div>
        <div class="theme-wrapper">
          主题:
          <el-select class="theme-select" size="small" v-model="temp_theme" @change="themChangeHandler">
            <el-option v-for="(item, index) in [{key:'theme-classic',lable:'经典蓝'},{key:'theme-red',lable:'喜庆红'}]" :key="index" :label="item.lable" :value="item.key"></el-option>
          </el-select>
        </div>
      </div>
      <el-menu class="mpa-layout-side__menu" @select="menuSelect" :unique-opened="true" :default-active="routerTabActiveObj.menuId">
        <el-submenu v-for="item in menuTree" :key="item.menuId" :index="item.menuId">
          <template slot="title">
            <i :class="item.menuIcon"></i>
            <span class="menu-name">{{item.menuName}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="subItem in item.childrens" :key="subItem.menuId" :index="subItem.menuId">{{subItem.menuName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </nav>
    <!-- main -->
    <main class="mpa-layout-main">
      <!-- tabs -->
      <el-tabs
        class="mpa-layout-main__tabs"
        type="card"
        :value="routerTabActiveObj.menuId"
        :closable="true"
        @tab-click="routerTabClickHandler"
        @tab-remove="routerTabRemoveHandler"
      >
        <el-tab-pane v-for="tabItem in routerTabList" :key="tabItem.menuId" :label="tabItem.menuName" :name="tabItem.menuId"></el-tab-pane>
      </el-tabs>
      <!-- view -->
      <div class="mpa-layout-main__view">
        <keep-alive :include="menuNameList">
          <router-view />
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'mpa-layout',
  components: {},
  data() {
    return {
      /**
       * 本地菜单
       */
      localMenuTree: [
        {
          menuId: '10',
          menuName: '学校管理',
          menuIcon: 'el-icon-eleme',
          childrens: [
            { menuId: '1001', menuName: '学生管理', menuPath: '/schoolManagement/studentMgt' },
            { menuId: '1002', menuName: '学生管理懒加载', menuPath: '/schoolManagement/studentLazyMgt' },
          ],
        },
        {
          menuId: '11',
          menuName: 'Table扩展',
          menuIcon: 'el-icon-goods',
          childrens: [{ menuId: '1101', menuName: '双击编辑', menuPath: '/tableDemo/tableDbClickEditDemo' }],
        },
        {
          menuId: '12',
          menuName: '指令扩展',
          menuIcon: 'el-icon-magic-stick',
          childrens: [{ menuId: '1201', menuName: 'tooltipAutoShow', menuPath: '/directiveDemo/tooltipAutoShowDemo' }],
        },
      ],
      /**
       * 菜单的name集合,keep-alive的:include使用
       * 添加：注册到$route事件，只有添加到子路由时才使用
       * 删除：menu tab进行关闭操作时，去除里面的元素
       */
      menuNameList: [],
      temp_theme: '',
    };
  },
  computed: {
    ...mapGetters('accountStore', ['accountInfo', 'menuTree', 'routerTabList', 'routerTabActiveObj', 'theme']),
  },
  watch: {
    routerTabActiveObj(newValue) {
      // 菜单tab发生变更，push到路由中，显示子路由
      if (newValue) {
        let url = newValue.menuPath;

        // 1.获取路由name
        let { name } = this.$router.match(url);
        if (!this.$data.menuNameList.includes(name)) {
          this.$data.menuNameList.push(name);
        }

        // 2.跳转
        this.$router.push(url);
      }
    },
  },
  created() {},
  mounted() {
    this.$store.dispatch('accountStore/setMenuTree', { menuTree: this.$data.localMenuTree });
    // 判断是否已指定子路由url
    this.setDefaultOpenMenu();

    // 主题
    this.$data.temp_theme = this.theme;
  },
  methods: {
    /**
     * 设置默认打开页面
     */
    async setDefaultOpenMenu() {
      let menuObj = null;
      // 1)含有子路由,获取指定菜单
      if (this.$route.matched && this.$route.matched.length > 1) {
        menuObj = await this.$store.dispatch('accountStore/getMenuByPath', { menuPath: this.$route.path });
      }
      if (!menuObj) {
        // 2)未找到菜单，显示第一个菜单
        menuObj = this.menuTree[0] ? this.menuTree[0].childrens[0] : null;
      }
      // 3)添加tab
      if (menuObj) {
        this.$store.dispatch('accountStore/addTab', {
          menuId: menuObj.menuId,
          menuName: menuObj.menuName,
          menuPath: menuObj.menuPath,
        });
      }
    },

    /**
     * 菜单选中
     */
    async menuSelect(menuId) {
      // 获取具体菜单
      let menuObj = await this.$store.dispatch('accountStore/getMenuById', { menuId });
      this.$store.dispatch('accountStore/addTab', {
        menuId: menuObj.menuId,
        menuName: menuObj.menuName,
        menuPath: menuObj.menuPath,
      });
    },

    /**
     * 路由tab click handler
     * @param {String} menuId 菜单id
     */
    routerTabClickHandler(tabItem) {
      let routerTabObj = this.routerTabList.find((item) => {
        return item.menuId == tabItem.name;
      });
      this.$store.dispatch('accountStore/addTab', { ...routerTabObj });
    },

    /**
     * 路由tab remove handler
     * @param {String} menuId 菜单id
     */
    routerTabRemoveHandler(menuId) {
      if (this.routerTabList.length == 1) {
        this.$msg.toast('最后一个标签不可关闭', 'warning');
        return;
      }

      // 1.get router tab obj
      let routerTabObj = this.routerTabList.find((item) => {
        return item.menuId == menuId;
      });

      // 3.remove menu name list
      let { name } = this.$router.match(routerTabObj.menuPath);
      if (this.$data.menuNameList.includes(name)) {
        let menuNameIndex = this.$data.menuNameList.findIndex((item) => {
          return item == name;
        });
        this.$data.menuNameList.splice(menuNameIndex, 1);
      }

      // 2.remove router tab
      this.$store.dispatch('accountStore/removeTab', { ...routerTabObj });
    },

    /**
     * theme ChangeHandler
     */
    themChangeHandler() {
      this.$store.dispatch('accountStore/setTheme', { theme: this.$data.temp_theme });
    },
  },
};
</script>
<style lang='scss' >
.mpa-layout-wrapper {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 14px;
  overflow-y: hidden;
  .mpa-layout-side {
    width: 200px;
    height: 100%;
    color: #d6dff7;
    background-color: #273658;
    .mpa-layout-side__account {
      display: flex;
      flex-direction: column;
      padding: 20px;
      .title {
        font-size: 18px;
        font-weight: bolder;
        color: var(--theme-ui-color-primary);
      }
    }
    .theme-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 10px 0 0 0;
      .theme-select {
        width: 115px;
        margin: 0 0 0 10px;
      }
    }
    .mpa-layout-side__menu {
      width: 100%;
      .el-submenu {
        background-color: #273658;
        .el-submenu__title {
          position: relative;
          display: flex;
          align-items: center;
          height: 30px;
          font-size: 14px;
          color: #cec9c9;
          &:hover {
            background-color: #273658 !important;
          }
          i {
            color: #cec9c9;
          }
        }
        .el-menu {
          background-color: initial;
          border-radius: 0;
          .el-menu-item-group {
            .el-menu-item-group__title {
              display: none;
            }
            .el-menu-item {
              display: flex;
              align-items: center;
              height: 24px;
              min-width: 0;
              margin: 5px 20px;
              padding: 15px 30px !important;
              color: #cec9c9;
              background-color: initial;
              border-radius: 4px;
              line-height: 1;
              &:hover {
                background-color: #0406203d;
              }
            }
          }
        }
        .el-submenu__icon-arrow {
          transform: rotateZ(90deg);
        }
        &.is-opened {
          .el-submenu__icon-arrow {
            transform: rotateZ(0deg);
          }
        }
        &.is-active {
          .active {
            font-weight: bolder;
            color: #f4f4f5;
          }
          .el-submenu__title {
            .menu-name {
              @extend .active;
            }
          }
          .el-menu {
            .el-menu-item-group {
              .el-menu-item {
                &.is-active {
                  @extend .active;
                }
              }
            }
          }
          .el-submenu__icon-arrow {
            @extend .active;
          }
        }
      }
    }
  }
  .mpa-layout-main {
    background: #f6f6f6;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;

    .mpa-layout-main__tabs {
      .el-tabs__header {
        padding: 2px 2px 0 2px;
        margin: 0;
        border-bottom: 1px solid #a2a2a2;
        .el-tabs__nav {
          border: 0;
          .el-tabs__item {
            margin-right: 1px;
            border-bottom: 1px solid #a2a2a2;
            border-radius: 10px 10px 0 0;
            background-color: #d8d8d8;
            &.is-active {
              position: relative;
              border: 1px solid #a2a2a2;
              border-bottom: 0;
              background-color: #f8f8f8;
              &::after {
                position: absolute;
                left: 0px;
                bottom: -1px;
                width: 100%;
                height: 1px;
                background-color: #f8f8f8;
                content: '';
              }
            }
          }
        }
      }
    }
    .mpa-layout-main__view {
      flex: 1;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
