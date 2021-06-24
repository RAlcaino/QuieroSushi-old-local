<template>
  <q-toggle
    v-model="status"
    :false-value="0"
    :true-value="1"
    color="green"
    @input="changeStatus()"
  />
</template>

<script>
export default {
  props: ["value"],
  created(){
      this.status=this.value;
  },
  data() {
    return {
      status: null
    };
  },
  methods:{
      changeStatus(){
          console.log(this.status);
      }
  }
};
</script>

<style></style>
