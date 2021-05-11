<template>
  <div class="article-container">
    <!-- 主内容 -->
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :sm="24" :md="mdVal">
        <!-- 内容 -->
        <el-skeleton :rows="15" animated :throttle="100" :loading="loading">
          <template #default>
            <el-card class="card">
              <template #header>
                <!-- 标题 -->
                <el-row type="flex" justify="center">
                  <el-col class="title">
                    <h2>{{ article.title }}</h2>
                  </el-col>
                </el-row>
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
                <!-- 文章内容 -->
                <section class="article-content">
                  <div id="preview"></div>
                </section>

                <!-- 文章底部 -->
                <div class="article-footer">
                  <el-row style="margin-bottom: 10px">
                    <el-col>
                      <i class="el-icon-collection">文章分类：</i>
                      <el-tag v-if="article.category" size="mini">{{
                        article.category.name
                      }}</el-tag>
                    </el-col>
                  </el-row>
                  <el-row v-if="article.tags">
                    <el-col>
                      <i class="el-icon-collection-tag">标签：</i>
                      <el-tag
                        v-for="(item, index) in article.tags"
                        :key="index"
                        size="mini"
                        type="success"
                        style="margin-right: 5px"
                        >{{ item.name }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>

            <!-- 评论 -->
            <comment
              :aid="article.id"
              :type="1"
              @getCommentSize="getCommentSize"
            ></comment>
          </template>
        </el-skeleton>
      </el-col>

      <!-- 目录栏 -->

      <el-col class="hidden-sm-only" :md="4" v-if="outlineShow">
        <el-affix :offset="50">
          <el-skeleton
            :rows="8"
            animated
            :throttle="100"
            :loading="outlineLoading"
          >
            <template #default>
              <aside class="outline">
                <el-card>
                  <template #header>
                    <div :style="{ 'text-align': 'center' }">
                      <span>目录</span>
                    </div>
                  </template>
                  <div id="outline" class="outline-container"></div>
                </el-card>
              </aside>
            </template>
          </el-skeleton>
        </el-affix>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { getArticle } from "api/article";
import Comment from "components/Comment/Index";
import { formatDateTime } from "utils/common";
import { incrementViews, getViews } from "../../api/home";
import Vditor from "vditor/dist/method.min";
import "vditor/dist/index.css";

export default {
  name: "Article",
  components: {
    Comment,
  },
  data() {
    return {
      commentNum: 0,
    };
  },
  methods: {
    getCommentSize(num) {
      this.commentNum = num;
    },
    format(date) {
      return formatDateTime(date);
    },
  },
  setup() {
    const state = reactive({
      article: {},
      loading: false,
      views: 0,
      outlineLoading: false,
      outlineShow: true,
      mdVal: 12,
    });
    const route = useRoute();
    const id = route.params.id;

    const getData = async () => {
      state.loading = true;
      state.outlineLoading = true;
      // 先获取数据
      await getArticle(id)
        .then((result) => {
          state.loading = false;
          state.article = result.content;
          document.title = "文章- " + state.article.title + " | Light Blog";
        })
        .catch(() => {
          state.loading = false;
        });

      await nextTick();

      // 渲染
      await Vditor.preview(
        document.getElementById("preview"),
        state.article.content,
        {
          lazyLoadImage: "loading",
        }
      );

      state.outlineLoading = false;
      await nextTick();

      const html = await Vditor.outlineRender(
        document.getElementById("preview"),
        document.getElementById("outline")
      );

      if (html) {
        state.outlineShow = true;
      } else {
        state.outlineShow = false;
        state.mdVal = 16;
      }
    };

    getViews(id).then((resp) => {
      state.views = resp.content;
    });

    const incrementView = () => {
      incrementViews(state.article.id).then((resp) => {
        if (resp.code === 0) {
          state.views = resp.content;
        }
      });
    };

    onMounted(() => {
      getData();
      // 页面停留60s算浏览
      setTimeout(() => incrementView(), 60000);
    });

    return { ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
.article-container {
  min-height: 85vh;
  background: var(--color-bg);

  padding: 25px 20px;

  .title {
    text-align: center;
    padding: 10px 0;
    color: #666;
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
  }

  .card {
    margin-bottom: 20px;
  }

  .article-wrap {
    .article-content {
      min-height: 30vh;
    }

    .article-footer {
      border-top: 1px #ebeef5 solid;
      margin: 20px auto;
      padding: 15px;
    }
  }

  .outline .vditor-outline {
    display: inline-block !important;
  }

  .outline .outline-container {
    overflow: auto !important;
    max-height: 80vh;
  }
}
</style>