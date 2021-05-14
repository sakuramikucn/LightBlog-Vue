<template>
  <div class="container">
    <el-skeleton :rows="5" :count="3" animated :loading="loading">
      <template #template>
        <div style="padding: 20px; margin-bottom: 10px">
          <el-skeleton-item
            variant="h4"
            style="width: 50%; height: 25px; margin-bottom: 8px"
          />
          <el-skeleton-item
            variant="text"
            style="height: 25px; margin-bottom: 8px"
          />
          <el-skeleton-item
            variant="text"
            style="height: 25px; margin-bottom: 8px"
          />
          <el-skeleton-item
            variant="text"
            style="height: 25px; margin-bottom: 8px"
          />
          <el-skeleton-item
            variant="text"
            style="height: 25px; margin-bottom: 8px"
          />
          <el-skeleton-item variant="text" style="width: 30%; height: 25px" />
        </div>
      </template>

      <template #default>
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
        <el-row type="flex" justify="center" v-if="articles && articles.length === 0">
          <el-col :md="15">
            <el-alert  title="无数据" :closable="false" type="info" show-icon> </el-alert>
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
    <el-row v-if="showPage">
      <el-col>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { toRefs, onMounted, reactive } from "vue";
import { searchArticle, queryByTag } from "../../api/article";
import ArticleItem from "components/Main/ArticleItem";

export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
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
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    showPage: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 转为响应式数据，类似return data{}
    const state = reactive({
      articles: [],
      loading: false,
      param: Object.assign({}, props.params),
      total: 0,
    });

    const getData = async () => {
      state.loading = true;
      const mode = props.mode;
      if (mode === "Default") {
        await searchArticle(state.param)
          .then((result) => {
            state.loading = false;
            state.articles = result.content.list;
            state.total = result.content.total;
          })
          .catch(() => {
            state.loading = false;
          });
      } else if (mode === "ForTag") {
        await queryByTag(state.param)
          .then((result) => {
            state.loading = false;
            state.articles = result.content.list;
            state.total = result.content.total;
          })
          .catch(() => {
            state.loading = false;
          });
      }
    };

    const handleSizeChange = (val) => {
      state.param.pageSize = val;
      getData();
    };

    const handleCurrentChange = (val) => {
      state.param.page = val;
      getData();
    };

    onMounted(() => {
      if(props.data.length == 0){
        getData();
      }else{
        state.articles = props.data
        state.total = props.data.length
      }
    });

    return { ...toRefs(state), getData, handleSizeChange, handleCurrentChange };
  },
};
</script>

<style lang="scss" scoped >
.container {
  margin: 30px 20px;
}
</style>