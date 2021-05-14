<template>
  <div class="category-container">
    <el-row type="flex" justify="center">
      <el-col :md="16" class="wrap">
        <tag-list :list="categoryList" :title="{name: '分类',icon: 'el-icon-s-management'}"></tag-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TagList from "components/TagList";
import { reactive, toRefs } from "vue";
import { Category } from "api/main";
import { searchArticle } from "api/article";

export default {
  name: "Category",
  components: {
    TagList,
  },
  setup() {
    const state = reactive({
      categoryList: [],
      articles: [],
    });

    const getCategoryList =  async () => {
       await Category.search({}).then((res) => {
        if (res.content) {
          state.categoryList = res.content.list;
          for (let i = 0; i < state.categoryList.length; i++) {
            const item = state.categoryList[i];
            item.path = "/category/" + item.id;
          }


        }
      });
    };

    const getArticles = async () => {
      for (let i = 0; i < state.categoryList.length; i++) {
      const item = state.categoryList[i];
      const params = {
        category: item.id,
        simple: true,
        public: true
      };
      await searchArticle(params).then((result) => {
        if (result.content) {
          const ars = result.content.list;
          item.articleList = ars;
          item.count = ars.length;
        }
      });
    }
    }

    const getData = async () => {
      await getCategoryList()
      getArticles()
    }

    getData()
    return { ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
.category-container {
  min-height: 85vh;
  background: var(--color-bg);
}

.main {
  padding: 20px auto;
}

.wrap {
  margin: 30px auto;
}
</style>