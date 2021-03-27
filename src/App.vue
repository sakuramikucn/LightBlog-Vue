<template>
  <div>
    <router-view />
    <!-- 底部 -->
    <c-footer />
  </div>
</template>

<script>
import Footer from "./components/Footer/Index";

export default {
  name: "App",
  components: {
    "c-footer": Footer,
  }
};
</script>

<style lang="scss">

</style>
