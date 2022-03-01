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
            ? this.$store.getters["auth/getDataLocals"].length > 1
              ? "¡Tienes todos tus locales bloqueados!"
              : "¡Tu local esta bloqueado!"
            : "¡Tienes algunos de tus locales bloqueados!"
        }}</span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          rounded
          color="primary"
          :label="getLabel()"
          style="font-size: 11px !important"
          @click="closeModalDebt()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["logout"],
  props: ["open"],
  methods: {
    closeModalDebt() {
      this.$store.commit("auth/setDebt", false);
      if (
        this.$store.getters["auth/getDataLocals"].every(
          item => item.localStatus === "bloqueado"
        )
      ) {
        if (this.$store.getters["auth/getDataUser"].role === "Cajero") {
          this.logout();
        }
      }
    },
    getLabel() {
      if (
        this.$store.getters["auth/getDataLocals"].every(
          item => item.localStatus === "bloqueado"
        )
      ) {
        if (this.$store.getters["auth/getDataUser"].role === "Cajero") {
          return "Cerrar Sesión";
        } else {
          return "Cerrar";
        }
      } else {
        return "Cerrar";
      }
    }
  }
};
</script>

<style lang="scss"></style>
