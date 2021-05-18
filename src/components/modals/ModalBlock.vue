<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 350px; height:270px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="error"
          text-color="primary"
        />
        <span class="q-ml-sm" style="font-size:18px; text-align:center"
          >¡{{message}}!</span
        >
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  created() {
    this.bus.$on("modal-block", data => {
      console.log(data);
      this.open = true;
      this.message = data.mensaje;
      this.blockType = data.tipoBloqueo;
    });
  },
  data() {
    return {
      open: false,
      message: "",
      blockType: ""
    };
  },
};
</script>

<style lang="scss">

</style>
