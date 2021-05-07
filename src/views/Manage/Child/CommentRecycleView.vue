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
      row-key="comment.id"
      :tree-props="{ children: 'childList' }"
    >
      <el-table-column label="ID" prop="comment.id"></el-table-column>
      <el-table-column label="关联" prop="comment.reference"> </el-table-column>
      <el-table-column label="昵称">
        <template #default="scope">
          <span>{{ getNickName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="scope">
          <b>{{ scope.row.comment.content }}</b>
        </template>
      </el-table-column>

      <el-table-column label="删除时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.comment.modifiedTime) }}</span>
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
                @click="deleteComment(scope.row)"
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
import { Comment } from "api/main";

export default {
  name: "CommentRecycleView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
        state: 2,
        type: "",
      },
      data: [],
      total: 0,
      loading: false,
    };
  },
  methods: {
    getData() {
      this.loading = true;
      Comment.query(this.params)
        .then((res) => {
          this.loading = false;
          if (!res.content.list) {
            this.data = [];
            return;
          }
          // let list = res.content.list;
          // list = list.sort((a, b) => a.markDelTime - b.markDelTime);
          this.data = res.content.list;
          this.total = res.content.total;

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].restoreLoading = false;
            this.data[i].deleteLoading = false;

            let date = new Date(this.data[i].comment.modifiedTime);
            date = new Date(date.setDate(date.getDate() + 7));
            this.data[i].expired = date;

            if (this.data[i].childList) {
              for (let obj of this.data[i].childList) {
                obj.hideLoading = false;
                obj.deleteLoading = false;
                let date2 = new Date(obj.comment.modifiedTime);
                date2 = new Date(date2.setDate(date2.getDate() + 7));
                obj.expired = date2;
              }
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteComment(row) {
      row.deleteLoading = true;
      Comment.delete(row.comment.id)
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
      Comment.restore(row.comment.id)
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
    getNickName(row) {
      let nickName = row.comment.nickName;
      const type = row.comment.roleType;
      if (type === 1) {
        nickName = nickName + "(管理员)";
      } else if (type === 2) {
        nickName = nickName + "(作者)";
      }
      return nickName;
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