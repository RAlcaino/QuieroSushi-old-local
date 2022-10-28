<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 350px; height:270px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="info"
          text-color="blue"
        />
        <span class="q-ml-sm" style="font-size:18px; text-align:center"
          >¡{{ message }}!</span
        >
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="blue"
          label="Actualizar"
          style="font-size: 11px !important"
          v-close-popup
          @click="sync()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling","refreshToken"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("modal-sync-page", data => {
      this.open = true;
      this.message = data.mensaje;
    });
  },
  data() {
    return {
      open: false,
      message: "",
      prod:""
    };
  },
  methods: {
    sync() {
      this.refreshToken(true,true);
    }
  }
};
</script>

<style lang="scss"></style>
