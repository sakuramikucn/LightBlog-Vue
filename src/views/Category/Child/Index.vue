<template>
  <div>
    <el-row type="flex" justify="center" class="container">
      <el-col :md="16">
        <tag-detail :title="title" :params="params" v-if="tag.name"></tag-detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TagDetail from "components/TagDetail";
import { Category } from "api/main";
import { reactive,toRefs } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CategoryDetail",
  components: {
    TagDetail,
  },
  setup() {
    const route = useRoute();
    const id = route.params.id;

    const state = reactive({
      tag: {
        id: '',
        name: ''
      },
      params: {
        page: 1,
        pageSize: 5,
        keyword: "",
        public: true,
        category: "",
      },
      title: { 
        name: '', 
        icon: "el-icon-collection" },
    });

    state.params.category = id

    Category.get(id).then((result) => {
      if (result.content) {
        state.tag.name = result.content.name;
        state.title.name = result.content.name
      }
    });

   return {...toRefs(state)}
  },
};
</script>

<style scoped>
.container {
  min-height: 85vh;
  background: var(--color-bg);
}
</style>