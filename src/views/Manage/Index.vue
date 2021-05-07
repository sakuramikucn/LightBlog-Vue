<template>
  <el-container class="manage">
    <!-- 菜单栏 -->
    <el-affix>
      <el-aside width="150px" class="aside">
        <c-menu :menus="menus"></c-menu>
      </el-aside>
    </el-affix>

    <!-- 内容 -->
    <el-container class="container">
      <!-- 头部 -->
      <el-affix>
        <el-header>
          <c-header :user="user" :menus="menus"></c-header>
        </el-header>
      </el-affix>

      <!-- 主内容 -->
      <el-main>
        <!-- 标签栏 -->
        <tabs />
        <!-- 路由视图 -->
        <router-view v-slot="{ Component }">
          <transition name="router-fade" mode="out-in">
              <keep-alive :exclude="$store.state.noKeepAliveComponent">
                <component :is="Component"/>
              </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <el-backtop></el-backtop>

      <!-- 底部 -->
      <el-footer>
        <c-footer></c-footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Footer from "components/Footer/Index";
import Header from "components/Manage/Header";
import Menu from "components/Manage/Menu";
import Tabs from "components/Manage/Tabs";
import { getUserByToken } from "api/user";
import { setUser, getUser } from "utils/common";

export default {
  name: "Manage",
  components: {
    "c-footer": Footer,
    "c-header": Header,
    "c-menu": Menu,
    Tabs,
  },
  data() {
    return {
      user: {},
      menus: [
        {
          name: "文章管理",
          path: "/manage/article",
          submenus: [
            {
              name: "写文章",
              path: "/manage/article/add",
            },
            {
              name: "文章列表",
              path: "/manage/article/list",
            },
          ],
        },
        {
          name: "用户管理",
          path: "/manage/user/list",
        },
        {
          name: "权限管理",
          path: "/manage/role",
          submenus: [
            {
              name: "角色",
              path: "/manage/role/list",
            },
            {
              name: "权限",
              path: "/manage/right/list",
            },
          ],
        },
        {
          name: "类别管理",
          path: "/manage/category/list",
        },
        {
          name: "标签管理",
          path: "/manage/tag/list",
        },
        {
          name: "评论管理",
          path: "/manage/comment",
          submenus: [
            {
              name: "留言板",
              path: "/manage/comment/board",
            },
            {
              name: "文章评论",
              path: "/manage/comment/article",
            },
          ],
        },
        {
          name: "友链管理",
          path: "/manage/link/list",
        },
        {
          name: "日志管理",
          path: "/manage/log/list",
        },
        {
          name: "回收站",
          path: "/manage/recycle",
          submenus: [
            {
              name: "文章",
              path: "/manage/recycle/article",
            },
            {
              name: "用户",
              path: "/manage/recycle/user",
            },
            {
              name: "评论",
              path: "/manage/recycle/comment",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // 获取登录信息
    const cache = getUser();
    if (cache) {
      this.user = cache;
      return;
    }
    getUserByToken().then((result) => {
      if (result.code === 0) {
        this.user = result.content;
        setUser(this.user);
      } else {
        this.$message.error("获取用户数据失败");
      }
    });
  },
};
</script>

<style scoped>
/* 动画过程 */
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity .2s ease-in;
}
/* 动画起止 */
.router-fade-enter-from,
.router-fade-leave-to {
  opacity: 0;
}

.manage .el-header {
  padding: 0;
  height: 50px !important;
}
.manage .el-footer {
  padding: 0;
}
.container {
  min-height: 84.8vh;
  margin-left: 10px;
}
.manage .aside {
  min-height: 100vh;
  background: var(--color-bg-m1);
}
</style>