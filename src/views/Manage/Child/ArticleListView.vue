<template>
  <div>
    <!-- 查询区域 -->
    <el-form :model="param" label-width="120" label-position="left">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              v-model="param.keyword"
              placeholder="关键字"
              style="width: 200px"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="关键字类型">
            <el-select v-model="param.full" placeholder="请选择" size="small">
              <el-option label="标题关键字" :value="false"></el-option>
              <el-option label="全文关键字" :value="true"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="权限">
            <el-select v-model="param.public" placeholder="请选择" size="small">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="公开" :value="true"></el-option>
              <el-option label="私有" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="start" align="middle">
        <el-col :span="9">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="dateRange"
              placeholder="请选择"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              :default-time="defaultTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="发布时间排序">
            <el-select v-model="param.order" placeholder="请选择" size="small">
              <el-option label="降序" value="DESC"></el-option>
              <el-option label="升序" value="ASC"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4" style="margin-bottom: 20px">
          <el-button
            type="primary"
            size="mini"
            @click="query"
            icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-refresh-left"
            @click="reset"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :data="articles"
      v-loading="wait"
      highlight-current-row
      stripe
      border
      size="small"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="文章简介" prop="desc"></el-table-column>
      <el-table-column label="类别" prop="category.name"></el-table-column>
      <el-table-column label="标签">
        <template #default="scope">
          <el-tag
            type="primary"
            size="small"
            v-for="item in scope.row.tags"
            :key="item.id"
            style="margin-right: 5px"
            >{{ item.name }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="浏览数"
        prop="pageViews"
        width="60"
      ></el-table-column>
      <el-table-column
        label="回复数"
        prop="comments"
        width="60"
      ></el-table-column>
      <el-table-column
        label="作者"
        prop="author"
        min-width="50"
      ></el-table-column>

      <el-table-column label="创建时间" min-width="90">
        <template #default="scope">
          <span>{{ format(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间" min-width="90">
        <template #default="scope">
          <span>{{ format(scope.row.modifiedTime) }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="状态" width="60">
        <template #default="scope">
          <span v-if="scope.row.state === 1">正常</span>
          <span v-if="scope.row.state === 2">待删除</span>
        </template>
      </el-table-column> -->

      <el-table-column label="权限" width="50">
        <template #default="scope">
          <span v-if="scope.row.public">公开</span>
          <span v-else>私有</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="50">
        <template #default="scope">
          <el-row type="flex" justify="center" align="middle" class="button">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="edit(scope.row.id, scope.row.title)"
                >编辑</el-button
              >
            </el-col>
            <el-col v-if="scope.row.public">
              <el-button
                type="warning"
                size="mini"
                @click="handlePublic(scope.row.id, false)"
                >私有</el-button
              >
            </el-col>
            <el-col v-else>
              <el-button
                type="warning"
                size="mini"
                @click="handlePublic(scope.row.id, true)"
                >公开</el-button
              >
            </el-col>
            <el-col v-if="scope.row.state === 1" @click="deleteArticle(scope.row.id)">
              <el-button type="danger" size="mini">删除</el-button>
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
          :current-page="param.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="param.pageSize"
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
import { toRefs, onMounted, reactive } from "vue";
import { queryArticle, changeMask,removeArticle } from "api/article";
import { formatDateTime, go } from "utils/common";

export default {
  components: {},
  setup() {
    const state = reactive({
      articles: [],
      wait: false,
      param: {
        page: 1,
        pageSize: 10,
        keyword: "",
        state: 1,
        begin: null,
        end: null,
        order: "DESC",
        full: false,
        public: "",
      },
      total: 0,
      dateRange: [],
      defaultTime: [
        new Date(2000, 1, 11, 0, 0, 0),
        new Date(2000, 1, 11, 23, 59, 59),
      ],
    });

    const getData = () => {
      state.param.state = 1
      if (state.dateRange && state.dateRange.length === 2) {
        state.param.begin = state.dateRange[0];
        state.param.end = state.dateRange[1];
      }
      state.wait = true;
      queryArticle(state.param)
        .then((result) => {
          state.wait = false;
          state.articles = result.content.list;
          state.total = result.content.total;
        })
        .catch(() => {
          state.wait = false;
        });
    };

    const handleSizeChange = (val) => {
      state.param.pageSize = val;
      getData();
    };

    const handleCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    const reset = () => {
      state.param = {
        page: 1,
        pageSize: 10,
        keyword: "",
        state: "",
        begin: null,
        end: null,
        order: "DESC",
        full: false,
        public: "",
      };
      state.dateRange = [];
    };

    onMounted(() => {
      reset();
      getData();
    });

    return {
      ...toRefs(state),
      handleSizeChange,
      handleCurrentChange,
      getData,
      reset,
      go,
    };
  },
  methods: {
    format(date) {
      return formatDateTime(date);
    },
    query() {
      this.getData();
    },
    handlePublic(id, is) {
      const param = {
        public: false,
        id: id,
      };
      if (is) {
        param.public = true;
      }
      changeMask(param).then((res) => {
        if (res.code === 0) {
          if (res.content) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error("操作失败，请重试");
          }
        } else {
          this.$message.error("操作失败，请重试：", res.msg);
        }
      });
    },
    deleteArticle(id) {
      removeArticle(id).then((res) => {
        if (res.code === 0) {
          if (res.content) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error("操作失败，请重试");
          }
        }
      });
    },
    edit(id, title) {
      go("/manage/article/edit/" + id);
      this.$store.commit("addTab", {
        name: "/manage/article/edit/" + id,
        title: "编辑文章-" + title,
      });
      this.$store.commit("turnActiveTabName", "/manage/article/edit/" + id);
    },
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