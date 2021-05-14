<template>
  <div>
    <el-form :model="params" size="small">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="6">
          <el-form-item label="关键字：">
            <el-input
              v-model="params.keyword"
              placeholder="关键字"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="文章：">
            <el-select
              v-model="params.ref"
              placeholder="文章"
              filterable
              :filter-method="handleFilter"
              style="width: 320px"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
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

        <!-- <el-col :span="10">
          <el-form-item label="评论时间：">
            <el-date-picker
              v-model="dateRange"
              placeholder="请选择"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime"
            ></el-date-picker>
          </el-form-item>
        </el-col> -->
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
      <el-table-column label="文章" prop="comment.reference">
        <template #default="scope">
          <el-link target="_blank" :href="getUrl(scope.row)">
            <span>{{ getTitle(scope.row.comment.reference) }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template #default="scope">
          <span>{{getNickName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复的评论">
        <template #default="scope">
          <div v-if="scope.row.parent">
            <p>
              @{{ getNickName(scope.row) }}：{{ scope.row.parent.content }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="scope">
          <b>{{ scope.row.comment.content }}</b>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="comment.email"> </el-table-column>
      <el-table-column label="状态" width="60">
        <template #default="scope">
          <span v-if="scope.row.comment.state === 0">正常</span>
          <span v-if="scope.row.comment.state === 1">已屏蔽</span>
        </template>
      </el-table-column>
      <el-table-column label="评论时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.comment.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" min-width="90">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.comment.modifiedTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="90">
        <template #default="scope">
          <el-row type="flex" justify="center" align="middle">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="openReply(scope.row)"
                style="margin-bottom: 5px"
                >回复</el-button
              >
            </el-col>
            <el-col>
              <el-button
                type="warning"
                size="mini"
                @click="turnStatus(scope.row, true)"
                :loading="scope.row.hideLoading"
                style="margin-bottom: 5px"
                v-if="scope.row.comment.state === 0"
                >屏蔽</el-button
              >
            </el-col>
            <el-col>
              <el-button
                type="warning"
                size="mini"
                @click="turnStatus(scope.row, false)"
                :loading="scope.row.hideLoading"
                style="margin-bottom: 5px"
                v-if="scope.row.comment.state === 1"
                >恢复</el-button
              >
            </el-col>
            <el-col>
              <el-button
                type="danger"
                size="mini"
                @click="remove(scope.row)"
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
          :page-sizes="[20, 30, 50, 100]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      v-model="show"
      title="回复评论"
      center
      destroy-on-close
      width="30%"
    >
      <el-form :model="comment" size="mini" class="reply">
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="8">
            <h4>对方评论</h4>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col>
            <span style="color: #599">@{{ temp.nickName }}</span
            ><span>：{{ temp.content }}</span>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" align="middle">
          <el-col :span="8">
            <h4>当前信息</h4>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="margin-bottom: 0"
        >
          <el-col>
            <el-form-item label="昵称">
              <el-input
                v-model="comment.nickName"
                placeholder="昵称"
                style="width: 360px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 0">
          <el-col>
            <el-form-item label="邮箱">
              <el-input
                v-model="comment.email"
                placeholder="昵称"
                style="width: 360px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="8">
            <h4>回复内容</h4>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
          <el-col>
            <el-input
              v-model="comment.content"
              placeholder="内容"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button
          type="primary"
          @click="reply"
          size="small"
          :loading="saveLoading"
          style="width: 400px"
          >回复</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Comment } from "api/main";
import { formatDateTime, getUser } from "utils/common";
import { searchArticle } from "api/article";

export default {
  name: "CommentListView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 25,
        keyword: "",
        ref: "",
        type: 1,
      },
      data: [],
      temp: {},
      comment: {},
      total: 0,
      loading: false,
      saveLoading: false,
      show: false,
      dateRange: [],
      defaultTime: [
        new Date(2000, 1, 11, 0, 0, 0),
        new Date(2000, 1, 11, 23, 59, 59),
      ],
      articles: [],
      options: [],
    };
  },
  methods: {
    getData() {
      // if (this.dateRange && this.dateRange.length === 2) {
      //   this.params.begin = this.dateRange[0];
      //   this.params.end = this.dateRange[1];
      // }
      this.loading = true;
      Comment.query(this.params)
        .then((res) => {
          this.loading = false;
          if (!res.content.list) {
            this.data = [];
            return;
          }
          this.data = res.content.list;
          this.total = res.content.total;

          for (let i = 0; i < this.data.length; i++) {
            const item = this.data[i]
            item.hideLoading = false;
            item.deleteLoading = false;

            if (item.childList){
              for (let obj of item.childList){
                obj.hideLoading = false;
                 obj.deleteLoading = false;
              }
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    remove(row) {
      row.deleteLoading = true;
      Comment.remove(row.comment.id).then((result) => {
        if (result.content) {
          row.deleteLoading = false;
          this.$message.success("操作成功");
          this.getData();
        } else {
          row.deleteLoading = false;
          this.$message.success("操作失败");
        }
      });
    },
    openReply(row) {
      this.temp = row.comment;
      this.show = true;
    },
    reply() {
      this.saveLoading = true;
      const params = {
        reference: this.temp.reference,
        parentId: this.temp.id,
        subReference: this.temp.subReference ? this.temp.subReference : this.temp.parentId,
        nickName: this.comment.nickName,
        email: this.comment.email,
        content: this.comment.content,
        type: 1,
        username: this.comment.username
      };
      if(!this.temp.subReference){
        params.subReference = params.parentId
      }
      Comment.add(params)
        .then((result) => {
          if (result.content) {
            this.saveLoading = false;
            this.$message.success("操作成功");
            this.getData();
            this.show = false;
          } else {
            this.saveLoading = false;
            this.$message.success("操作失败");
          }
        })
        .catch(() => (this.saveLoading = false));
    },
    turnStatus(row, isHide) {
      row.hideLoading = true;
      Comment.hide(row.comment.id, isHide).then((result) => {
        if (result.content) {
          row.hideLoading = false;
          this.$message.success("操作成功");
          this.getData();
        } else {
          row.hideLoading = false;
          this.$message.success("操作失败");
        }
      });
    },
    handleFilter(val) {
      if (!val) {
        this.options = this.articles;
      }
      const list = this.articles;
      this.options = list.filter(
        (v) => v.title.indexOf(val) >= 0 || v.id === val
      );
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
    getTitle(id) {
      const list = this.articles;
      for (let i = 0; i < list.length; i++) {
        let ar = list[i];
        if (id === ar.id) {
          return ar.title;
        }
      }
      return id;
    },
    getNickName(row){
      let nickName = row.comment.nickName
      const type = row.comment.roleType
      if (type === 1){
        nickName =  nickName + '(管理员)'
      }
      else if (type === 2){
        nickName =  nickName + '(作者)'
      }
      return nickName
    },     
    getArticles() {
      const params = {
        simple: true,
        public: true,
      };
      searchArticle(params).then((res) => {
        if (res.content) {
          (this.articles = res.content.list),
            this.articles.unshift({ id: "", title: "全部" });
          this.options = Object.assign({}, this.articles);
        }
      });
    },
    getUrl(row){
      return process.env.VUE_APP_BASE_URL+'/article/'+row.comment.reference
    }
  },
  mounted() {
    this.getData();
    const me = getUser();
    Object.assign(this.comment, me);
    this.getArticles();
  },
};
</script>

<style scoped>
.reply h4 {
  text-align: center;
}
.reply .el-row {
  margin-bottom: 10px;
}
</style>