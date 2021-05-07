<template>
  <div class="container" v-loading="loading">
    <el-row
      v-for="(item, index) in articles"
      :key="index"
      type="flex"
      justify="center"
    >
      <el-col>
        <article-item :data="item" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { toRefs, onMounted, reactive } from "vue";
import { searchArticle } from "../../api/article";
import ArticleItem from "components/Main/ArticleItem";

export default {
  components: {
    ArticleItem,
  },
  setup() {
    // 转为响应式数据，类似return data{}
    const state = reactive({
      articles: [],
      loading: false,
      param: {
        page: 1,
        pageSize: 10,
        keyword: null,
      },
      total: 0
    });

    const getData = async () => {
      state.loading = true
      await searchArticle(state.param).then((result) => {
        state.loading = false
        state.articles = result.content.list;
        state.total = result.content.total;
      }).catch(() => {
        state.loading = false
      })
    };

    const handleSizeChange = (val) => {
      state.param.pageSize = val;
      getData()
    };

    const handleCurrentChange = (val) => {
      state.param.page = val;
      getData()
    };

    onMounted(() => {
      getData();
    });

    return { ...toRefs(state), getData, handleSizeChange, handleCurrentChange };
  }
};
</script>

<style lang="scss" scoped >
.container {
  margin: 30px 20px;
}
</style>