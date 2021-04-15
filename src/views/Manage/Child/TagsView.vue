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
              <el-button
                type="danger"
                size="mini"
                @click="remove(scope.row.id)"
                :loading="loading"
                >删除</el-button
              >
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
        <span v-if="isEdit">编辑分类</span>
        <span v-else>添加权限</span>
      </template>

      <el-form :model="tag">
        <el-row>
          <el-col>
            <el-form-item label="名称">
              <el-input
                v-model="tag.name"
                placeholder="名称"
                size="mini"
                @blur="check"
                style="width: 300px"
              ></el-input
              ><span v-loading="inputLoading"></span>
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
          :disabled="disable"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Tag } from "api/main";
import { formatDateTime } from "utils/common";

export default {
  name: "TagsView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
      },
      data: [],
      tag: {
        id: "",
        name: ""
      },
      init: {
          name: ''
      },
      total: 0,
      loading: false,
      inputLoading: false,
      saveLoading: false,
      show: false,
      isEdit: true,
      disable: true,
    };
  },
  methods: {
    getData() {
      this.loading = true;
      Tag.search()
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
      Tag.delete(id).then((result) => {
        if (result.content) {
          this.loading = false;
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
      this.tag = JSON.parse(JSON.stringify(arr[index]))
      this.show = true;
      this.isEdit = true;
    },
    closeEdit() {
      //   this.show = false;
    },
    edit() {
      this.saveLoading = true;
      Tag.update(this.tag)
        .then((res) => {
          this.saveLoading = false;
          if (res.content) {
            this.show = false;
            this.$message.success("操作成功");
            this.getData();
          }
        })
        .catch(() => {
          this.saveLoading = false;
        });
    },
    openAdd() {
      this.show = true;
      this.isEdit = false;
      this.tag = JSON.parse(JSON.stringify(this.init))
    },
    add() {
      this.saveLoading = true;
      Tag.add(this.tag.name)
        .then((res) => {
          this.saveLoading = false;
          if (res.content) {
            this.$message.success("操作成功");
            this.show = false;
            this.getData();
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
    check() {
      if (!this.tag.name || String(this.tag.name).trim().length === 0) {
        return;
      }
      this.inputLoading = true;
      Tag.check(this.tag.name).then((res) => {
        this.inputLoading = false;
        if (!res.content) {
          this.disable = true;
          this.$message.warning("名称重复");
        } else {
          this.disable = false;
          this.inputLoading = false;
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
  },
};
</script>

<style>
</style>