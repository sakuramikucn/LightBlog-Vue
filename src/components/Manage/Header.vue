<template>
  <el-row
    type="flex"
    justify="space-between"
    align="center"
    class="header-container"
  >
    <el-col :span="12" class="flex jc ac jfs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="item in paths"
          :key="item.path"
          :to="item.path"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
      <div class="title" @click="goHome">
        <span>博客后台管理系统</span>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="info">
        <span style="cursor: pointer; margin-right: 10px">
          <i class="el-icon-user"></i>
          {{ user.nickName ? user.nickName : user.username }}
        </span>
        <span style="cursor: pointer" @click="logout">
          <i class="iconfont icon-log-out"></i><span>注销</span>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { logout } from "api/home";
import {removeUser} from "utils/common"

export default {
  name: "Manage-Header",
  props: {
    user: {
      type: Object,
      required: true,
    },
    menus: {
      type: Array,
      required: true,
    },
  },
  methods: {
    logout() {
      logout().then((result) => {
        if (result.code === 0) {
          this.$message.info("注销成功");
          removeUser()
          setTimeout(() => {
            location.href = "/login";
          }, 2000);
        } else {
          this.$message.error("注销失败");
        }
      });
    },
    getPaths(path) {
      const names = [];
      names.push({
        name: "首页",
        path: "/manage",
      });
      this.menus.forEach((element) => {
        if (path.startsWith(element.path)) {
          if (element.submenus) {
            names.push({ name: element.name, path: "" });
            element.submenus.forEach((e) => {
              if (path.startsWith(e.path)) {
                names.push(e);
              }
            });
          } else {
            names.push(element);
          }
        }
      });
      this.paths = names;
    },
    goHome(){
      this.$store.commit('turnActiveTabName','/manage/index')
      this.$router.push("/manage/index")
    }
  },
  data() {
    return {
      paths: [],
    };
  },
  mounted() {
    const active = this.$store.state.activeTabName;
    this.getPaths(active);
  },
  computed: {
    watchActive: function () {
      return this.$store.state.activeTabName;
    },
  },
  watch: {
    watchActive: function (val) {
      this.getPaths(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  color: #999;
  height: 50px;
  padding: 10px 25px;
  text-align: center;
  box-shadow: 0 2px 4px #eee;

  .title {
    font-family: "微软雅黑";
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    margin-left: 30px;
    cursor: pointer;
  }

  .info {
    line-height: 30px;
  }
}
</style>