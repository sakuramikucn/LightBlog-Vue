<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="margin-bottom: 20px"
    >
      <el-col :span="18">

        <el-form :model="params" class="flex ac">
          <el-form-item label="关键字" style="width: 300px">
            <el-input
              v-model="params.keyword"
              placeholder="关键字"
              style="width: 200px; margin-right: 20px"
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item label="状态" style="width: 300px"> 
          <el-select v-model="params.state" placeholder="状态" size="small">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="正常" :value="0"></el-option>
            <el-option label="冻结" :value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item >
          <el-button
          type="primary"
          size="mini"
          @click="getData"
          icon="el-icon-search"
          style="margin-left: 20px"
          >查询</el-button
        >
        </el-form-item>
        </el-form>   
      </el-col>

      <el-col :span="1" style="margin-right: 20px">
        <el-button type="primary" size="mini" @click="openAdd">添加</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="data"
      v-loading="loading"
      highlight-current-row
      stripe
      border
      size="small"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="昵称" prop="nickName"></el-table-column>
      <el-table-column label="角色" min-width="150" class="flex jfs">
        <template #default="scope">
          <el-popover
            v-for="item in scope.row.roles"
            :key="item.id"
            title="权限列表"
            :width="200"
            placement="top"
          >
            <template #reference>
              <el-tag type="primary" size="small" style="margin-right: 3px">{{
                handleName(item)
              }}</el-tag>
            </template>
            <el-table :data="item.rights" size="mini" stripe>
              <el-table-column label="名称" prop="name"></el-table-column>
              <el-table-column label="描述" prop="desc"></el-table-column>
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" width="70">
        <template #default="scope">
          <el-tag type="primary" size="small" v-if="scope.row.state === 0"
            >正常</el-tag
          >
          <el-tag type="warning" size="small" v-if="scope.row.state === 1"
            >冻结</el-tag
          >
          <el-tag type="danger" size="small" v-if="scope.row.state === 2"
            >已删除</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="最近登录时间">
        <template #default="scope">
          <span>{{
            scope.row.lastLoginTime
              ? formatDateTime(scope.row.lastLoginTime)
              : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" prop="lastLoginIp"></el-table-column>

      <el-table-column label="创建时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.modifiedTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="45">
        <template #default="scope">
          <el-row type="flex" justify="start" align="middle" class="button">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="openEdit(scope.$index)"
                >编辑</el-button
              >
            </el-col>
            <el-col v-if="scope.row.state === 1">
              <el-button
                type="warning"
                size="mini"
                @click="unfreez(scope.row.id)"
                >解冻</el-button
              >
            </el-col>
            <el-col v-else>
              <el-button type="warning" size="mini" @click="freez(scope.row.id)"
                >冻结</el-button
              >
            </el-col>
            <el-col v-if="scope.row.state !== 2" @click="remove(scope.row.id)">
              <el-button type="danger" size="mini">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="show" center destroy-on-close width="30%">
      <template #title>
        <span v-if="isEdit">编辑用户</span>
        <span v-else>添加用户</span>
      </template>

      <el-form :model="user" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="用户名">
              <el-input
                v-model="user.username"
                placeholder="用户名"
                size="mini"
                style="width: 300px"
                @blur="checkUser"
                :disabled="isEdit ? true : false"
                v-loading="checkLoading"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="昵称">
              <el-input
                v-model="user.nickName"
                placeholder="昵称"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="邮箱">
              <el-input
                v-model="user.email"
                placeholder="邮箱"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="角色">
              <el-select
                v-model="user.roles"
                placeholder="角色"
                multiple
                filterable
                value-key="id"
                size="mini"
                style="width: 300px"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="handleName(item)"
                  :value="item"
                  value-key="id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :loading="saveLoading"
          style="width: 300px"
        >
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-row>
      <el-col>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  searchUser,
  removeUser,
  editUser,
  freezUser,
  unfreezUser,
  addUser,
  checkUser,
} from "api/user";
import { formatDateTime } from "utils/common";
import { Role } from "api/main";
import qs from "qs";

export default {
  name: "UserListView",
  data() {
    return {
      params: {
        page: 1,
        state: null,
        pageSize: 5,
        keyword: "",
      },
      data: [],
      user: {},
      init: {
        username: "",
        nickName: "",
        email: "",
        roles: [],
      },
      total: 0,
      loading: false,
      roles: [],
      show: false,
      disable: true,
      isEdit: true,
      checkLoading: false,
      saveLoading: false,
    };
  },
  methods: {
    getData() {
      this.loading = true;
      searchUser(qs.stringify(this.params))
        .then((res) => {
          this.loading = false;
          this.data = res.content.list;
          this.total = res.content.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getRoles() {
      Role.search({}).then((res) => {
        this.roles = res.content.list;
      });
    },
    checkUser() {
      if (
        !this.user.username ||
        String(this.user.username).trim().length === 0
      ) {
        return;
      }
      this.checkLoading = true;
      checkUser(this.user.username)
        .then((res) => {
          this.checkLoading = false;
          if (res.content) {
            this.disable = false;
          } else {
            this.disable = false;
            this.$message.warning("用户名已存在");
          }
        })
        .catch(() => {
          this.checkLoading = false;
        });
    },
    remove(id) {
      removeUser(id).then((result) => {
        if (result.content) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.success("操作失败，请重试");
        }
      });
    },
    openEdit(index) {
      const arr = this.data;
      this.user = arr[index];
      this.show = true;
      this.isEdit = true;
    },
    openAdd() {
      this.user = JSON.parse(JSON.stringify(this.init));
      this.show = true;
      this.isEdit = false;
    },
    add() {
      this.saveLoading = true;
      addUser(this.user)
        .then((res) => {
          this.saveLoading = false;
          if (res.content) {
            this.$message.success("添加成功");
            this.show = false;
            this.getData();
          } else {
            this.saveLoading = false;
            this.$message.success("添加失败，请重试");
          }
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    edit() {
      this.saveLoading = true;
      editUser(this.user)
        .then((res) => {
          this.saveLoading = false;
          if (res.content) {
            this.$message.success("操作成功");
            this.show = false;
            this.getData();
          } else {
            this.saveLoading = false;
            this.$message.success("操作失败，请重试");
          }
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    save() {
      if (this.isEdit) {
        this.edit();
      } else {
        this.add();
      }
    },
    freez(id) {
      freezUser(id).then((res) => {
        if (res.content) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.success("操作失败，请重试");
        }
      });
    },
    unfreez(id) {
      unfreezUser(id).then((res) => {
        if (res.content) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.success("操作失败，请重试");
        }
      });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getData();
    },
    formatDateTime(date) {
      return formatDateTime(date);
    },
    handleName(item) {
      return item.name + (item.desc ? "(" + item.desc + ")" : "");
    },
  },
  mounted() {
    this.getData();
    this.getRoles();
  },
};
</script>

<style lang="scss" scoped>
.button {
  .el-button {
    margin-bottom: 5px;
  }
}
</style>