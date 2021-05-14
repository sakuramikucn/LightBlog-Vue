<template>
  <div class="side-bar-container">
    <!-- 个人简介 -->
    <el-row type="flex" justify="center">
      <el-col>
        <me-info />
      </el-col>
    </el-row>

    <!-- 最热文章 -->
    <el-row type="flex" justify="center">
      <el-col v-loading="articleLoading">
        <sort-list :title="'热门文章'" :data="articles" v-if="articles.length > 0" key="article"></sort-list>
      </el-col>
    </el-row>

    <!-- 最热分类-->
    <el-row type="flex" justify="center">
      <el-col v-loading="categoryLoading">
        <sort-list :title="'热门分类'" :data="categorys" v-if="categorys.length > 0" key="category"></sort-list>
      </el-col>
    </el-row>

    <!-- 最热标签-->
    <el-row type="flex" justify="center">
      <el-col v-loading="tagLoading">
        <sort-list :title="'热门标签'" :data="tags" v-if="tags.length > 0" key="tag"></sort-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MeInfo from "components/Main/MeInfo";
import SortList from "./SortList.vue";
import { searchArticle } from "api/article";
import {Category} from 'api/main'

export default {
  name: "SideBar",
  components: {
    MeInfo,
    SortList,
  },
  data() {
    return {
      articles: [],
      categorys: [],
      tags: [],
      articleLoading: false,
      categoryLoading: false,
      tagLoading: false,
    };
  },
  methods: {
    getArticleList() {
      this.articleLoading = true;
      const params = {
        public: true,
        simple: true,
        page: 1,
        pageSize: 5,
        hotOrderBy: true,
      };
      searchArticle(params)
        .then((res) => {
          this.articleLoading = false;
          if (res.content) {
            const arr = res.content.list;
             for (let i = 0; i < arr.length; i++) {
              const item = arr[i];
              item.path = "/article/" + item.id;
              item.name = item.title
            }
            this.articles = arr;
          }
        })
        .catch(() => (this.articleLoading = false));
    },
    getCategoryList() {
      this.categoryLoading = true;
      Category.hot()
        .then((res) => {
          this.categoryLoading = false;
          if (res.code === 0) {
            let arr = res.content;
            if(arr.length > 5){
              arr = arr.slice(0,5)
            }
            for (let i = 0; i < arr.length; i++) {
              const item = arr[i];
              item.path = "/category/" + item.id;
            }
            this.categorys = arr;
          }
        })
        .catch(() => (this.categoryLoading = false));
    },
    getTagList() {
      this.tagLoading = true;
      
    },
  },
  created() {
    this.getArticleList()
    this.getCategoryList()
    // this.getTagList()
    
  },
};
</script>

<style lang="scss" scoped>
.side-bar-container {
  margin: 30px 0;
  min-height: 40vh;
}
</style>