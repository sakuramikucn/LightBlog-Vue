import { createStore } from 'vuex'
import createVuexAlong from 'vuex-along'

export default createStore({
  state: {
    currentTabIndex: '0'
  },
  mutations: {
    changeTabIndex(state,index){
      state.currentTabIndex = index
    }
  },
  actions: {
  },
  getters: {
    
  },
  modules: {
  },
  plugins: [
    createVuexAlong({
      // 设置保存的集合名字，避免同站点下的多项目数据冲突
      name: "light-blog",
    })
  ]
})
