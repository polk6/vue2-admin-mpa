/**
 * 学校管理路由
 * schoolManagement
 */
const lazyload = (name) => () => import(`@/pages/${name}`);

export default [
  {
    path: '/schoolManagement/studentMgt',
    name: 'studentMgt',
    title: '学生管理',
    component: lazyload('schoolManagement/studentMgt')
  },
  {
    path: '/schoolManagement/studentLazyMgt',
    name: 'studentLazyMgt',
    title: '学生管理懒加载',
    component: lazyload('schoolManagement/studentLazyMgt')
  }
];
