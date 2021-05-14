<template>
  <div class="archives-container" v-loading="loading">
    <el-row type="flex" justify="center" class="main">
      <el-col :md="3" >
        <ul v-if="archives" class="side">
          <li
            class="side-item"
            v-for="(item, index) in archives"
            :key="index"
            @click="handleClick(index)"
          >
            {{ item.key }}
          </li>
        </ul>
      </el-col>
      <el-col :md="14">
        <div class="title-c">
          <el-row type="flex" justify="start" align="middle" class="title">
            <el-col style="text-align: center">
              <h2>{{ active }}</h2>
            </el-col>
          </el-row>
        </div>
        <article-list
          :params="params"
          v-if="render"
          :data="articles"
        ></article-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ArticleList from "../../components/Main/ArticleList.vue";
import { archives } from "api/article";

export default {
  name: "archives",
  components: {
    ArticleList,
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 5,
        begin: "",
        end: "",
        public: true,
      },
      loading: false,
      archives: [],
      articles: [],
      render: false,
      active: "",
    };
  },
  methods: {
    getData() {
      this.loading = true;
      archives()
        .then((res) => {
          this.loading = false;
          if (res.content) {
            this.archives = res.content;
            if (this.archives) {
              this.active = this.archives[0].key;
              const year = this.archives[0].year;
              const month = this.archives[0].month;
              const days = new Date(year, month + 1, 0).getDate();
              this.params.begin = new Date(year, month + 1, 1);
              this.params.end = new Date(year, month + 1, days, 23, 59, 59);
              this.articles = res.content[0].articles;
              this.render = true;
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleClick(index) {
      this.render = false;
      this.articles = this.archives[index].articles;
      this.active = this.archives[index].key;
      setTimeout(() => {
        this.render = true;
      }, 100);
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped lang="scss">
.archives-container {
  min-height: 85vh;
  background: var(--color-bg);

  .main {
    .side {
      background: #fff;
      margin: 30px 0;
      border-radius: 6px;
      padding: 10px;
      min-height: 150px;

      .side-item {
        cursor: pointer;
        margin: 6px;
        padding: 7px;
        border: 1px #ccc solid;
        border-radius: 5px;
        box-shadow: 0 0 10px 1px #eee;
        color: #999;
        font-weight: bold;
        text-align: center;
      }

      .side-item:hover {
        transform: scale(1.05);
      }
    }

    .container {
      margin-top: 5px !important;
    }
  }
}

.title-c {
  margin: 0 20px;
  height: 44px;
  margin-top: 30px;
  background: #fff;
  border-radius: 5px;
}
.title {
  height: 44px;
}
</style>