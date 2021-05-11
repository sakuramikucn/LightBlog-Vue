<template>
  <el-card class="box-card" shadow="hover">
    <!-- 头部 -->
    <template #header>
      <div class="card-header">
        <router-link
          :to="/article/ + data.id"
          :style="{ display: 'flex', 'justify-content': 'space-between' }"
        >
          <h4>{{ data.title }}</h4>
          <div :style="{ color: '#bbb' }">
            <i class="el-icon-view"></i>&nbsp;{{ data.views }}
            <i
              class="el-icon-chat-dot-round"
              :style="{ margin: 'auto 10px' }"
            ></i
            >{{ data.commentNum }}
          </div>
        </router-link>
      </div>
    </template>
    <!-- 内容 -->
    <div class="body">
      <!-- 封面 -->
      <el-image
        v-if="data.coverUrl"
        :src="data.coverUrl"
        lazy
        fit="contain"
      >
      </el-image>
      <!-- 简介 -->
      <pre class="desc" v-if="data.desc">{{ data.desc }}</pre>

      <div class="category-container">
        <div>
          <i class="el-icon-collection" :style="{ 'margin-right': '10px' }"></i>
          <el-tag
            size="small"
            class="category"
            @click="toCategoryDetail(data.category.id)"
            v-if="data.category"
            >{{ data.category.name }}</el-tag
          >
        </div>
        <div class="author-container">
          <div>
            <i class="el-icon-date"></i>
            <span class="create-time">{{ dateFormat(data.createTime) }}</span>
          </div>
          <div class="author" @click="toAbout">
            <i class="el-icon-user-solid"></i> {{ data.author }}
          </div>
        </div>
      </div>
      <div class="tags">
        <i
          class="el-icon-collection-tag"
          :style="{ 'margin-right': '10px' }"
        ></i>
        <el-tag
          type="success"
          v-for="(item, index) in data.tags"
          :key="index"
          size="mini"
          @click="toTagDetail(item.id)"
          style="margin-right: 5px"
        >
          {{ item.name }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script>
import { useRouter } from "vue-router";
import { formatDate } from "utils/common";

export default {
  name: "ArticleItem",
  setup() {
    const router = useRouter();

    const toCategoryDetail = (id) => router.push("/category/" + id);
    const toTagDetail = (id) => router.push("/tag/" + id);
    const toAbout = () => router.push("/about");

    return { toCategoryDetail, toTagDetail, toAbout };
  },
  props: {
    data: {
      id: Number,
      title: String,
      desc: String,
      autor: {
        type: String,
        default: "manager",
      },
      tags: {
        type: Array,
        default: [],
      },
      category: {
        type: Object,
        default: {
          id: Number,
          name: {
            type: String,
            default: "",
          },
        },
      },
      createTime: Date,
      views: {
        type: Number,
        default: 0,
      },
      commentNum: {
        type: Number,
        default: 0,
      },
    },
  },
  methods: {
    dateFormat(date) {
      const d = new Date(date);
      return formatDate(d);
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 20px;
}
.desc {
  min-height: 50px;
  color: #888;
  font-size: 12px;
  // border-bottom: 1px #efefef solid;
}
.category-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  color: #999;
  border-top: 1px #efefef solid;
  .category {
    margin-right: 10px;
  }
  .author-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bbb;
    .author {
      margin: 0 10px;
    }
    .create-time {
      margin-left: 5px;
    }
  }
}

.tags {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 30px;
  padding: 3px 0;
  color: #999;
  border-top: 1px #efefef solid;
}
</style>