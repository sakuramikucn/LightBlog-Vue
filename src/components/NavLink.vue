<template>
  <div class="item-content">
    <i :class="icon" />
    {{ name }}
  </div>
</template>

<script>
export default {
  name: "NavLink",
  props: {
    name: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.item-content {
  vertical-align: center;
  margin: auto auto;
}
</style>