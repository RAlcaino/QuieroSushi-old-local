<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 350px; height: 270px; border-radius: 10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width: 80px; height: 80px; font-size: 110px"
          icon="warning"
          text-color="primary"
        />
        <span class="q-ml-sm" style="font-size: 18px; text-align: center"
          >Esta venta es con <strong>Transferencia</strong>
        </span>

        <span class="q-ml-sm" style="font-size: 18px; text-align: center">
          ¿Estás seguro que recibiste el pago para poder continuar?</span
        >
      </q-card-section>
      <q-card-actions align="right" style="height: 20%">
        <q-btn
          rounded
          color="green"
          label="Si"
          style="font-size: 11px !important"
          @click="yesHandler()"
        />

        <q-btn
          rounded
          color="primary"
          label="No"
          style="font-size: 11px !important"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["showConfirm"],
  created() {
    this.bus.$on("modal-are-you-sure", (item) => {
      this.open = true;
      this.item = { ...item };
    });
  },
  data() {
    return {
      open: false,
      message: "",
      item: {},
    };
  },
  methods: {
    yesHandler() {
      this.open = false;
      this.showConfirm(this.item);
    },
  },
};
</script>

<style lang="scss"></style>
