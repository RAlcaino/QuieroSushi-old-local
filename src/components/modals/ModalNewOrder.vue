<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 330px; height:250px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="room_service"
          text-color="green"
        />
        <span class="q-ml-sm" style="font-size:14px; text-align:center"
          ><strong>¡{{ message }}!</strong></span
        >
        <span class="warning-modal-new-o" v-if="showWarning">{{
          warning
        }}</span>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
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
          @click="stopSound()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  created() {
    this.bus.$on("sync-new-order", data => {
      this.message = data.message;
      this.showWarning = true;
    });
    this.bus.$on("new-order", data => {
      this.open = true;
      this.message = data.message;
    });
  },
  data() {
    return {
      open: false,
      message: "",
      warning: "Tienes un pedido más aparte de este. Revise sus pedidos",
      orderID: null,
      showWarning: false
    };
  },
  methods: {
    stopSound() {
      this.open = false;
      this.showWarning = false;
      this.bus.$emit("stop-bell");
    },
    toOrders() {
      this.open = false;
      this.stopSound();
      if (this.$router.currentRoute.fullPath === "/pedidos") {
        this.bus.$emit('to-one-tab');
      } else {
        this.$router.push({ path: "/pedidos" });
      }
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
