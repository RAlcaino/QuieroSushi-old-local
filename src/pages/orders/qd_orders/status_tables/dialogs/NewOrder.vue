<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="
        border-radius: 10px;
        width: 650px;
        max-width: 650px;
        overflow: hidden;
      "
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background: #333; padding: 10px 20px !important"
      >
        <div class="text-h6" style="color: white; font-size: 18px">
          <q-icon
            style="margin-right: 3px; padding-bottom: 4px"
            size="20px"
            name="inventory_2"
          />
          Crear pedido propio
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section>
        <q-stepper v-model="step" ref="stepper" animated color="primary">
          <q-step
            :name="1"
            title="Validar dirección del cliente"
            icon="add_location_alt"
            :done="step > 1"
          >
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
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    ref="select"
                    rounded
                    outlined
                    dense
                    v-model="comuna"
                    :options="communes"
                    :options-dense="true"
                    hide-hint
                    label="Comuna del cliente"
                    @popup-hide="allCommunes()"
                    :virtual-scroll-sticky-size-start="80"
                    style="margin-bottom: 5px"
                  >
                    <template v-slot:prepend>
                      <q-icon name="store" />
                    </template>
                    <template v-slot:before-options>
                      <q-item>
                        <q-item-section class="text-grey">
                          <input
                            v-model="communeFilter"
                            @input="filterFn(communeFilter)"
                            type="text"
                            placeholder="Buscar"
                            style="
                              padding: 7px;
                              margin-top: 10px;
                              border-radius: 20px;
                              border: 1px solid #333;
                              outline: none;
                            "
                          />
                          <p style="margin: 0; color: white">
                            {{ communes.length }}
                          </p>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          <input
                            v-model="communeFilter"
                            @input="filterFn(communeFilter)"
                            type="text"
                            placeholder="Buscar"
                            style="
                              padding: 7px;
                              margin-top: 10px;
                              border-radius: 20px;
                              border: 1px solid #333;
                              outline: none;
                            "
                          />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin Resultados
                        </q-item-section>
                      </q-item>
                    </template>
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
                  <q-input
                    type="text"
                    outlined
                    rounded
                    dense
                    label="Apartamento del cliente"
                    v-model="direccion2"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-step>

          <q-step
            :name="2"
            title="Editar información"
            icon="person"
            :done="step > 2"
          >
            <q-list class="column">
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
              <q-list class="row">
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      type="number"
                      outlined
                      rounded
                      dense
                      label="Telefono (+56)"
                      v-model="telefono"
                      @input="changeHandler"
                  /></q-item-section>
                </q-item>
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      type="number"
                      outlined
                      rounded
                      dense
                      label="Total pedido ($)"
                      v-model="subtotal"
                  /></q-item-section>
                </q-item>
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-select
                      ref="select"
                      rounded
                      outlined
                      dense
                      v-model="metodo_pago"
                      :options="metodos_pago"
                      :options-dense="true"
                      hide-hint
                      label="Metodo de pago"
                      :virtual-scroll-sticky-size-start="80"
                      style="margin-bottom: 5px"
                    >
                      <template v-slot:prepend>
                        <q-icon name="payments" />
                      </template>
                    </q-select>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="notes"
                    outlined
                    rounded
                    dense
                    type="textarea"
                    label="Notas"
                /></q-item-section>
              </q-item>
            </q-list>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation
              style="display: flex; justify-content: center"
            >
              <q-btn
                @click="stepHandler()"
                color="green"
                :label="step === 2 ? 'Crear' : 'Validar'"
                rounded
                size="sm"
                :disabled="step === 2 && verifyForm"
                style="position: relative; bottom: 0px; margin-right: 10px"
              />
              <q-btn
                v-if="step > 1"
                rounded
                color="primary"
                size="sm"
                @click="$refs.stepper.previous()"
                label="Atrás"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>

      <!-- <q-card-actions style="height: 20%; width: 100%; display: block">
        <div class="q-pa-md" style="display: flex; justify-content: center">
          <q-btn
            color="green"
            rounded
            size="sm"
            :disabled="verifyForm"
            style="position: relative; bottom: 0px; margin-right: 10px"
            @click="createOrder()"
          >
            <div style="font-size: 12px; margin-top: 3px">Crear</div>
          </q-btn>
        </div>
      </q-card-actions> -->
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
      direccion2: null,
      telefono: null,
      tiempo: null,
      subtotal: null,
      metodo_pago: "Seleccionar...",
      metodos_pago: ["Pago Online", "Transferencia"],
      communes: [],
      communeFilter: "",
      step: 1,
      notes: ""
    };
  },
  mounted() {
    this.bus.$on("modal-new-order", () => {
      this.step = 1;
      this.open = true;
      this.reset();
    });
    this.qdLocals = [...this.getStoreQDLocals("ACTIVE")];
    this.communes = this.$store.getters["auth/getZones"].comunes;
  },
  computed: {
    verifyForm() {
      if (this.notes === null || this.notes === "") {
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
          direccion2: this.direccion2,
          comuna: this.comuna.label
        },
        nombre: this.nombre,
        telefono: this.telefono,
        subtotal: +this.subtotal,
        domain: "https://panel.devqs.tk",
        uber: {
          es_uber: true
        },
        nota: this.notes,
        metodo_pago: this.metodo_pago
      };
      this.showLoading();
      var url = this.$store.getters["routes/getRoute"]("create.order.qd");
      this.$axios
        .post(url, body, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(res => {
          this.bus.$emit("sync-orders");
          this.hideLoading();
          this.open = false;
          this.$refs.stepper.next();
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
    filterFn(val) {
      let communesNew = [...this.$store.getters["auth/getZones"].comunes];
      if (val.trim() === "") {
        console.log(val);
        this.communes = communesNew;
        return;
      }

      const needle = val.toLowerCase();
      this.communes = communesNew.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    close() {
      this.open = false;
    },
    reset() {
      this.comuna = {
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
      this.direccion2 = null;
      this.telefono = null;
      this.tiempo = null;
      this.subtotal = null;
      this.metodo_pago = "Seleccionar...";
      this.notes = "";
    },
    allCommunes() {
      this.communeFilter = "";
      this.communes = this.$store.getters["auth/getZones"].comunes;
    },
    stepHandler() {
      if (this.step === 1) {
        this.validateAddress();
      } else {
        this.createOrder();
      }
    },
    validateAddress() {
      this.showLoading();

      let body = {
        dropoff_address: this.direccion,
        id_local: this.qdLocal.value
      };

      var url = this.$store.getters["routes/getRoute"]("uber.quote");
      this.$axios
        .post(url, body, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          console.log(response);
          this.hideLoading();
          this.$refs.stepper.next();
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },
    changeHandler(val) {
      if (val.length > 9) {
        this.telefono = val.slice(0, -1);
      }
    }
  }
};

// var urlConfirm = this.$store.getters["routes/getRoute"]("confirm.order.qd");
// let body = {
//   orderID: res.data.result.message.id,
//   pickup_ready_dt: +this.minutos,
//   pickup_deadline_dt: +this.minutos + 15
// };
// this.$axios
//   .post(urlConfirm, body, {
//     headers: {
//       Authorization: this.$store.getters["auth/getToken"]
//     }
//   })
//   .then(response => {
//     //TODO: Refrescar las ordenes QD
//   })
//   .catch(error => {
//     this.hideLoading();
//     this.errorHandling(error);
//   });
</script>

<style>
.center-div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
