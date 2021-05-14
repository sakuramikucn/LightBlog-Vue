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
      <el-table-column label="链接" prop="url"></el-table-column>
      <el-table-column label="封面">
        <template #default="scope">
          <el-image
            :src="scope.row.coverUrl"
            v-if="scope.row.coverUrl"
            fit="scale-down"
            style="width: 100px; height: 100px"
          ></el-image>
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

      <el-table-column label="操作" min-width="75">
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

    <el-dialog v-model="show" center width="30%">
      <template #title>
        <span v-if="isEdit">编辑友情链接</span>
        <span v-else>添加友情链接</span>
      </template>

      <el-form :model="link" >
        <el-row>
          <el-col>
            <el-form-item label="名称">
              <el-input
                v-model="link.name"
                placeholder="名称"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="描述">
              <el-input
                v-model="link.desc"
                placeholder="描述"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="链接">
              <el-input
                v-model="link.url"
                placeholder="链接"
                size="mini"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="fileupload">
            <el-form-item label="封面"  :class="{hide: isHide}">
              <el-upload
                :action="getUrl"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :before-remove="handleBeforeRemove"
                :on-remove="handleRemove"
                :on-error="handleUploadError"
                :file-list="fileList"
                list-type="picture-card"
                :headers="token"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
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
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Link } from "api/main";
import { formatDateTime } from "utils/common";
import qs from "qs";

export default {
  name: "LinksView",
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keyword: "",
      },
      data: [],
      link: {
        id: "",
        name: "",
        desc: "",
        url: "",
        coverUrl: "",
      },
      init: {
        name: "",
        desc: "",
        url: "",
        coverUrl: "",
      },
      total: 0,
      loading: false,
      inputLoading: false,
      saveLoading: false,
      show: false,
      isEdit: true,
      isHide: false,
      fileList: [],
      token: {
        'Authorization': localStorage.getItem('token')
      }
    };
  },
  methods: {
    getData() {
      this.loading = true;
      Link.search(qs.stringify(this.params))
        .then((res) => {
          this.loading = false;
          this.data = res.content.list;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    remove(id) {
      Link.delete(id).then((result) => {
        if (result.content) {
          this.$message.success("操作成功");
          this.getData();
        } else {
          this.$message.success("操作失败");
        }
      });
    },
    openEdit(index) {
      this.isHide = false
      const arr = this.data;
      this.link = JSON.parse(JSON.stringify(arr[index]));
      this.show = true;
      this.isEdit = true;
      this.fileList = []
      const cover = this.link.coverUrl
      if(cover){
        this.fileList.push({url: cover})
        this.isHide = true
      }
    },
    edit() {
      this.saveLoading = true;
      Link.update(this.link)
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
      this.isHide = false
      this.show = true;
      this.isEdit = false;
      this.link = JSON.parse(JSON.stringify(this.init));
      this.fileList = []
    },
    add() {
      this.saveLoading = true;
      Link.add(this.link)
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
    handleSuccess(response) {
      if (response.content) {
        this.link.coverUrl = response.content;
        this.fileList.push({ url: response.content });
      }
    },
    handleRemove(){
      this.fileList.pop()
      this.link.coverUrl = ''
    },
    handleBeforeUpload(){
      this.isHide = true;
    },
    handleBeforeRemove(){
      this.isHide = false
    },
    handleUploadError(){
      this.isHide = false
    }
  },
  computed: {
    getUrl() {
      return process.env.VUE_APP_BASE_API_URL + "/upload";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" >
.fileupload {
  .el-upload--picture-card {
    width: 80px !important;
    height: 80px !important;
    line-height: 80px !important;
  }

  .el-upload-list__item {
    width: 120px !important;
    height: 100px !important;
  }
  .hide .el-upload {
    display: none;
  }
}
</style>