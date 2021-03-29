<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 300px; height:250px; border-radius:10px"
    >
      <q-card-section
        style="height: 80%; display:flex; flex-direction:column; justify-content:center;align-items:center"
      >
        <q-avatar
          style="width:80px; height:80px; font-size:130px"
          icon="room_service"
          text-color="green"
        />
        <span class="q-ml-sm" style="font-size:16px; text-align:center"
          ><strong>{{ message }}</strong></span
        >
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="green"
          label="Ir a pedidos"
          style="font-size: 12px !important"
          v-close-popup
          @click="toOrders()"
        />
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 12px !important"
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
    this.bus.$on("new-order", data => {
      this.open = true;
      this.message = data.message;
    });
  },
  data() {
    return {
      open: false,
      message: "",
      orderID: null
    };
  },
  methods: {
    stopSound() {
      this.open = false;
      this.bus.$emit('stop-bell');
    },
    toOrders() {
      this.open = false;
      this.stopSound();
      this.$router.push({ path: "/pedidos" });
    }
  }
};
</script>

<style></style>
