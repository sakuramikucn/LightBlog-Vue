<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :sm="20" :md="12">
        <el-skeleton :rows="10" animated :throttle="500" :loading="loading">
          <template #default>
            {{ article.title }}
          </template>
        </el-skeleton>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import { useRoute } from "vue-router";
import { getArticle } from "api/article";
export default {
  name: "Article",
  setup() {
    console.log();
    const state = reactive({
      article: {},
      loading: false,
    });
    const route = useRoute();
    const id = route.params.id;
    state.loading = true;
    getArticle(id)
      .then((result) => {
        state.loading = false;
        state.article = result.content;
      })
      .catch(() => {
        state.loading = false;
      });
    return { ...toRefs(state) };
  },
  mounted() {
      document.title = '文章- '+this.article.title + ' | Light Blog'
  },
};
</script>

<style>
</style>