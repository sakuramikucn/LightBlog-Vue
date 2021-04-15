<template>
  <div>
    <el-form :model="params">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-row>
            <el-col>
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="params.title"
                  placeholder="标题"
                  width="20px"
                  maxlength="50"
                  style="width: 300px"
                  size="small"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="简介">
                <el-input
                  v-model="params.desc"
                  placeholder="简介"
                  maxlength="100"
                  type="textarea"
                  style="width: 300px"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="分类" prop="category">
                <el-select
                  v-model="params.category.id"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option
                    v-for="item in categorys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="标签" prop="tags" size="small">
                <el-select v-model="params.tags" placeholder="请选择" multiple>
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                    value-key="id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="权限">
                <el-radio-group v-model="params.public">
                  <el-radio :label="true">公开</el-radio>
                  <el-radio :label="false">私有</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="small" @click="save"
                >保存</el-button
              >
              <el-button type="danger" size="small" @click="reset"
                >重置</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16" class="editor-container">
          <el-form-item label="文章内容"> </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { Tag, Category } from "api/main";
import { getArticle, updateArticle, addArticle } from "api/article";

export default {
  data() {
    return {
      id: 0,
      params: {
        id: 0,
        title: '',
        desc: "",
        tags: [],
        category: {
          id: 0,
          name: "",
        },
        content: "",
        coverUrl: "",
        public: false,
      },
      init: {
        id: this.id,
        title: '',
        desc: "",
        tags: [],
        category: {
          id: 0,
          name: "",
        },
        content: "",
        coverUrl: "",
        public: false,
      },
      tags: [],
      categorys: [],
      isAdd: true,
    };
  },
  methods: {
    reset() {
      console.log(this.params,this.init)
      this.params = this.init;
    },
    save() {
      if (this.isAdd) {
        addArticle(this.params).then((res) => {
          if (res.content) {
            this.$message.success("保存成功");
            if (this.id) {
              this.$store.commit(
                "removeTab",
                "/manage/article/edit/" + this.id
              );
            } else {
              this.$store.commit("removeTab", "/manage/article/edit");
            }
            this.$router.push("/manage/article/list");
          } else {
            this.$message.error("保存失败，请重试");
          }
        });
      } else {
        updateArticle(this.params).then((res) => {
          if (res.content) {
            this.$message.success("保存成功");
            if (this.id) {
              this.$store.commit(
                "removeTab",
                "/manage/article/edit/" + this.id
              );
            } else {
              this.$store.commit("removeTab", "/manage/article/edit");
            }
            this.$router.push("/manage/article/list");
          } else {
            this.$message.error("保存失败，请重试");
          }
        });
      }
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.isAdd = false;
      getArticle(this.id).then((res) => {
        const str = JSON.stringify(res.content)
        this.params = JSON.parse(str);
        this.init = JSON.parse(str);
      });
    }

    Tag.search().then((res) => {
      this.tags = res.content.list;
    });

    Category.search().then((res) => {
      this.categorys = res.content.list;
    });
  },
};
</script>

<style lang="scss" socped>
.editor-container {
  min-height: 70vh;
  border: mediumaquamarine 2px solid;
}
</style>