<template>
  <div class="article-container">
    <!-- 标题 -->
    <el-row class="title" type="flex" justify="center">
      <el-col :md="12">
        <h2>{{ article.title }}</h2>
      </el-col>
      <el-col class="hidden-sm-only" :md="4"></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="20">
      <el-col :sm="24" :md="12">
        <!-- 内容 -->
        <el-skeleton :rows="10" animated :throttle="500" :loading="loading">
          <template #default>
            <el-card class="card">
              <template #header>
                <!-- 文章信息 -->
                <el-row
                  type="flex"
                  justify="start"
                  align="center"
                  :style="{ margin: '10px 0' }"
                >
                  <el-col :span="1">
                    <el-avatar
                      icon="el-icon-user-solid"
                      size="small"
                    ></el-avatar>
                  </el-col>
                  <el-col :span="18" :style="{ 'margin-left': '10px' }">
                    <div>{{ article.author }}</div>
                    <div style="font-size: 10px; color: #666">
                      <span>发布时间 {{ format(article.createTime) }}</span>
                      &nbsp;
                      <span>更新时间 {{ format(article.modifiedTime) }}</span>
                      &nbsp; <span>阅读 {{ views }}</span> &nbsp;
                      <span>评论 {{ commentNum }} </span>
                    </div>
                  </el-col>
                </el-row>
              </template>
              <div class="article-wrap">
                <section class="article-content">
                  {{ article.content }}
                </section>
                <div class="article-footer">
                 
                  <el-row>
                    <el-col>
                      <span>文章分类：</span>
                      <el-tag v-if="article.category">{{article.category.name}}</el-tag>
                    </el-col>
                  </el-row>
                   <el-row>
                    <el-col>
                      <span>标签：</span>
                      <div v-if="article.tags.length > 0">
                        <el-tag v-for="(item,index) in article.tags" :key="index">{{item.name}}</el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>

            <!-- 评论 -->
            <comment :aid="article.id"></comment>
          </template>
        </el-skeleton>
      </el-col>

      <!-- 目录栏 -->
      <el-col class="hidden-sm-only" :md="4">
        <aside>
          <el-card>
            <template #header>
              <div :style="{ 'text-align': 'center' }">
                <span>目录</span>
              </div>
            </template>
          </el-card>
        </aside>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import { useRoute } from "vue-router";
import { getArticle } from "api/article";
import Comment from "components/Comment/Index";
import { formatDateTime } from "utils/common";
import { incrementViews, getViews } from "../../api/home";

export default {
  name: "Article",
  components: {
    Comment,
  },
  emits: {
    getCommentSize(num) {
      this.commentNum = num;
      return true;
    },
  },
  data() {
    return {
      commentNum: 0,
    };
  },
  methods: {
    format(date) {
      return formatDateTime(date);
    },
  },
  setup() {
    const state = reactive({
      article: {},
      loading: false,
      views: 0,
    });
    const route = useRoute();
    const id = route.params.id;
    state.loading = true;

    getArticle(id)
      .then((result) => {
        state.loading = false;
        state.article = result.content;
        document.title = "文章- " + state.article.title + " | Light Blog";
      })
      .catch(() => {
        state.loading = false;
      });

    getViews(id).then((resp) => {
      state.views = resp.content;
    });

    const incrementView = () => {
      incrementViews(state.article.id).then((resp) => {
        if (resp.code === 0) {
          state.viwes = resp.content;
        }
      });
    };

    // 页面停留30s算浏览
    setTimeout(() => incrementView(), 30000);

    return { ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
body {
  background: var(--color-bg);
}
.article-container {
  min-height: 85vh;

  padding: 25px 20px;

  .title {
    text-align: center;
    margin-bottom: 20px;
  }

  .card {
    margin-bottom: 20px;
  }

  .article-wrap {

    .article-content {
      min-height: 30vh;
    }

    .article-footer {
      border-top: 1px #999 solid
    }
  }
}
</style>