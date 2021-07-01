<template>
  <q-dialog
    v-model="card"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="width: 300px; border-radius:10px">
      <q-card-section class="column items-center">
        <span style="font-size:16px" class="q-ml-sm">
          Indique los motivos:
        </span>

        <q-input
          v-model="cancellationReason"
          filled
          type="textarea"
          style="width:90%; padding-top: 5px;font-size:16px"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="closeDialog()" />
        <q-btn @click="DoCancel()" flat label="Anular" color="green" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props:["mode"],
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-cancel", row => {
      this.card = true;
      this.orderId = row.id;
    });
  },
  data() {
    return {
      card: false,
      orderId: null,
      prod: null,
      cancellationReason: ""
    };
  },
  methods: {
    DoCancel() {
      if (this.cancellationReason === "") {
        this.showNotification(
          "El motivo de anulación es obligatorio",
          "negative",
          "error"
        );
        return;
      }
      let data = {
        orderID: this.orderId,
        canceledTimestamp: this.currentTimestamp(),
        cancellationReason: this.cancellationReason
      };
      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.bus.$emit("sync-orders");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("order.cancel");
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            console.log(response.data);

            if (response.data.status === "success") {
              this.hideLoading();
              if(this.mode==="orders"){
                this.bus.$emit("sync-orders");
              }else{
                this.bus.$emit("sync-page-after-refund");
              }
            } else {
              this.hideLoading();
              this.showNotification(response.data.message, "negative", "error");
            }
            this.closeDialog();
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    closeDialog() {
      this.card = false;
      this.cancellationReason = "";
    },
    currentTimestamp() {
      let currentTime = "";
      let date = new Date(Date.now());
      currentTime +=
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      currentTime +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes
      currentTime +=
        date.getSeconds() < 10
          ? ":0" + date.getSeconds()
          : ":" + date.getSeconds(); //get seconds

      let currentTimestamp =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        currentTime;
      return currentTimestamp;
    }
  }
};
</script>

<style></style>
