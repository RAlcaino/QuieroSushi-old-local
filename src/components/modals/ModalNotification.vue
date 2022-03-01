<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 600px; height:auto; border-radius:10px"
    >
      <q-card-section class="row items-center q-pb-none header__modal">
        <div class="text-h6" style="color: white">
          <q-icon
            size="24px"
            :name="'notifications'"
            class="header__title__icon"
          />
          Notificación
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section style="padding: 30px;">
        <p style="font-size: 18px;">
          <strong>Titulo: </strong>{{ data.titulo }}
        </p>
        <p
          style="font-size: 15px; line-height: 1.75;   text-align: justify; text-justify: inter-word;"
        >
          {{ data.mensaje }}
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "refreshToken"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("modal-notification", data => {
      this.open = true;
      this.data = data;
    });
  },
  data() {
    return {
      open: false,
      data: {}
    };
  },
  methods: {
    close() {
      this.open = false;
    }
  }
};
</script>

<style lang="scss">
.header__modal {
  background: #333;
  padding: 10px 20px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.header__title__icon {
  margin-right: 3px;
  padding-bottom: 4px;
}
</style>
