<!-- tooltipAutoShowDemo: tooltip-auto-show demo -->
<template>
  <div class="BaseApp-page tooltipAutoShowDemo-wrapper">
    <header class="BaseApp-page-header">
      <p>ak-tooltip-auto-show指令: 扩展了tooltip组件，当内容过长时才显示tooltip。当前页面中[姓名]使用了此指令。</p>
    </header>
    <main class="BaseApp-page-main">
      <!-- 标签 -->
      <div class="card-wrapper">
        <div class="card-item" v-for="(item, index) in dataList" :key="index">
          <div class="details-inner">
            <div class="details-inner__row">
              <span class="details-inner__row-name">学号:</span>
              <span class="details-inner__row-value">{{item.studentId}}</span>
            </div>
            <div class="details-inner__row">
              <span class="details-inner__row-name">姓名:</span>
              <el-tooltip placement="top" effect="dark" :content="item.name" v-ak-tooltip-auto-show>
                <span class="details-inner__row-value">{{item.name}}</span>
              </el-tooltip>
            </div>
            <div class="details-inner__row">
              <span class="details-inner__row-name">年龄:</span>
              <span class="details-inner__row-value">{{item.age}}</span>
            </div>
            <div class="details-inner__row">
              <span class="details-inner__row-name">性别:</span>
              <span class="details-inner__row-value">{{ renderTd(genderList, item.gender) }}</span>
            </div>
            <div class="details-inner__row">
              <span class="details-inner__row-name">电话:</span>
              <span class="details-inner__row-value">{{item.phone}}</span>
            </div>
          </div>
          <div class="opr-inner">
            <el-button type="text" @click.stop="editRow(item)">编辑</el-button>
            <div class="item-line"></div>
            <el-button type="text" @click.stop="deleteRow(item)">删除</el-button>
          </div>
        </div>
      </div>
      <div v-show="dataLoading" class="lazy-loading-wrapper" v-loading="dataLoading"></div>
      <div v-show="isAllDataLoaded" class="data-loaded-wrapper">数据已加载完毕</div>
    </main>
    <!-- add dialog -->
    <el-dialog
      class="BaseApp-dialog BaseApp-dialog--small"
      append-to-body
      :visible.sync="addDialogConfig.visible"
      :title="addDialogConfig.title"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <StudentAdd
        :cmptVisible="addDialogConfig.visible"
        :oprType="addDialogConfig.oprType"
        :studentId="addDialogConfig.studentId"
        @submit="addDialog_submit"
        @cancel="addDialog_cancel"
      ></StudentAdd>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import StudentAdd from '../schoolManagement/components/StudentAdd';

export default {
  name: 'tooltipAutoShowDemo',
  components: { StudentAdd },
  data() {
    return {
      dataLoading: true,
      isAllDataLoaded: false,
      pageIndex: 1,
      pageSize: 20,
      rowCount: 0,
      dataList: [],
      queryObj: {
        keyWord: '',
        gender: '',
      },
      genderList: [
        { value: '1', label: '男' },
        { value: '2', label: '女' },
      ],
      addDialogConfig: {
        visible: false,
        title: '添加',
        customOrderId: '',
      },
    };
  },
  computed: {
    ...mapGetters('accountStore', ['accountInfo', 'token']),
  },
  watch: {},
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    /**
     * init
     */
    init() {
      this.$data.pageIndex = 1;
      this.$data.dataList = [];
      this.$data.queryObj.keyWord = '';
      this.$data.isAllDataLoaded = false;
      this.loadData();
    },

    /**
     * 搜索
     */
    search() {
      this.$data.pageIndex = 1;
      this.$data.dataList = [];
      this.$data.isAllDataLoaded = false;
      this.loadData();
    },

    /**
     * 加载数据
     */
    loadData() {
      let queryParams = Object.assign({}, this.$data.queryObj, {
        pageIndex: this.$data.pageIndex,
        pageSize: this.$data.pageSize,
      });

      this.$data.dataLoading = true;
      this.$http
        .get(this.$apiUrl.getStudentPageList, { params: queryParams })
        .then((res) => {
          if (this.$data.pageIndex == 1) {
            this.$data.dataList = res.dataList;
          } else {
            this.$data.dataList = this.$data.dataList.concat(res.dataList);
          }
          this.$data.rowCount = res.rowCount;
          if (this.$data.dataList.length >= res.rowCount) {
            this.$data.isAllDataLoaded = true;
          } else {
            this.$data.pageIndex += 1;
          }
        })
        .finally((err) => {
          this.$data.dataLoading = false;
        });
    },

    /**
     * 渲染td
     * @param {Array} selectDataList select数据集合
     * @param {String} value 指定的值
     * @param {String} valuePropertyName 匹配的成员属性名称
     * @param {String} labelPropertyName 匹配的成员属性值
     */
    renderTd(selectDataList, value, valuePropertyName = 'value', labelPropertyName = 'label') {
      let selectItem = selectDataList.find((item) => {
        if (item[valuePropertyName] == '') {
          return false;
        }
        return item[valuePropertyName] == value;
      });
      if (selectItem) {
        return selectItem[labelPropertyName];
      }
      return '';
    },

    /**
     * 添加
     */
    add() {
      this.$data.addDialogConfig = Object.assign(this.$data.addDialogConfig, {
        visible: true,
        title: '添加',
        customOrderId: '',
        oprType: 'add',
      });
    },

    /**
     * 编辑row
     * @param {Object} item 自定义医嘱对象
     */
    editRow(item) {
      this.$data.addDialogConfig = Object.assign(this.$data.addDialogConfig, {
        visible: true,
        title: '编辑',
        studentId: item.studentId,
        oprType: 'edit',
      });
    },

    /**
     * 删除row
     * @param {Object} item 自定义医嘱对象
     */
    deleteRow(item) {
      this.$msg
        .confirm(`你确定要删除【${item.name}】吗？`)
        .then(() => {
          this.$http.post(this.$apiUrl.deleteStudent, { params: { studentId: item.studentId } }).then((res) => {
            this.$msg.toast(`删除成功`);
            this.search();
          });
        })
        .catch(() => {});
    },

    /**
     * addDialog_submit
     */
    addDialog_submit({}) {
      this.$data.addDialogConfig.visible = false;
      this.search();
    },

    /**
     * addDialog_cancel
     */
    addDialog_cancel() {
      this.$data.addDialogConfig.visible = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.tooltipAutoShowDemo-wrapper {
  .card-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-column-gap: 10px;
    position: relative;
    padding: 0 10px;
    .card-item {
      flex-grow: 1;
      position: relative;
      margin: 5px 0;
      padding: 10px;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.35);
      .details-inner {
        font-size: 14px;
        .details-inner__row {
          display: flex;
          position: relative;
          margin: 0 0 10px 0;
          .details-inner__row-value {
            width: 80%;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
      .opr-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0 0px 0;
        margin: 7px 0 0 0;
        border-top: 1px solid #d7dae0;
        .item-line {
          width: 1px;
          height: 25px;
          background: #d7dae0;
          margin: 0 10px;
        }
        .el-button--text {
          flex: 1;
          height: 34px;
          padding: 10px 0;
          z-index: 999;
        }
      }
    }
  }
  .lazy-loading-wrapper,
  .data-loaded-wrapper {
    text-align: center;
    margin: 30px 0;
  }
}
</style>