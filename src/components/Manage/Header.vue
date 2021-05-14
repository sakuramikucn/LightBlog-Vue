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
        <el-dropdown trigger="click" size="small">
          <span style="cursor: pointer">
            <i class="el-icon-user"></i>
            {{ user.nickName ? user.nickName : user.username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                icon="iconfont icon-mima_huaban1"
                @click="openForm"
              >
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item icon="iconfont icon-log-out" @click="logout">
                <span>注销</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-col>

    <el-dialog v-model="show" center destroy-on-close width="30%">
      <template #title>
        <span>修改密码</span>
      </template>

      <el-form :model="account" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="新密码">
              <el-input
                type="password"
                v-model="account.password"
                placeholder="新密码"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button
          type="primary"
          size="mini"
          @click="change"
          :loading="saveLoading"
          style="width: 300px"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import { logout } from "api/home";
import { removeUser } from "utils/common";
import { changePassword } from "api/user";
import { getUser } from "utils/common";

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
  data() {
    return {
      paths: [],
      account: {
        id: "",
        username: "",
        password: "",
      },
      show: false,
      saveLoading: false,
    };
  },
  methods: {
    logout() {
      logout().then((result) => {
        if (result.code === 0) {
          this.$message.info("注销成功");
          removeUser();
          localStorage.removeItem('token')
          setTimeout(() => {
            location.href = "/login";
          }, 1000);
        } else {
          this.$message.error("注销失败");
        }
      });
    },
    openForm() {
      this.show = true;
    },
    change() {
      const user = getUser();
      this.account.id = user.id;
      this.account.username = user.username;
      this.saveLoading = true;
      changePassword(this.account)
        .then((result) => {
          this.saveLoading = false;
          if (result.content === true) {
            this.$message.success("修改成功");
            removeUser();
            setTimeout(() => {
              location.href = "/login";
            }, 1000);
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(() => (this.saveLoading = false));
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
    goHome() {
      this.$store.commit("turnActiveTabName", "/manage/index");
      this.$router.push("/manage/index");
    },
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
  background: #fff;

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