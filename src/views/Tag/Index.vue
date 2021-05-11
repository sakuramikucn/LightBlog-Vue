<template>
  <div class="category-container">
    <el-row type="flex" justify="center">
      <el-col :md="16" class="wrap">
        <tag-list :list="categoryList" :title="{name: '标签',icon: 'el-icon-collection-tag'}"></tag-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TagList from "components/TagList";
import { reactive, toRefs } from "vue";
import { Tag } from "api/main";
import { queryByTag } from "api/article";

export default {
  name: "Tag",
  components: {
    TagList,
  },
  setup() {
    const state = reactive({
      categoryList: [],
      articles: [],
    });

    const getCategoryList =  async () => {
       await Tag.search({}).then((res) => {
        if (res.content) {
          state.categoryList = res.content.list;
          for (let i = 0; i < state.categoryList.length; i++) {
            const item = state.categoryList[i];
            item.path = "/tag/" + item.id;
          }
        }
      });
    };

    const getArticles = async () => {
      for (let i = 0; i < state.categoryList.length; i++) {
      const item = state.categoryList[i];
      const params = {
        tagId: item.id,
        simple: true,
        public: true
      };
      await queryByTag(params).then((result) => {
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
  margin: 20px auto;
}
</style>