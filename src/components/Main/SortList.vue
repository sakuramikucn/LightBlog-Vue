<template>
  <div style="margin-bottom: 15px">
    <el-card>
      <template #header>
        <h4>{{ title }}</h4>
      </template>
      <el-row>
        <el-col v-for="item in data" :key="item.id" class="item">
          <router-link  :to="item.path">
          <span>{{ item.name }}</span>
        </router-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SortList",
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
};
</script>

<style scoped>
.item  {
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
}
.item:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px 1px #ddd;
}
</style>