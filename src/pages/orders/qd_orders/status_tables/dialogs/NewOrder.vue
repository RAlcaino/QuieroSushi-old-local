<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="border-radius:10px;width: 600px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white; font-size: 18px;">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="20px"
            name="inventory_2"
          />
          Crear pedido propio
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section>
        <q-form
          class="q-gutter-md form-recovery"
          style="display:flex; flex-direction: column; justify-content: center; align-items: center; margin-top: 20px"
        >
          <q-input
            type="text"
            outlined
            rounded
            dense
            label="Nombre"
            style="width: 80%;"
          />
          <q-input
            type="text"
            outlined
            rounded
            dense
            label="Dirección"
            style="width: 80%;"
          />
          <q-input
            type="text"
            outlined
            rounded
            dense
            label="Telefono (+56)"
            style="width: 80%;"
          />
          <q-input
            type="text"
            outlined
            rounded
            dense
            label="Tiempo"
            style="width: 80%;"
          />
          <q-input
            type="text"
            outlined
            rounded
            dense
            label="Monto Productos ($)"
            style="width: 80%;"
          />
        </q-form>
      </q-card-section>

      <q-card-actions style="height: 20%; width: 100%; display:block;">
        <div class="q-pa-md" style="display: flex; justify-content:center;">
          <q-btn
            class="gt-sm"
            color="green"
            rounded
            size="sm"
            style="position: relative; bottom: 0px; margin-right: 10px "
            @click="createOrder()"
          >
            <div style="font-size:12px; margin-top: 3px">Crear</div>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  data() {
    return {
      open: false
    };
  },
  mounted() {
    this.bus.$on("modal-new-order", () => {
      this.open = true;
    });
  },
  methods: {
    createOrder() {
      console.log("create order");
    },
    close() {
      this.open = false;
    }
  }
};
</script>

<style>
.center-div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
