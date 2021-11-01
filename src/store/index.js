import Vue from 'vue';
import Vuex from 'vuex';
import accountStore from './modules/accountStore';
import studentStore from './modules/studentStore';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    accountStore,
    studentStore
  },
  strict: debug
});
