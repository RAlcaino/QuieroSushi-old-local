<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 330px; height: 250px; border-radius: 10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width: 80px; height: 80px; font-size: 110px"
          icon="room_service"
          text-color="green"
        />
        <span class="q-ml-sm" style="font-size: 14px; text-align: center"
          >¡Tienes un nuevo pedido de <strong>{{ order.customer }}</strong> por
          <strong>{{ formatNumber(order.amount) }}</strong
          >. Direccion: {{ order.address }}!</span
        >
        <span class="warning-modal-new-o" v-if="showWarning">{{
          warning
        }}</span>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%">
        <q-btn
          rounded
          color="green"
          label="Ir a pedidos"
          style="font-size: 11px !important"
          v-close-popup
          @click="toOrders()"
        />
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
          @click="stopSound(true)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["formatNumber", "errorHandling", "showNotification"],
  created() {
    this.bus.$on("sync-new-order", data => {
      this.pushOrder(data);
      this.showWarning = true;
    });
    this.bus.$on("new-order", data => {
      this.open = true;
      this.pushOrder(data);
    });
  },
  data() {
    return {
      open: false,
      orders: [],
      order: {
        idSale: null,
        customer: null,
        amount: null,
        address: null
      },
      customer: "",
      address: "",
      amount: 0,
      warning: "Tienes un pedido más aparte de este. Revise sus pedidos",
      orderID: null,
      showWarning: false
    };
  },
  methods: {
    stopSound(flag) {
      this.open = false;
      this.showWarning = false;
      this.bus.$emit("stop-bell");
      if (flag) {
        this.doHistory("Cerrar");
      }
    },
    toOrders() {
      this.stopSound(false);
      if (this.$router.currentRoute.fullPath === "/pedidos") {
        this.bus.$emit("to-one-tab");
      } else {
        this.$router.push({
          name: "pedidos",
          params: {
            toAll: true
          }
        });
      }

      this.doHistory("Ir a pedidos");
    },
    pushOrder(data) {
      this.order.customer = data.nombreCliente;
      this.order.address = data.direccion;
      this.order.amount = data.precioTotal;
      this.order.idSale = data.venta_id;
      let order = { ...this.order };
      this.orders.push(order);
    },
    doHistory(action) {
      if (this.$store.getters["auth/getGodMode"]) {
        return;
      }

      let data = {
        action: action,
        orders: this.orders
      };
      var url = this.$store.getters["routes/getRoute"](
        "history.newOrder.pusher"
      );
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status !== "success") {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
      this.orders = [];
    }
  }
};
</script>

<style lang="scss">
.warning-modal-new-o {
  width: 80%;
  animation: warning 1s linear infinite;
  padding-top: 10px;
  font-size: 12px;
  text-align: center;
  color: red;
  font-weight: bold;
}

.card-section-modal-new-o {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@keyframes warning {
  50% {
    opacity: 0.6;
    color: red;
  }
}
</style>
