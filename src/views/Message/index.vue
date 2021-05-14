<template>
  <div class="message-container">
    <el-row type="flex" justify="center" >
      <el-col :md="16" class="main">
        <comment :type="2" ></comment>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";
import Comment from 'components/Comment/Index'

export default {
  components: {
    Comment
  },
  setup() {
    const state = reactive({
      data: [],
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>

.message-container {
  min-height: 85vh;
  background: var(--color-bg);

  .main {
    margin: 20px 15px;
  }
}

</style>
