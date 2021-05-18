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
        <span class="q-ml-sm" style="font-size:20px; text-align:center"
          >¡Tienes todos tus locales bloqueados!</span
        >
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          rounded
          color="primary"
          label="Cerrar Sesion"
          style="font-size: 11px !important"
          @click="logout()"
        />
        <q-btn
          rounded
          color="green"
          label="Pagar"
          style="font-size: 11px !important"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["open"],
  inject:["logout"]
};
</script>

<style lang="scss"></style>
