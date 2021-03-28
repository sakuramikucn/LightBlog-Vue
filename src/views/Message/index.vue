<template>
  <div class="message-page">
    <div class="message-container"></div>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";

export default {
  components: {
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
}
.message-page {
  position: relative;
  margin: 60px auto 0;
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  height: 100%;
  min-height: 100vh;
  .content {
    width: 90%;
    margin: auto;
    padding: 50px 0;
    .item {
      margin-bottom: 30px;
      background: #fff;
      padding: 30px 30px 20px;
      border-radius: 6px;
      transition: all 0.3s;
      box-sizing: border-box;
      border-bottom: 1px solid #f3fafd;
      &:hover {
        box-shadow: 0 1px 8px rgba(0, 132, 255, 0.3);
      }
      .text {
        color: #333;
        &::deep .hljs-right {
          text-align: right;
        }
      }
      .time {
        font-size: 13px;
        text-align: right;
        margin-top: 14px;
        color: #888;
      }
    }
  }
}
</style>
