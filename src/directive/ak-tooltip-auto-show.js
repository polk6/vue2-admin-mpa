import Vue from 'vue';
import { on, off, getStyle } from 'element-ui/src/utils/dom';

/**
 * ak-tooltip-auto-show
 * 当text没有被折叠时，不显示tooltip
 */
Vue.directive('ak-tooltip-auto-show', {
  inserted: function (el, binding, vnode) {
    if (!el.getAttribute('aria-describedby')) {
      return;
    }

    el.addEventListener('mouseenter', function (e) {
      let defalutSilent = !!Vue.config.silent;
      Vue.config.silent = true;
      vnode.componentInstance.disabled = true;
      const range = document.createRange();
      range.setStart(el, 0);
      range.setEnd(el, el.childNodes.length);
      const rangeWidth = Math.round(range.getBoundingClientRect().width);
      // console.log(rangeWidth, '  ', el.offsetWidth);
      const padding = (parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(el, 'paddingRight'), 10) || 0);
      if (rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth) {
        vnode.componentInstance.disabled = false;
      }
      Vue.config.silent = defalutSilent;
    });
  }
});
