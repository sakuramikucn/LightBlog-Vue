<template>
  <el-card>
    <template #header>
      <el-row type="flex" justify="start">
        <el-col style="text-align: center" :span="22">
          <h2><i :class="title.icon"></i>{{title.name}}</h2>
        </el-col>
        <el-col v-if="listData" :span="2" style="color: #999;vertical：bottom">
          <span>共{{ listData.length }}个</span>
        </el-col>
      </el-row>
    </template>

    <el-row class="f-rowwrap container" >
        <router-link
          v-for="(item, index) in listData"
          :key="index"
          :to="item.path"
        >
          <div class="item color1">
            <div style="padding-bottom: 8px">
              <h4>{{ item.name }}</h4>
            </div>

            <div class="item-body" v-if="item.coverUrl">
              <el-image
                v-if="item.coverUrl"
                :src="item.coverUrl"
                :fit="cover"
              ></el-image>
            </div>

            <div class="item-footer">
              <span v-if="item.count != undefined">共{{ item.count }}篇文章</span>
            </div>
          </div>
        </router-link>
    </el-row>
  </el-card>
</template>

<script>
import { watch, reactive, toRefs } from "vue";

export default {
  name: "TagList",
  props: {
    list: {
      type: Array,
      requried: true,
    },
    title: {
      type: Object,
      default: () => {
        return {
          name: '标签',
          icon: ''
        }
      }
    }
  },
  setup(props) {
    const state = reactive({
      listData: [],
    });

    watch(
      () => props.list,
      (val) => {
        state.listData = val;
      },
      { deep: true }
    );

    return { ...toRefs(state) };
  },
};
</script>

<style scoped>
.container {
}
.item {
  min-width: 100px;
  min-height: 60px;
  box-shadow: 0 0 8px 2px #efefef;
  text-align: center;
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  margin: 0 30px 30px 0;
  transition: transform 0.2s;
}

.item:hover {
  box-shadow: 0 0 6px 3px #eee;
  transform: scale(1.1);
}

.item-body {
  border-top: 1px solid #efefef;
  padding: 8px 0;
  /* min-height: 70px; */
}

.item-footer {
  padding-top: 10px;
  border-top: 1px solid #efefef;
  font-size: 10px;
  color: #999;
}

.color1 {
  /* background: rgb(237, 245, 243); */
}
</style>