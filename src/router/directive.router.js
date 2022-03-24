/**
 * 组件演示路由
 */
const lazyload = (name) => () => import(`@/pages/${name}`);

export default [
  {
    path: '/directiveDemo/tooltipAutoShowDemo',
    name: 'tooltipAutoShowDemo',
    title: 'tooltipAutoShowDemo',
    component: lazyload('directiveDemo/tooltipAutoShowDemo')
  }
];
