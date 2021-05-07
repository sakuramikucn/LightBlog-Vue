<template>
  <div class="menu">
    <el-menu
      :default-active="active"
      text-color="#fff"
      background-color="rgba(0,0,0,0)"
      active-color="#586"
      :router="true"
      class="bar"
    >
      <el-menu-item index="/manage/index" @click="addTab({path: '/manage/index',name: '首页'})">
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>
      <div v-for="(item) in menus" :key="item.path">
        <el-menu-item :index="item.path" v-if="!item.submenus"  @click="addTab(item)">
          <template #title>
            {{ item.name }}
          </template>
        </el-menu-item>

        <el-submenu v-if="item.submenus" :index="item.path">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(item1) in item.submenus"
            :key="item1.path"
            :index="item1.path"
             @click="addTab(item1)"
          >
            <template #title>
              {{ item1.name }}
            </template>
          </el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {toRefs,reactive} from 'vue'

export default {
  props: {
    menus: Array
  },
  setup() {
    const store = useStore()

    const state = reactive({
      active: store.state.activeTabName
    })

    const addTab = (item) => {
      const tab = {}
      tab.name = item.path,
      tab.title = item.name
      store.commit('addTab',tab)
    }

    store.watch(s => s.activeTabName,val => state.active = val)
    
    return {...toRefs(state),addTab}
  }
};
</script>

<style lang="scss">
.menu {
  min-width: 140px;

  .bar {
    min-height: 100vh;
    background: var(--color-bg-m1);
  }

  .el-submenu {
    .el-submenu__title {
      height: 45px !important;
    }
    .el-menu-item {
      padding-right: 0 !important;
      height: 40px !important;
      min-width: 140px !important;
    }
  }

  .el-menu-item {
    height: 45px !important;
  }
}
</style>