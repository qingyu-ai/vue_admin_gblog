import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    RoleList: ''
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setRoleList (state, roleList) {
      state.RoleList = roleList
    }
  },
  actions: {
    async selectRoleList (context) {
      const { data: res } = await axios.get('/commonAdmin/selectRoleList')
      console.log(res.data)
      context.commit('setRoleList', res.data.roleList.list)
    }
  },
  getters: {
    showRoleList (state) {
      return state.RoleList
    }
  },
  modules: {}
})
