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
        <q-list class="column">
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                rounded
                dense
                v-model="qdLocal"
                :options="qdLocals"
                label="Local QD"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                type="text"
                outlined
                rounded
                dense
                label="Nombre del cliente"
                v-model="nombre"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                rounded
                dense
                v-model="region"
                :options="$store.getters['auth/getZones'].regions"
                label="Región"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                rounded
                dense
                v-model="ciudad"
                :options="citiesFiltered"
                label="Ciudad"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                rounded
                dense
                v-model="comuna"
                :options="comunesFilteredForm"
                label="Comuna"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-input
                type="text"
                outlined
                rounded
                dense
                label="Dirección del cliente"
                v-model="direccion"
              />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-item-section>
              <q-select
                outlined
                rounded
                dense
                v-model="metodo_pago"
                :options="metodos_pago"
                label="Método de pago"
              >
              </q-select>
            </q-item-section>
          </q-item>

          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  :maxlength="9"
                  outlined
                  rounded
                  dense
                  label="Telefono (+56)"
                  v-model="telefono"
              /></q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="number"
                  outlined
                  rounded
                  dense
                  v-model="minutos"
                  label="Tiempo (Minutos)"
              /></q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="number"
                  outlined
                  rounded
                  dense
                  label="Monto Productos ($)"
                  v-model="subtotal"
              /></q-item-section> </q-item
          ></q-list>
        </q-list>
      </q-card-section>

      <q-card-actions style="height: 20%; width: 100%; display:block;">
        <div class="q-pa-md" style="display: flex; justify-content:center;">
          <q-btn
            color="green"
            rounded
            size="sm"
            :disabled="verifyForm"
            style="position: relative; bottom: 0px; margin-right: 10px "
            @click="createOrder()"
          >
            <div style="font-size:12px; margin-top: 3px">
              Crear
            </div>
          </q-btn>
        </div>
      </q-card-actions>
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
    "getStoreQDLocals"
  ],
  data() {
    return {
      open: false,
      comuna: {
        label: "Seleccionar...",
        value: null
      },
      region: {
        label: "Seleccionar...",
        value: null
      },
      ciudad: {
        label: "Seleccionar...",
        value: null
      },
      qdLocal: {
        label: "Seleccionar...",
        value: null
      },
      qdLocals: [],
      nombre: null,
      minutos: null,
      direccion: null,
      telefono: null,
      tiempo: null,
      subtotal: null,
      metodo_pago: "Seleccionar...",
      metodos_pago: [
        "Efectivo",
        "Debito en Domicilio",
        "Credito en Domicilio",
        "Pago Online",
        "Transferencia",
        "Pago Rut"
      ]
    };
  },
  mounted() {
    this.bus.$on("modal-new-order", () => {
      this.open = true;
      this.reset();
    });
    this.qdLocals = [...this.getStoreQDLocals("ACTIVE")];
  },
  computed: {
    comunesFilteredForm() {
      var comunesFiltered = this.$store.getters["auth/getZones"].comunes.filter(
        item =>
          item.id_ciudad === this.ciudad.value &&
          item.id_region === this.region.value
      );
      if (
        !comunesFiltered.some(item => item.value === this.comuna.value) &&
        comunesFiltered.length !== 0
      ) {
        this.comuna = comunesFiltered[0];
      }
      return comunesFiltered;
    },
    citiesFiltered() {
      var citiesFiltered = this.$store.getters["auth/getZones"].cities.filter(
        item => item.id_region === this.region.value
      );
      if (
        !citiesFiltered.some(item => item.value === this.ciudad.value) &&
        citiesFiltered.length !== 0
      ) {
        this.ciudad = citiesFiltered[0];
      }
      return citiesFiltered;
    },
    verifyForm() {
      if (this.subtotal === null || this.subtotal === "") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    createOrder() {
      let body = {
        id_local: this.qdLocal.value,
        direccion_usuario: {
          direccion: this.direccion,
          direccion2: "",
          comuna: this.comuna.label
        },
        nombre: this.nombre,
        telefono: this.telefono,
        subtotal: this.subtotal,
        metodo_pago: this.metodo_pago,
        uber: {
          es_uber: true
        }
      };

      this.showLoading();
      var url = this.$store.getters["routes/getRoute"]("create.order.qd");
      var urlConfirm = this.$store.getters["routes/getRoute"](
        "confirm.order.qd"
      );
      this.$axios
        .post(url, body, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          let body = {
            orderID: response.data.result.message.id,
            pickup_ready_dt: +this.minutos,
            pickup_deadline_dt: +this.minutos + 10
          };

          this.$axios
            .post(urlConfirm, body, {
              headers: {
                Authorization: this.$store.getters["auth/getToken"]
              }
            })
            .then(response => {
              //TODO: Refrescar las ordenes QD
              this.bus.$emit("sync-orders-qd");
              this.hideLoading();
              this.open = false;
            })
            .catch(error => {
              this.hideLoading();
              this.errorHandling(error);
            });
        })
        .catch(error => {
          console.log(error);
          if (error.response !== undefined) {
            if (error.response.data.code === 412) {
              this.showNotification(
                "El télefono u otro dato no es válido",
                "negative",
                "error"
              );
            }
          }

          this.hideLoading();
          this.errorHandling(error);
        });
    },
    close() {
      this.open = false;
    },
    reset() {
      this.comuna = {
        label: "Seleccionar...",
        value: null
      };
      this.region = {
        label: "Seleccionar...",
        value: null
      };
      this.ciudad = {
        label: "Seleccionar...",
        value: null
      };
      this.qdLocal = {
        label: "Seleccionar...",
        value: null
      };
      this.nombre = null;
      this.minutos = null;
      this.direccion = null;
      this.telefono = null;
      this.tiempo = null;
      this.subtotal = null;
      this.metodo_pago = "Seleccionar...";
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
