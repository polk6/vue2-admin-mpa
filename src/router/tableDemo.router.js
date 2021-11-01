/**
 * table demo 路由
 */
const lazyload = (name) => () => import(`@/pages/${name}`);

export default [
  {
    path: '/tableDemo/tableDbClickEditDemo',
    name: 'tableDbClickEditDemo',
    title: '表格双击编辑demo',
    component: lazyload('tableDemo/tableDbClickEditDemo')
  }
];
