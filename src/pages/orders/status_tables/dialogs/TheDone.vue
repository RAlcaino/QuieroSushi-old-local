<template>
  <q-dialog
    v-model="card"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="border-radius:10px;">
      <q-card-section class="row items-center">
        <span
          v-if="orderType === 'retiro'"
          style="font-size:16px"
          class="q-ml-sm"
        >
          ¿Estas seguro que este pedido esta listo para retiro?
        </span>
        <span v-else style="font-size:16px" class="q-ml-sm">
          ¿Estas seguro que este pedido esta en camino a su destino?
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="No" color="primary" v-close-popup />
        <q-btn @click="DoDone()" flat label="Si" color="green" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling", "getServerTime"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-done", row => {
      this.card = true;
      this.orderId = row.id;
      this.orderType = row.orderType;
      console.log(this.getServerTime());
    });
  },
  data() {
    return {
      card: false,
      orderId: null,
      prod: null,
      orderType: null
    };
  },
  methods: {
    DoDone() {
      let data = {
        orderID: this.orderId,
        doneTimestamp: this.getServerTime()
        //doneTimestamp: '2021-03-08 23:00:00',
      };

      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.bus.$emit("sync-orders");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("order.done");
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.hideLoading();
              this.bus.$emit("sync-orders");
            } else {
              this.hideLoading();
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
      this.card = false;
    },
  }
};
</script>

<style></style>
