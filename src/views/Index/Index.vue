<template>
  <div>
    <c-header />
    <router-view />
    <c-footer />
  </div>
</template>

<script>
import Header from "components/Header/Index";
import Footer from "components/Footer/Index";

export default {
  name: "Index",
  components: {
    "c-header": Header,
    "c-footer": Footer,
  },
};
</script>

<style>
</style>