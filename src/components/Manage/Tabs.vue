<template>
  <div>
    <el-tabs
      v-model="active"
      type="card"
      @tab-click="clickTab"
      @tab-remove="removeTab"
      :closable="closable"
    >
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :name="item.name"
        :label="item.title"
        lazy
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      tabs: [],
      active: "/manage/index",
      closable: true,
    });

    const getData = () => {
      state.tabs = store.state.tabs;
      const route = useRoute();
      if (route.fullPath === "/manage/index") {
        // 初始化为首页
        addTab();
      } else {
        const path = store.state.activeTabName;
        state.active = path;
        router.push(path);
      }
    };

    const addTab = (tab) => {
      if (!tab) {
        tab = {
          name: "/manage/index",
          title: "首页",
        };
      }
      store.commit("addTab", tab);
    };

    const clickTab = (tab) => {
      const path = tab.props.name;
      state.active = path;
      store.commit("turnActiveTabName", path);
      router.push(path);
    };

    const removeTab = (name) => {
      store.commit("removeTab", name);
      router.push(state.active);
    };

    onMounted(() => {
      getData();
    });

    store.watch(
      (s) => s.activeTabName,
      (val) => {
        state.active = val;
        router.push(val);
      }
    );

    store.watch(
      (s) => s.tabs,
      (val) => {
        state.tabs = val;
      }
    );

    store.watch(
      (s) => s.tabClosable,
      (val) => {
        state.closable = val;
      }
    );

    return { ...toRefs(state), clickTab, removeTab };
  },
};
</script>

<style>
</style>