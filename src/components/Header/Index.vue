<template>
  <div>
    <!-- 头部 -->
    <el-row type="flex" justify="center" class="header">
      <el-col :sm="20" :md="16">
        <div class="f-jsac nav hidden-xs-only">
          <!-- 导航列表 -->
          <el-tabs v-model="tabIndex" class="tab" :class="{ bottom: !isActive }" @tab-click="tabClick">
            <el-tab-pane
              v-for="(item, index) in navs"
              :key="index"
              :lazy="true"
              :name="index + ''"
            >
              <template #label>
                <router-link :to="item.path" class="item-content">
                  <nav-link :name="item.name" :icon="item.icon" />
                </router-link>
              </template>
            </el-tab-pane>
          </el-tabs>
          <div class="f-jcac">
            <!-- 搜索 -->
            <div class="search">
              <el-input
                suffix-icon="el-icon-search"
                autosize
                size="mini"
                v-model="keyword"
                aria-placeholder="文章标题关键字"
              >

              </el-input>
            </div>
            <!-- 登录 -->
            <router-link to="/login" v-if="!user">
              <div class="login f-jcac"><i class="iconfont icon-log-in" style="margin-right: 3px"></i>登录</div>
            </router-link>
            <!-- 已登录 -->
            <router-link to="/manage/index" v-if="user">
              <div class="login f-jcac"><i class="iconfont icon-log-in" style="margin-right: 3px"></i>后台</div>
            </router-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="cneter" class="header">
      <el-col class="hidden-sm-only" :md="0">
        <div class="title">首页</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { toRefs, reactive } from "vue";
import NavLink from "components/NavLink";
import {getUser} from 'utils/common'

export default {
  name: "Header",
  components: {
    NavLink,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      tabIndex: store.state.currentTabIndex,
      isActive: store.state.isActive,
      vstore: store
    });
    return {
      ...toRefs(state),
      tabClick: (tab) => {
        store.commit("changeTabIndex", tab.index);
      },
    };
  },
  data() {
    return {
      navs: [
        {
          name: "首页",
          path: "/",
          icon: "el-icon-house",
        },
        {
          name: "分类",
          path: "/category",
          icon: "el-icon-collection",
        },
        {
          name: "标签",
          path: "/tags",
          icon: "el-icon-collection-tag",
        },
        {
          name: "归档",
          path: "/archives",
          icon: "el-icon-box",
        },
        {
          name: "友情链接",
          path: "/link",
          icon: "el-icon-link",
        },
        {
          name: "留言板",
          path: "/message",
          icon: "el-icon-tickets",
        },
        {
          name: "关于",
          path: "/about",
          icon: "el-icon-user",
        },
      ],
      keyword: ""
    };
  },
  computed: {
    monitor(){
      return this.vstore.state.isActive
    },
    user(){
      return getUser()
    }
  },
  watch: {
    monitor(){
      this.isActive = this.vstore.state.isActive
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom-color: #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .title {
    display: block;
    height: 44px;
    color: var(--color-text);
    text-align: center;
    line-height: 34px;
    font-size: 16px;
    padding: 5px;
  }
  .search {
    margin: auto 10px;
  }
  .login {
    margin: auto 10px;
    padding: auto 10px;
    display: block;
  }
}
</style>

<style lang="scss">
.tab .el-tabs__header {
  vertical-align: center;
  margin: 5px auto auto auto;
}
.tab .el-tabs__nav-wrap::after {
  position: static !important;
}
.bottom {
  .el-tabs__active-bar {
  width: 0px !important;
}
}
</style>