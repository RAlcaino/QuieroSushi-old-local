<template>
  <q-dialog v-model="card" persistent>
    <q-card
      style="border-radius:10px;width: 400px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="delete"
          />
          Eliminar Usuario
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="reset()" />
      </q-card-section>
      <q-card-section
        class="row items-center justify-center"
        style="height:50px; margin-bottom:25px"
      >
        <div
          class="fit row no-wrap justify-center items-center content-center"
          style="margin-top:25px"
        >
        <p style="font-size:16px">¿Estas seguro de eliminar este usuario?</p>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="deleteUser()"
          size="sm"
          style="font-size:12px;padding: 0px 15px !important; margin-bottom:20px"
          rounded
          color="primary"
          >Eliminar</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];

    this.bus.$on("open-delete-user", (data) => {
      this.card = true;
      this.user=data;
    });
  },
  mounted() {},
  data() {
    return {
      card: false,
      prod: null,
      user:null
    };
  },
  methods: {
    reset() {
      this.card = false;
      this.user=null;
    },
    delete() {}
  }
};
</script>

<style lang="scss"></style>
