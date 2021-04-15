<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="margin-bottom: 20px"
    >
      <el-col :span="10">
        <el-input
          v-model="params.keyword"
          placeholder="关键字"
          style="width: 200px"
          size="small"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="getData"
          icon="el-icon-search"
          style="margin-left: 20px"
          >查询</el-button
        >
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
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="desc"></el-table-column>
      <el-table-column label="规则">
        <template #default="scope">
          <span v-if="scope.row.rule === 0">未指定</span>
          <span v-if="scope.row.rule === 1">允许</span>
          <span v-if="scope.row.rule === 2">禁止</span>
        </template>
      </el-table-column>
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

      <el-table-column label="操作" min-width="66">
        <template #default="scope">
          <el-row type="flex" justify="center" align="middle">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="openEdit(scope.$index)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" @click="remove(scope.row.id)" :loading="loading">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog v-model="show" center destroy-on-close width="30%">
      <template #title>
        <span v-if="isEdit">编辑权限</span>
        <span v-else>添加权限</span>
      </template>

      <el-form :model="right">
        <el-row>
          <el-col>
            <el-form-item label="名称">
              <el-input
                v-model="right.name"
                placeholder="名称"
                size="mini"
                @blur="check"
                style="width: 300px"
              ></el-input><span v-loading="loading"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="简介">
              <el-input
                v-model="right.desc"
                placeholder="简介"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="规则">
              <el-radio-group v-model="right.rule">
                <el-radio :label="0">未指定</el-radio>
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="2">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button type="primary" size="mini" @click="save" :loading="loading" :disabled="disable">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Right } from "api/main";
import { formatDateTime } from "utils/common";

export default {
  name: "RightView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
        userId: "",
      },
      data: [],
      right: {
        name: "",
        desc: "",
        rule: 0,
      },
      total: 0,
      loading: false,
      show: false,
      isEdit: true,
      disable: true
    };
  },
  methods: {
    getData() {
      this.loading = true;
      Right.search()
        .then((res) => {
          this.loading = false;
          this.data = res.content.list;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    remove(id) {
      this.loading = true;
      Right.delete(id).then((result) => {
        if (result.content) {
          this.loading = false
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.loading = false;
          this.$message.success("操作失败");
        }
      });
    },
    openEdit(index) {
      const arr = this.data;
      this.right = arr[index];
      this.show = true;
      this.isEdit = true;
    },
    closeEdit() {
      //   this.show = false;
    },
    edit() {
      this.loading = true;
      Right.update(this.right)
        .then((res) => {
          this.loading = false;
          if (res.content) {
            this.show = false;
            this.$message.success("操作成功");
            this.getData();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    openAdd() {
      this.show = true;
      this.isEdit = false;
    },
    add() {
      this.loading = true;
      Right.add(this.right)
        .then((res) => {
          this.loading = false;
          if (res.content) {
            this.$message.success("操作成功");
            this.show = false;
            this.getData();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    save() {
      if (this.isEdit) {
        this.edit();
      } else {
        this.add();
      }
    },
    check(){
      if(!this.right.name || String(this.right.name).trim().length === 0){
        return
      }
      this.loading = true;
      Right.check(this.right.name).then(res => {
        this.loading = false
        if(!res.content){
          this.disable = true
          this.$message.warning("名称重复")
        }else{
          this.disable = false
          this.loading = false
        }
      })
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
  },
};
</script>

<style>
</style>