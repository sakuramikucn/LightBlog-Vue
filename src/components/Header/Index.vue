<template>
  <!-- 头部 -->
  <el-row type="flex" justify="center" class="header">
    <!-- 导航列表 -->
    <el-col hidden-xs-only :sm="20" :md="16">
      <div class="nav f-flexja align-center">
        <!-- 导航标签 -->
        <ul class="f-flex f-flextl" >
          <li class="nav-item" v-for="(item, index) in navs" :key="index">
            <router-link :to="item.path" class="item-content">
              <nav-link :name="item.name" :icon="item.icon" />
            </router-link>
          </li>
        </ul>
        <div class="f-flex f-flextr align-center">
          <!-- 搜索 -->
          <div class="search">
            <el-input
              suffix-icon="el-icon-search"
              autosize
              size="mini"
              v-model="keyword"
              aria-placeholder="文章标题关键字"
            />
          </div>
          <!-- 登录 -->
          <router-link to="/login">
            <div class="login">登录</div>
          </router-link>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import NavLink from "components/NavLink";

export default {
  name: "Header",
  components: {
    NavLink,
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
          name: '友情链接',
          path: '/link',
          icon: 'el-icon-link'
        },
        {
          name: '留言板',
          path: '/message',
          icon: 'el-icon-tickets'
        },
        {
          name: "关于",
          path: "/about",
          icon: "el-icon-user",
        },
      ],
      keyword: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom-color: #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.nav {
  vertical-align: center;
  padding: 7px 10px;
}
.nav-item {
  text-align: center;
  width: 90px;
  height: 35px;
  padding: 7px;
  margin: 3px;
}
.search {
  margin: auto 10px;
}
.login {
  margin: auto 10px;
  padding: auto 10px;
  display: block;
}
</style>