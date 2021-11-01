<!-- 学生管理：新增、修改、查看 -->
<template>
  <div class="StudentAdd-wrapper">
    <article class="BaseApp-form" v-loading="dataLoading">
      <el-form class="BaseApp-form__main--add" ref="form_cmpt" :model="formObj" :rules="form_rules" label-position="right" label-width="75px">
        <el-row class="form-row">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="formObj.name" maxlength="20" show-word-limit>></el-input>
          </el-form-item>
        </el-row>
        <el-form-item prop="age" label="年龄">
          <el-input-number v-model="formObj.age" :min="6" :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formObj.gender" placeholder="请选择">
            <el-option v-for="(item,index) in genderList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-row class="form-row">
          <el-form-item prop="phone" label="电话">
            <el-input v-model="formObj.phone" maxlength="30" show-word-limit></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <footer class="BaseApp-form__footer">
        <el-button plain type="primary" @click="cancle">取消</el-button>
        <el-button plain type="primary" @click="submit">确定</el-button>
      </footer>
    </article>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  components: {},
  props: {
    /**
     * 组件是否显示
     */
    cmptVisible: {
      default: false,
    },

    /**
     * 学生id
     */
    studentId: String,

    /**
     * 操作类型；add: 新增、edit: 编辑
     */
    oprType: {
      type: String,
      default: 'add',
      validator: function (value) {
        return ['add', 'edit'].includes(value);
      },
    },
  },
  data() {
    return {
      dataLoading: false,
      formObj: {
        studentId: '',
        name: '',
        age: 18,
        phone: '',
        gender: '男',
        phone: '',
      },
      form_rules: {
        name: [{ required: true, message: '请输入姓名' }],
      },
      genderList: [
        { value: '男', label: '男' },
        { value: '女', label: '女' },
      ],
    };
  },
  computed: {
    ...mapGetters('accountStore', ['accountInfo', 'token']),
  },
  watch: {
    cmptVisible(newValue) {
      if (newValue) {
        this.init();
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    /**
     * init
     */
    init() {
      this.$data.dataLoading = false;
      this.$refs.form_cmpt && this.$refs.form_cmpt.resetFields();
      this.$data.formObj = Object.assign(this.$data.formObj, {
        studentId: '',
        name: '',
        age: 18,
        phone: '',
        gender: '男',
        phone: '',
      });

      if (this.oprType != 'add') {
        this.$data.dataLoading = true;
        this.$http
          .get(this.$apiUrl.getStudentById, { params: { studentId: this.studentId } })
          .then((res) => {
            this.$data.formObj = Object.assign({}, this.$data.formObj, res);
          })
          .finally((err) => {
            this.$data.dataLoading = false;
          });
      }
    },

    /**
     * cancle
     */
    cancle() {
      this.$emit('cancel', {});
    },

    /**
     * 保存数据
     */
    submit() {
      this.$refs.form_cmpt.validate((valid) => {
        if (valid) {
          let url = this.$apiUrl.addStudent;
          let oprTypeStr = '添加';
          if (this.oprType == 'edit') {
            url = this.$apiUrl.editStudent;
            oprTypeStr = '修改';
          }
          this.$data.dataLoading = true;
          this.$http
            .post(url, { params: this.$data.formObj })
            .then((res) => {
              this.$msg.toast(`${oprTypeStr}成功`);
              this.$emit('submit', {}); // 事件上传
            })
            .finally((err) => {
              this.$data.dataLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang='scss' >
.StudentAdd-wrapper {
  .StudentAdd-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    padding: 30px 0 0 0;
  }
}
</style>