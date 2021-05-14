<template>
  <div>
    <div class="title-c">
        <el-row type="flex" justify="start" align="middle" class="title">
          <el-col style="text-align: center">
            <h2><i :class="title.icon"></i>{{ title.name }}</h2>
          </el-col>
        </el-row>
    </div>

    <article-list :mode="mode" :params="params" v-if="title.name"></article-list>
  </div>
</template>

<script>
import ArticleList from "components/Main/ArticleList";

export default {
  name: "CommonTagDetail",
  components: {
    ArticleList,
  },
  props: {
    title: {
      type: Object,
      default: () => {
        return {
          name: "",
          icon: "",
        };
      },
    },
    params: {
      type: Object,
      default: () => {
        return {
          page: 1,
          pageSize: 5,
          keyword: "",
          public: true,
        };
      },
    },
    mode: {
      type: String,
      default: "Default",
    },
  },
};
</script>

<style scoped>
.title-c {
    margin: 0 200px;
    height: 44px;
    margin-top: 20px;
    background: #fff;
    border-radius: 10px;
}
.title {
    height: 44px;
}
</style>