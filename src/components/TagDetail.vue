<template>
  <div>
    <div class="title-c">
        <el-row type="flex" justify="start" style="title">
          <el-col style="text-align: center">
            <h2><i :class="title.icon"></i>{{ title.name }}</h2>
          </el-col>
         
        </el-row>
    </div>

    <article-list :mode="mode" :params="params"></article-list>
  </div>
</template>

<script>
import ArticleList from "components/Main/ArticleList";
import {watch} from 'vue'

export default {
  name: "TagDetail",
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
  setup(props) {
      console.log(props.title)
      watch(()=>props.title,(val)=>{
          console.log('22',val)
      },{deep: true})
  }
};
</script>

<style scoped>
.title-c {
    margin: 0 200px;
    height: 50px;
    margin-top: 20px;
    background: #fff;
    border-radius: 5px;
}
.title {
    
}
</style>