/*! 学生store */

// state
const state = () => ({
  selectedStudentInfo: null, // 选中的学生
  studentList: [], // 学生列表
});

// mutations
const mutations = {
  /**
   * 设置已选择的学生信息
   * @param {Object} studentInfo studentInfo
   */
  SET_SELECTED_STUDENT_INFO: function(state, { studentInfo }) {
    state.selectedStudentInfo = studentInfo;
  },

  /**
   * 设置学生列表
   * @param {Array} studentList studentList
   */
  SET_STUDENT_LIST: function(state, { studentList }) {
    state.studentList = studentList;
  }
};

// actions
const actions = {
  /**
   * 设置已选择的学生信息
   * @param {Object} studentInfo studentInfo
   */
  setSelectedStudentInfo: function(context, { studentInfo }) {
    context.commit('SET_SELECTED_STUDENT_INFO', { studentInfo: studentInfo });
  },

  /**
   * 根据 studentId 设置已选择的学生信息
   * @param {Object} studentInfo studentInfo
   */
  setSelectedStudentInfoById: function(context, { studentId }) {
    if (context.state.studentList.length > 0) {
      let patiendInfo = context.state.studentList.find((item) => {
        return item.studentId == studentId;
      });
      if (patiendInfo) {
        context.commit('SET_SELECTED_STUDENT_INFO', { studentInfo: patiendInfo });
      } else {
        throw new Error('未找到此学生:', studentId);
      }
    }
  },

  /**
   * 设置 studentList
   * @param {Array} studentList studentList
   */
  setStudentList: function(context, { studentList }) {
    context.commit('SET_STUDENT_LIST', { studentList: studentList });

    if (studentList.length > 0 && context.state.selectedStudentInfo == null) {
      context.commit('SET_SELECTED_STUDENT_INFO', { studentInfo: studentList[0] });
    }
  }
};

// getters
const getters = {
  /**
   * 获取已选择的学生信息
   */
  selectedStudentInfo: function(state) {
    return state.selectedStudentInfo;
  },
  /**
   * 获取学生列表
   */
  studentList: function(state) {
    return state.studentList;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
