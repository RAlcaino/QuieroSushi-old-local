<template>
  <p :class="{'total__class':flag, 'item__class':!flag}">
    <strong>{{ title }}</strong>
    {{
      formatNumber(parseInt(value.toString().split(".")[0]))
        .toString()
        .replaceAll("-", "")
    }}
  </p>
</template>

<script>
export default {
  props: ["title", "value", "formatNumber", "flag"]
};
</script>

<style lang="scss" scoped>
.item__class {
  text-align: right;
}
.total__class {
  text-align: right;
  border-top: 3px dotted #ff2d2d;
  padding-top: 10px;
  font-size: 18px;
}
</style>
