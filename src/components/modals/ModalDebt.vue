<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 330px; height:250px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="error"
          text-color="primary"
        />
        <span class="q-ml-sm" style="font-size:20px; text-align:center">{{
          this.$store.getters["auth/getDataLocals"].every(
            item => item.localStatus === "bloqueado"
          )
            ? "¡Tienes todos tus locales bloqueados!"
            : "¡Tienes algunos de tus locales bloqueados!"
        }}</span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
          @click="closeModalDebt()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["open"],
  methods: {
    closeModalDebt() {
      this.$store.commit("auth/setDebt", false);
    }
  }
};
</script>

<style lang="scss"></style>
