<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {},
  mounted() {
    // 设置主题
    let theme = this.$utils.getUrlParameterByName('theme');
    if (this.$utils.isEmpty(theme)) {
      theme = this.$utils.getLocalStorage('theme');
    }
    if (theme) {
      this.$store.dispatch('accountStore/setTheme', { theme });
    }
  },
  methods: {},
};
</script>

