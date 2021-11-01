<!-- studentMgt 学生管理 -->
<template>
  <div class="BaseApp-page studentMgt-wrapper">
    <header class="BaseApp-page-header">
      <div class="BaseApp-header-search">
        <el-form :inline="true" ref="searchForm" :model="queryObj">
          <el-form-item label="性别">
            <el-select v-model="queryObj.gender" clearable placeholder="请选择" @change="search">
              <el-option v-for="(item,index) in genderList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input class="input-search" placeholder="请输入学生姓名" v-model="queryObj.keyWord">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="BaseApp-header-search__btns">
          <el-button plain type="primary" @click="add">新增</el-button>
        </div>
      </div>
    </header>
    <main class="BaseApp-page-main" v-loading="dataLoading">
      <el-table ref="baseTable" class="BaseApp-table" height="100%" :data="dataList" border stripe>
        <el-table-column type="index" width="65" label="序号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentId" label="学号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="age" label="年龄" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gender" label="性别" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ renderTd(genderList, scope.row.gender) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="BaseAppp-pagination"
        layout="total, sizes, prev, pager, next"
        :current-page.sync="pageIndex"
        :page-sizes="[10, 20, 50]"
        :page-size.sync="pageSize"
        :total="rowCount"
        @size-change="search"
        @current-change="loadData"
      ></el-pagination>
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
import StudentAdd from './components/StudentAdd';

export default {
  name: 'studentMgt',
  components: { StudentAdd },
  data() {
    return {
      dataLoading: false,
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
      this.loadData();
    },

    /**
     * 搜索
     */
    search() {
      this.$data.pageIndex = 1;
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
          this.$data.dataList = res.dataList;
          this.$data.rowCount = res.rowCount;
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
            this.loadData();
          });
        })
        .catch(() => {});
    },

    /**
     * addDialog_submit
     */
    addDialog_submit({}) {
      this.$data.addDialogConfig.visible = false;
      this.loadData();
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
.studentMgt-wrapper {
}
</style>