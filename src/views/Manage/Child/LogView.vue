<template>
  <div>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      style="margin-bottom: 20px"
    >
      <el-form :model="params" label-width="80px">
        <el-col :span="6">
          <el-form-item label="关联" style="width: 300px">
            <el-input
              v-model="params.ref"
              placeholder="关联"
              style="width: 200px; margin-right: 20px"
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="分类" style="width: 300px">
            <el-select v-model="params.category" placeholder="模块" size="small">
              <el-option
                v-for="item in modules"
                :key="item.ref"
                :label="item.name"
                :value="item.ref"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              placeholder="操作时间"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              :default-time="defaultTime"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="getData"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-table
      :data="data"
      v-loading="loading"
      highlight-current-row
      stripe
      border
      size="small"
    >
      <el-table-column label="分类" prop="category" min-width="50"></el-table-column>
      <el-table-column label="关联" prop="reference" min-width="70"></el-table-column>
      <el-table-column label="操作人" prop="operator" min-width="40"></el-table-column>
      <el-table-column label="行为" prop="action" min-width="40"></el-table-column>
      <el-table-column label="描述" min-width="400">
          <template #default="scope">
              <div v-html="scope.row.what"></div>
          </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="75">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" min-width="60"></el-table-column>
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
          :hide-on-single-page="true"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { formatDateTime } from "utils/common";
import { Log } from "api/main";

export default {
  name: "LogView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        begin: null,
        end: null,
        ref: "",
        category: ""
      },
      data: [],
      total: 0,
      loading: false,
      dateRange: [],
      defaultTime: [
        new Date(2000, 1, 11, 0, 0, 0),
        new Date(2000, 1, 11, 23, 59, 59),
      ],
      modules: [
        {
          ref: "",
          name: "全部",
        },
        {
          ref: "article",
          name: "文章",
        },
        {
          ref: "user",
          name: "用户",
        },
        {
          ref: "role",
          name: "角色",
        },
        {
          ref: "right",
          name: "权限",
        },
        {
          ref: "comment",
          name: "评论",
        },
        {
          ref: "category",
          name: "分类",
        },
        {
          ref: "tag",
          name: "标签",
        },
        {
          ref: "friend_link",
          name: "友链",
        },
        {
          ref: 'job',
          name: '定时任务'
        }
      ],
    };
  },
  methods: {
    getData() {
      this.loading = true;
      if(this.dateRange && this.dateRange.length === 2){
        this.params.begin = this.dateRange[0]
        this.params.end = this.dateRange[1]
      }
      Log.search(this.params)
        .then((res) => {
          this.loading = false;
          this.data = res.content.list;
          this.total = res.content.total;
        })
        .catch(() => {
          this.loading = false;
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
      this.getData()
  },
};
</script>

<style lang="scss" scoped>

</style>