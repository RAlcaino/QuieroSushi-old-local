<template>
  <q-dialog v-model="open" persistent>
    <q-card class="my-card" style="width: 400px; border-radius:10px">
      <q-card-section class="row items-center q-pb-none header__modal">
        <div class="text-h6" style="color: white">
          <q-icon
            size="24px"
            :name="'credit_card'"
            class="header__title__icon"
          />
          Pago Online
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section style="padding: 30px 20px 0px 20px;">
        <q-input outlined rounded v-model="email" label="Correo electrónico" />
        <p style="padding: 20px 0;">
          <strong style="color: red;">IMPORTANTE:</strong> Ingrese un correo
          válido para procesar el pago correctamente.
        </p>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;padding: 0 20px 10px 0;">
        <q-btn
          rounded
          color="green"
          label="Aceptar"
          style="font-size: 12px !important"
          v-close-popup
          :disabled="validation"
          @click="payProcess()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["parentPayProcess"],
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "refreshToken"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("modal-email-confirmation", data => {
      this.open = true;
      this.email = "";
      this.row = { ...data };
    });
  },
  data() {
    return {
      open: false,
      email: "",
      row: {}
    };
  },
  computed: {
    validation() {
      let status = true;
      if (
        this.email.trim().length !== 0 &&
        this.email.includes("@") &&
        (this.email.includes(".com") || this.email.includes(".cl"))
      ) {
        status = false;
      }
      return status;
    }
  },
  methods: {
    payProcess() {
      this.parentPayProcess({ ...this.row, email: this.email });
    },
    close() {
      this.open = false;
    }
  }
};
</script>

<style lang="scss"></style>
