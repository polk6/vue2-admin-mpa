//----------------url配置-----------------
let VUE2_ADMIN_MPA_NEV = process.env.VUE2_ADMIN_MPA_NEV;
let _baseUrl = '';
switch (VUE2_ADMIN_MPA_NEV) {
  case 'local':
    _baseUrl = '//127.0.0.1:9093';
    break;
  case 'dev':
    _baseUrl = '//127.0.0.1:9093';
    break;
  default:
    break;
}

//----------------接口地址配置-----------------

export const apiUrl = {
  login: `${_baseUrl}/api/User/login`, // 用户登录

  /* 学校管理 */
  // - 学生管理
  getStudentById: `${_baseUrl}/student/getById`,
  getStudentPageList: `${_baseUrl}/student/getPageList`,
  addStudent: `${_baseUrl}/student/add`,
  editStudent: `${_baseUrl}/student/edit`,
  deleteStudent: `${_baseUrl}/student/delete`
};
