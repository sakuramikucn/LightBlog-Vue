import { createStore } from 'vuex'
import createVuexAlong from 'vuex-along'

export default createStore({
  state: {
    currentTabIndex: '0',
    isActive: true,
    tabs: [],
    activeTabName: '/manage/index',
    tabClosable: true,
    noKeepAliveComponent: ['EditArticleView','Editor']
  },
  mutations: {
    changeTabIndex(state,index){
      state.currentTabIndex = index
    },
    changeTabActive(state,is){
      state.isActive = is
    },
    addTab(state,payload){
      const name = payload.name
      let flag = false
      state.tabs.forEach(tab => {
        if(tab.name === name){
          flag = true
        }
      })
      if(!flag){
        state.tabs.push(payload)
      }
      state.activeTabName = name
      if(state.tabs.length > 1){
        state.tabClosable = true
      }
    },
    removeTab(state,targetName){
      const tabs = state.tabs
      let activeName = state.activeTabName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      state.activeTabName = activeName;
      state.tabs = tabs.filter(tab => tab.name !== targetName);
      if(state.tabs.length === 1){
        state.tabClosable = false
      }
    },
    turnActiveTabName(state,name){
      state.activeTabName = name
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
