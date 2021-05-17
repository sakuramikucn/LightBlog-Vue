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
      <el-table-column label="权限">
        <template #default="scope">
          <el-tag
            size="mini"
            v-for="item in scope.row.rights"
            :key="item.id"
            effect="plain"
            disable-transitions
            style="margin-right: 3px"
            >{{ handleName(item) }}</el-tag
          >
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

      <el-table-column label="操作" min-width="40">
        <template #default="scope">
          <el-row type="flex" justify="start" align="middle" class="button">
            <el-col>
              <el-button
                type="primary"
                size="mini"
                @click="openEdit(scope.$index)"
                style="margin-bottom: 5px"
                >编辑</el-button
              >
            </el-col>
            <el-col v-if="scope.row.state !== 2" @click="remove(scope.row.id)">
              <el-button type="danger" size="mini" :loading="loading">删除</el-button>
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
          :page-sizes="[5, 10, 20, 50]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          :hide-on-single-page="true"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog v-model="show" center destroy-on-close width="30%">
      <template #title>
        <span v-if="isEdit">编辑角色</span>
        <span v-else>添加角色</span>
      </template>

      <el-form :model="role">
        <el-row>
          <el-col>
            <el-form-item label="名称">
              <el-input
                v-model="role.name"
                placeholder="名称"
                size="mini"
                style="width: 300px"
                @blur="check"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="简介">
              <el-input
                v-model="role.desc"
                placeholder="简介"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="权限">
              <el-select
                v-model="role.rights"
                placeholder="权限"
                multiple
                filterable
                value-key="id"
                size="mini"
              >
                <el-option
                  v-for="item in rights"
                  :key="item.id"
                  :label="handleName(item)"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button type="primary" size="mini" @click="save" :loading="loading">
         保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Role, Right } from "api/main";
import { formatDateTime } from "utils/common";

export default {
  name: "RoleView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
        userId: "",
      },
      data: [],
      role: {
        name: "",
        desc: "",
        rights: [],
      },
      initRole: {
        name: "",
        desc: "",
        rights: [],
      },
      total: 0,
      loading: false,
      show: false,
      isEdit: true,
      rights: [],
      disable: true
    };
  },
  methods: {
    getData() {
      this.loading = true;
      Role.search(this.params)
        .then((result) => {
          this.loading = false;
          this.data = result.content.list;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getRights() {
      Right.search().then((res) => {
        this.rights = res.content.list;
      });
    },
    remove(id) {
      this.loading = true
      Role.delete(id).then((result) => {
        this.loading = false
        if (result.content) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.loading = false
          this.$message.success("操作失败");
        }
      }).catch(()=>this.loading = false)
    },
    openEdit(index) {
      const arr = this.data;
      this.role = arr[index];
      this.show = true;
      this.isEdit = true;
    },
    closeEdit() {
      //   this.show = false;
    },
    edit() {
        this.loading = true
      Role.update(this.role).then((res) => {
          this.loading = false
        if (res.content) {
          this.show = false;
          this.$message.success("操作成功");
          this.getData();
        }
      }).catch(()=>{
          this.loading = false
      })
    },
    openAdd() {
      this.show = true;
      this.isEdit = false;
      this.role = Object.assign({},this.initRole)
    },
    add() {
        this.loading = true
      Role.add(this.role).then((res) => {
          this.loading = false
        if (res.content) {
          this.$message.success("操作成功");
          this.show = false;
          this.getData();
        }
      }).catch(()=>{
          this.loading = false
      })
    },
    save() {
      if (this.isEdit) {
        this.edit();
      } else {
        this.add();
      }
    },
    check(){
      if(!this.role.name || String(this.role.name).trim().length === 0){
        return
      }
      this.loading = true;
      Role.check(this.role.name).then(res => {
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
    this.getRights();
  },
};
</script>

<style>
</style>