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
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  props: ["value","userId"],
  created() {
    this.status = this.value;
    this.prod = this.$store.getters["mode/getMode"];
  },
  data() {
    return {
      status: null,
      prod:null
    };
  },
  methods: {
    changeStatus() {
      console.log(this.userId);
      this.showLoading();
      var data = {
        status: this.status
      };
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("resource.users", {
          localId: this.userId
        });
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.hideLoading();
              this.card = false;
              this.bus.$emit("sync-users");
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.errorHandling(error);
          });
      }
    }
  }
};
</script>

<style></style>
