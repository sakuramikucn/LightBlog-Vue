<template>
  <el-card class="box-card" shadow="hover">
    <!-- 头部 -->
    <template #header>
      <div class="card-header">
        <router-link :to="/article/ + data.id">
          <h4>{{ data.title }}</h4>
        </router-link>
      </div>
    </template>
    <!-- 内容 -->
    <div class="body">
      <el-image
        v-if="data.coverUrl !== ''"
        :src="data.coverUrl"
        lazy
        fit="contain"
      >
      </el-image>
      <pre class="desc">{{ data.desc }}</pre>
      <div class="category-container">
        <span v-if="data.category === undefined"></span>
        <el-tag
          size="small"
          class="category"
          @click="toCategoryDetail(data.category.id)"
          v-if="data.category !== undefined"
          >{{ data.category.name }}</el-tag
        >
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
        <el-tag
          type="success"
          v-for="(item, index) in data.tags"
          :key="index"
          size="mini"
          @click="toTagDetail(item.id)"
        >
          {{ item.name }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script>
import { useRouter } from "vue-router";

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
    },
  },
  methods: {
    test() {
      console.log(this.data.category);
      console.log(this.data.category.name);
    },
    dateFormat(date) {
      const d = new Date(date);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDay();
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
  border-bottom: 1px #efefef solid;
}
.category-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  border-bottom: 1px #efefef solid;
  .category {
    margin: 0 10px;
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
  margin: 0 10px;
}
</style>