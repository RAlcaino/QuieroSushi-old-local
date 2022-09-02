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
        <q-stepper
          v-model="step"
          ref="stepper"
          animated
          color="primary"
          done-color="green"
          active-color="blue"
        >
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
                    ref="placesInput"
                    id="placesInput"
                    @keypress="autocompleteLocation"
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
                    label="Departamento del cliente"
                    v-model="direccion2"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
          </q-step>

          <q-step :name="2" title="Costos" icon="attach_money" :done="step > 2">
            <q-list class="column">
              <q-item>
                <q-item-section>
                  <q-item-label style="font-weight: bold; font-size: 18px"
                    >Cargo a cliente:
                    <q-icon
                      :name="editCosts ? 'clear' : 'edit'"
                      style="cursor: pointer;"
                      :color="editCosts ? 'red' : 'blue'"
                      @click="editCosts = !editCosts"
                  /></q-item-label>
                  <q-item-label
                    style="font-size: 18px"
                    v-if="editCosts === false"
                    >{{ format(costs.costo_cliente) }}</q-item-label
                  >
                  <q-input
                    v-if="editCosts === true"
                    outlined
                    rounded
                    dense
                    v-model="deliveryCostEdited"
                    label="Nuevo costo ($)"
                    mask="#,##"
                    fill-mask="0"
                    reverse-fill-mask
                    input-class="text-right"
                    style="width: 40%; margin-top: 10px"
                  ></q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label style="font-weight: bold"
                    >Cargo a local:</q-item-label
                  >
                  <q-item-label>{{ format(costs.costo_local) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-step>

          <q-step
            :name="3"
            title="Ingresar información"
            icon="person"
            :done="step > 3"
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
                <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      type="number"
                      outlined
                      rounded
                      dense
                      label="Telefono (+56)"
                      v-model="telefono"
                  /></q-item-section>
                </q-item>
                <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      type="text"
                      outlined
                      rounded
                      dense
                      label="Email"
                      v-model="email"
                  /></q-item-section>
                </q-item>
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      v-model="notes"
                      outlined
                      rounded
                      dense
                      type="textarea"
                      placeholder="Acá puede colocar los productos que están siendo comprados. Esta nota será leída por el cliente"
                  /></q-item-section>
                </q-item>
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input
                      outlined
                      rounded
                      dense
                      v-model="subtotal"
                      label="Total pedido ($)"
                      mask="#,##"
                      fill-mask="0"
                      reverse-fill-mask
                      input-class="text-right"
                    ></q-input
                  ></q-item-section>
                </q-item>
                <q-item
                  v-if="
                    metodo_pago !== 'Pago Online' &&
                      metodo_pago !== 'Transferencia' &&
                      metodo_pago !== 'Seleccionar...'
                  "
                  class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                >
                  <q-item-section>
                    <span
                      style="
                        font-size: 16px;
                        margin-bottom: 15px;
                        font-weight: 500;
                      "
                      class="q-ml-sm"
                    >
                      ¿En cuántos minutos quieres que llegue el repartidor al
                      local?
                    </span>

                    <div style="display: flex; justify-content: center">
                      <q-input
                        v-model="newTime"
                        color="primary"
                        label="Minutos"
                        style="width: 100px"
                        type="number"
                        :min="10"
                      >
                        <template v-slot:prepend>
                          <q-icon name="query_builder" />
                        </template>
                      </q-input>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-item
                style="flex-direction: column; justify-content: flex-end; align-items: flex-end"
              >
                <p style="font-size: 16px;">
                  <strong>Costo reparto: </strong>
                  {{
                    editCosts
                      ? format(+deliveryCostEdited.replaceAll(",", "."))
                      : format(+costs.costo_cliente)
                  }}
                </p>
                <p style="font-size: 16px;" v-if="subtotal !== null">
                  <strong>Total: </strong>
                  {{
                    (
                      (editCosts
                        ? +deliveryCostEdited.replaceAll(",", ".")
                        : costs.costo_cliente) + +subtotal.replaceAll(",", ".")
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      maximumFractionDigits: 2
                    })
                  }}
                </p>
              </q-item>
            </q-list>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation
              style="display: flex; justify-content: center"
            >
              <q-btn
                v-if="step === 1"
                @click="validateAddress()"
                color="green"
                :label="'Validar'"
                rounded
                size="sm"
                style="position: relative; bottom: 0px; margin-right: 10px"
              />
              <q-btn
                v-if="step > 1"
                rounded
                color="primary"
                size="sm"
                @click="
                  Object.keys(costs).length === 0
                    ? (step = 1)
                    : $refs.stepper.previous()
                "
                label="Atrás"
                style="position: relative; bottom: 0px; margin-right: 10px"
                class="q-ml-sm"
              />
              <q-btn
                v-if="step === 3"
                @click="createOrder()"
                color="green"
                :label="'Crear'"
                rounded
                size="sm"
                :disabled="step === 3 && verifyForm"
              />

              <q-btn
                v-if="step === 2"
                @click="confirm()"
                color="green"
                :label="'Confirmar'"
                rounded
                size="sm"
                style="position: relative; bottom: 0px; margin-right: 10px"
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
      subtotal: "0,0",
      metodo_pago: "Transferencia",
      metodos_pago: ["Transferencia", "Pago Online", "Pagado"],
      communes: [],
      communeFilter: "",
      step: 1,
      notes: "",
      email: "",
      costs: {},
      newTime: 10,
      deliveryCost: 0,
      deliveryCostEdited: "0,0",
      autocomplete: null,
      editCosts: false
    };
  },
  mounted() {
    this.bus.$on("modal-new-order", () => {
      this.step = 1;
      this.open = true;
      this.reset();
      this.qdLocals = [...this.getStoreQDLocals("ACTIVE")];

      if (this.qdLocals.length === 1) {
        this.qdLocal = this.qdLocals[0];
      }
      this.communes = this.$store.getters["auth/getZones"].comunes;
    });
  },
  computed: {
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
      if (this.subtotal === "0,00" || this.subtotal === "0,0") {
        this.errorHandling({
          message: "Debe indicar el total del pedido"
        });
        return;
      }

      if (this.telefono === null || this.telefono === "") {
        this.errorHandling({
          message: "Debe indicar un télefono"
        });
        return;
      }
      if (this.telefono.length < 9 || this.telefono.length > 9) {
        this.errorHandling({
          message: "El teléfono tiene que ser de 9 dígitos"
        });
        return;
      }

      let body = {
        id_local: this.qdLocal.value,
        direccion_usuario: {
          direccion:
            this.direccion.charAt(0).toUpperCase() + this.direccion.slice(1),
          direccion2:
            this.direccion2 !== null
              ? this.direccion2.charAt(0).toUpperCase() +
                this.direccion2.slice(1)
              : "",
          comuna: this.comuna.label
        },
        nombre: this.nombre,
        telefono: this.telefono,
        subtotal: +this.subtotal.replaceAll(",", "."),
        domain: "https://panel.devqs.tk",
        uber: {
          es_uber: true
        },
        nota: this.notes.replaceAll("\n", ".-"),
        metodo_pago: this.metodo_pago,
        correo: this.email,
        tiempos:
          this.metodo_pago !== "Pago Online" &&
          this.metodo_pago !== "Transferencia" &&
          this.metodo_pago !== "Seleccionar..."
            ? {
                pickup_ready_dt: +this.newTime,
                pickup_deadline_dt: +this.newTime + 15,
                delivery_type: "Uber"
              }
            : null,
        costo_delivery: this.editCosts
          ? +this.deliveryCostEdited.replaceAll(",", ".")
          : this.deliveryCost,
        plataforma: "QD"
      };

      if (this.email === null || this.email === "") {
        delete body.correo;
      }
      if (
        this.metodo_pago === "Pago Online" ||
        this.metodo_pago === "Transferencia" ||
        this.metodo_pago === "Seleccionar..."
      ) {
        delete body.tiempos;
      }

      if (this.direccion2 === null || this.direccion2 === "") {
        delete body.direccion_usuario.direccion2;
      }

      // if (this.metodo_pago !== "Pagado" && this.metodo_pago !== "Efectivo") {
      //   delete body.plataforma;
      // }
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
          this.hideLoading();
          if (error.response !== undefined) {
            if (error.response.data.code === 412) {
              for (const property in error.response.data.message) {
                this.showNotification(
                  `${error.response.data.message[property]}`,
                  "negative",
                  "error"
                );
              }
            } else {
              this.errorHandling(error);
            }
          }
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
    format(data) {
      data = parseFloat(data);
      return `${data.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 2
      })}`;
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
      this.direccion = "";
      this.direccion2 = "";
      this.telefono = null;
      this.tiempo = null;
      this.subtotal = "0,0";
      this.metodo_pago = "Transferencia";
      this.notes = "";
      this.email = "";
      this.newTime = 10;
      this.autocomplete = null;
      this.deliveryCostEdited = "0,0";
      this.editCosts = false;
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
      if (this.qdLocal.value === null) {
        this.showNotification("Debe indicar una local", "negative", "error");
        return;
      }
      if (this.comuna.value === null) {
        this.showNotification("Debe indicar una comuna", "negative", "error");
        return;
      }
      if (this.direccion.trim() === "") {
        this.showNotification(
          "Debe indicar una direccion valida",
          "negative",
          "error"
        );
        return;
      }

      this.showLoading();
      let body = {
        dropoff_address: `${this.direccion}, ${this.comuna.label}`,
        pickup_address: `${this.qdLocal.direccion}, ${this.qdLocal.commune}`,
        tipo_venta: "despacho",
        local_id: this.qdLocal.value,
        plataforma: "QD",
        forma_pago: this.metodo_pago
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

          if (response.data.result.quote === undefined) {
            this.showNotification(
              response.data.result.proveedor_seleccionado_motivo,
              "negative",
              "error"
            );

            return;
          }
          if (response.data.result.quote.kind !== "error") {
            this.costs = response.data.result.details[0];
            this.deliveryCost = response.data.result.details[0].costo_cliente;
            this.$refs.stepper.next();
          } else {
            this.showNotification(
              response.data.result.quote.error,
              "negative",
              "error"
            );
          }
        })
        .catch(error => {
          this.hideLoading();
          if (error.response !== undefined) {
            if (error.response.data.code === 412) {
              this.showNotification(
                "Todos los campos son requeridos",
                "negative",
                "error"
              );
            } else {
              this.errorHandling(error);
            }
          }
        });
    },
    changeHandler(val) {
      if (val.length > 9) {
        this.telefono = val.slice(0, (val.length - 9) * -1);
      }
    },
    confirm() {
      if (this.editCosts) {
        if (
          this.deliveryCostEdited === "0,0" ||
          this.deliveryCostEdited === "0,00"
        ) {
          this.errorHandling({
            message: "Debe indicar el nuevo costo del reparto"
          });
          return;
        }
      }
      this.$refs.stepper.next();
    },
    autocompleteLocation() {
      const input = document.getElementById(
        this.$refs.placesInput.$refs.input.id
      );
      this.autocomplete = new google.maps.places.Autocomplete(input);
      this.autocomplete.addListener("place_changed", () => {
        let place = this.autocomplete.getPlace();
        this.direccion = "";
        this.direccion = place.formatted_address;
      });
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
