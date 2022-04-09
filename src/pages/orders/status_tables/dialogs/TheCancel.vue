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
        <q-btn
          @click="DoCancel()"
          size="sm"
          rounded
          label="Anular"
          color="green"
        />
        <q-btn
          size="sm"
          rounded
          label="cerrar"
          color="primary"
          @click="closeDialog()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["mode"],
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getServerTime"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-cancel", row => {
      this.card = true;
      this.orderId = row.id;
      this.orderDetail = { ...row };
    });
  },
  data() {
    return {
      card: false,
      orderId: null,
      prod: null,
      cancellationReason: "",
      orderDetail: {}
    };
  },
  methods: {
    async getStatus() {
      if (this.orderDetail.delivery_id !== null) {
        var url = this.$store.getters["routes/getRoute"](
          "get.delivery.status",
          {
            delivery_id: this.orderDetail.delivery_id
            //delivery_id: "del_gALMXHSKQp2wlI1cVWl9Gw"
          }
        );
        let resp = await this.$axios.get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        });

        return resp;
      }
    },
    async DoCancel() {
      let resp = await this.getStatus();
      if (resp.data.status === "delivered") {
        this.showNotification(
          "El pedido ya fue entregado por Uber",
          "negative",
          "error"
        );
        return;
      }
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
        canceledTimestamp: this.getServerTime(),
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
            if (response.data.status === "success") {
              this.hideLoading();
              if (this.mode === "orders") {
                this.cancelDelivery();
              } else {
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
    cancelDelivery() {
      this.showLoading();
      var url = this.$store.getters["routes/getRoute"]("uber.cancel");
      let data = {
        delivery_id: this.orderDetail.delivery_id
      };
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          console.log(response);
          this.bus.$emit("sync-orders");
          this.hideLoading();
          this.card = false;
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    }
  }
};
</script>

<style></style>
