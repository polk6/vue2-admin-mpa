<!-- tableDbClickEditDemo 学生管理 -->
<template>
  <div class="BaseApp-page tableDbClickEditDemo-wrapper">
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
          <el-button plain type="primary" @click="addRow">新增</el-button>
        </div>
      </div>
    </header>
    <main class="BaseApp-page-main" v-loading="dataLoading">
      <el-table ref="baseTable" class="BaseApp-table" height="100%" :data="dataList" :row-class-name="tableRowClassName" border stripe @row-dblclick="tableRowDoubleClickHandler">
        <el-table-column type="index" width="65" label="序号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentId" label="学号" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row._rowId == selectedRowObj._rowId">
              <el-input placeholder="请输入姓名" v-model="selectedRowObj.name"></el-input>
              <div class="table-row--edit-opr">
                <el-button @click="cancelRow(scope.$index)">取消</el-button>
                <el-button type="primary" @click="confirmRow(scope.$index)">确定</el-button>
              </div>
            </span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="205" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row._rowId == selectedRowObj._rowId">
              <el-input-number v-model="selectedRowObj.age" :min="6" :max="99"></el-input-number>
            </span>
            <span v-else>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row._rowId == selectedRowObj._rowId">
              <el-select v-model="selectedRowObj.gender" placeholder="请选择">
                <el-option v-for="(item,index) in genderList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </span>
            <span v-else>{{ renderTd(genderList, scope.row.gender) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="250" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row._rowId == selectedRowObj._rowId">
              <el-input v-model="selectedRowObj.phone" maxlength="30" show-word-limit></el-input>
            </span>
            <span v-else>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <div v-show="!selectedRowObj._rowId">
              <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
            </div>
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
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import StudenttModel from '../../models/StudenttModel';

export default {
  name: 'tableDbClickEditDemo',
  components: {},
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
      selectedRowObj: new StudenttModel(),
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
          res.dataList.forEach((item) => {
            item._rowId = item.studentId;
          });
          this.$data.dataList = res.dataList;
          this.$data.rowCount = res.rowCount;
          this.$data.selectedRowObj = new StudenttModel();
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
     * 返回tabl row class name
     */
    tableRowClassName({ row, rowIndex }) {
      if (row._rowId == this.$data.selectedRowObj._rowId) {
        return 'row-edit';
      }
    },

    /**
     * 添加row
     */
    addRow() {
      // 1.校验
      // 1)若当前已在修改row，不能再新增
      if (this.$data.selectedRowObj && this.$data.selectedRowObj._rowId) {
        this.$msg.toast('请先完成已有操作', 'error');
        return;
      }

      // 2.新的临时对象
      this.$data.selectedRowObj = Object.assign(new StudenttModel(), {
        _rowId: Date.now(),
      });

      // 3.插入到列表里
      this.$data.dataList.unshift(this.$data.selectedRowObj);
    },

    /**
     * 编辑row
     * @param {Object} rowObj 自定义对象
     */
    editRow(rowObj) {
      // 1.校验
      if (this.$data.selectedRowObj._rowId && this.$data.selectedRowObj._rowId != rowObj._rowId) {
        this.$msg.toast('请先完成已有操作', 'error');
        return;
      }

      // 2.get row
      let rowIndex = this.$data.dataList.findIndex((item) => {
        return item._rowId == rowObj._rowId;
      });
      this.$data.selectedRowObj = Object.assign({}, this.$data.dataList[rowIndex]);
    },

    /**
     * 删除row
     * @param {Object} item 自定义对象
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
     * 取消row
     */
    cancelRow() {
      // 若是临时row，去除此行
      if (this.$utils.isEmpty(this.$data.selectedRowObj.studentId)) {
        let rowIndex = this.$data.dataList.findIndex((item) => {
          return item._rowId == this.$data.selectedRowObj._rowId;
        });
        this.$data.dataList.splice(rowIndex, 1);
      }
      this.$data.selectedRowObj = new StudenttModel();
    },

    /**
     * 确定row
     */
    confirmRow() {
      // 1.校验
      let tmpOrderObj = new StudenttModel();
      tmpOrderObj = this.$data.selectedRowObj;
      if (this.$utils.isEmpty(tmpOrderObj.name)) {
        this.$msg.toast('请填写姓名', 'error');
        return;
      }

      let url = this.$apiUrl.addStudent;
      let oprTypeStr = '添加';
      if (this.$utils.hasValue(tmpOrderObj.studentId)) {
        url = this.$apiUrl.editStudent;
        oprTypeStr = '修改';
      }
      this.$data.dataLoading = true;
      this.$http
        .post(url, { params: tmpOrderObj })
        .then((res) => {
          this.$msg.toast(`${oprTypeStr}成功`);
          this.loadData();
        })
        .finally((err) => {
          this.$data.dataLoading = false;
        });
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

    /**
     * row双击 handler
     */
    tableRowDoubleClickHandler(rowObj, column, event) {
      if (rowObj._rowId != this.selectedRowObj._rowId) {
        this.editRow(rowObj);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.tableDbClickEditDemo-wrapper {
  .BaseApp-table {
    /deep/ {
      .el-table__body-wrapper {
        padding-bottom: 40px;
      }
      .el-table__row {
        &.row-edit {
          background-color: #32ae57 !important;
          td {
            background-color: #32ae57 !important;
            .cell {
              color: #ffffff;
            }
          }
          .table-row--edit-opr {
            display: flex;
            flex-direction: row;
            justify-content: center;
            position: absolute;
            bottom: -60px;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 40px;
            width: 350px;
            background-color: #32ae57;
            border-radius: 0 0 12px 12px;
            z-index: 2001;
            .el-button {
              height: 30px;
              width: 80px;
              padding: 8px 15px;
            }
          }
        }
      }
      .el-table__empty-block {
        display: none;
      }
    }
  }
}
</style>