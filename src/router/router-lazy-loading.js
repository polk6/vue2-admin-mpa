/**
 * router-lazy-loading
 */
class RouterLazyLoading {
  constructor() {
    this.timeOutObj = null;
    this.loadingEl = document.getElementById('preview_loading');
    if (!this.loadingEl) {
      throw new Error('未找到loading组件');
    }
  }

  /**
   * 显示
   */
  show() {
    clearTimeout(this.timeOutObj);
    this.timeOutObj = setTimeout(() => {
      this.loadingEl.style.opacity = '';
      this.loadingEl.style.display = '';
    }, 600);
  }

  /**
   * 隐藏
   */
  hidden() {
    clearTimeout(this.timeOutObj);
    window.GLOBAL_fadeOut(this.loadingEl);
  }
}

export var routerLazyLoading = new RouterLazyLoading();
