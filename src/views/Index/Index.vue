<template>
  <div>
    <c-header />
    <router-view />
  </div>
</template>

<script>
import Header from "components/Header/Index";
export default {
  name: "Index",
  components: {
    "c-header": Header,
  },
};
</script>

<style>
</style>