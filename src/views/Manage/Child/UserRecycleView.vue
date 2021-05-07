<template>
  <div>
    <el-form :model="params" size="small">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="4">
          <el-form-item label="">
            <el-input
              v-model="params.keyword"
              placeholder="关键字"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-button
            type="primary"
            size="small"
            @click="getData"
            icon="el-icon-search"
            style="margin-bottom: 10px"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-form>

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
      <el-table-column
        label="昵称"
        prop="nickName"
        min-width="50"
      ></el-table-column>

      <el-table-column label="删除时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.modifiedTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="预计过期时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.expired) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="90">
        <template #default="scope">
          <el-row type="flex" justify="center" align="middle">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="restore(scope.row)"
                style="margin-bottom: 5px"
                :loading="scope.row.restoreLoading"
                >恢复</el-button
              >
            </el-col>
            <el-col>
              <el-button
                type="danger"
                size="mini"
                @click="deleteUser(scope.row)"
                :loading="scope.row.deleteLoading"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[5, 10, 25, 50]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          :hide-on-single-page="true"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { formatDateTime } from "utils/common";
import { searchUser, deleteUser, restoreUser } from "api/user";
import qs from "qs";

export default {
  name: "ArticleRecycleView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
        state: 2,
      },
      data: [],
      total: 0,
      loading: false,
    };
  },
  methods: {
    getData() {
      this.loading = true;
      searchUser(qs.stringify(this.params))
        .then((res) => {
          this.loading = false;
          if (!res.content.list) {
            this.data = [];
            return;
          }
          this.data = res.content.list;
          this.total = res.content.total;

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].restoreLoading = false;
            this.data[i].deleteLoading = false;

            let date = new Date(this.data[i].modifiedTime);
            date = new Date(date.setDate(date.getDate() + 7));
            this.data[i].expired = date;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteUser(row) {
      row.deleteLoading = true;
      deleteUser(row.id)
        .then((result) => {
          if (result.content) {
            row.deleteLoading = false;
            this.$message.success("操作成功");
            this.getData();
          } else {
            row.deleteLoading = false;
            this.$message.error("操作失败");
          }
        })
        .catch(() => {
          row.deleteLoading = false;
        });
    },
    restore(row) {
      row.restoreLoading = true;
      restoreUser(row.id)
        .then((result) => {
          if (result.content) {
            row.restoreLoading = false;
            this.$message.success("操作成功");
            this.getData();
          } else {
            row.restoreLoading = false;
            this.$message.error("操作失败");
          }
        })
        .catch(() => {
          row.restoreLoading = false;
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
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
</style>