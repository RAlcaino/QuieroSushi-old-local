<template>
  <q-toggle
    v-model="status"
    :false-value="'inactivo'"
    :true-value="'activo'"
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
      this.showLoading();
      var data = {
        estado: this.status
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
              this.bus.$emit("sync-users");
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
            this.hideLoading();
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    }
  }
};
</script>

<style></style>
