<template>
  <base-page
    icon="credit_score"
    :sync="false"
    title="Registrar Transferencia"
    :toolbar="true"
    style="display: flex; flex-direction: column; align-items: center;"
  >
    <q-card class="card__styles" v-if="services.length !== 0">
      <q-card-section :horizontal="responsiveMobile">
        <q-card-section class="firts__section">
          <strong style="font-size: 16px;">Servicios </strong>

          <q-select
            v-if="locals.length > 1"
            outlined
            rounded
            dense
            v-model="localSelected"
            :options="locals"
            label="Locales"
            @input="changeLocal"
            style="margin-top: 20px; width: 100%;
            "
            hint="Seleccione el local que desea aplicar el servicio"
          />
          <q-select
            outlined
            rounded
            dense
            v-model="serviceSelected"
            :options="services"
            label="Servicios"
            @input="changeService"
            style="width: 100%; margin-top: 20px;"
            hint="Selecciona un servicio y agregue a su lista"
          >
            <template v-slot:selected-item="scope">
              <span v-if="scope.opt.label !== null"
                >{{ scope.opt.label }}
                <strong
                  >${{
                    scope.opt.value.includes("psp")
                      ? formatNumberCustom(scope.opt.price)
                      : scope.opt.price
                  }}</strong
                ></span
              >
              <span v-else>Seleccionar...</span>
            </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label
                    v-html="
                      `${scope.opt.label} <strong>$${
                        scope.opt.value.includes('psp')
                          ? formatNumberCustom(scope.opt.price)
                          : scope.opt.price
                      }</strong>`
                    "
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div
            style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px;"
          >
            <q-btn
              color="green"
              rounded
              size="sm"
              label="Agregar"
              icon="add_circle"
              style="margin-top: 35px;"
              @click="addServices()"
            >
            </q-btn>
          </div>

          <!--<q-separator></q-separator>

          <div style="width: 100%; display: flex; justify-content: center; fle">
            <q-uploader
              url=""
              color="primary"
              flat
              bordered
              label="Soporte De Pago"
              hide-upload-btn
              style="width: 80%; margin-top: 50px; border-radius: 10px;"
              accept=".png,.jpg,.jpeg,.pdf"
              @added="fileAdded"
              @removed="fileRemoved"
            >
            </q-uploader>
          </div>-->
        </q-card-section>

        <q-separator
          :vertical="responsiveMobile"
          :horizontal="!responsiveMobile"
        ></q-separator>

        <q-card-section class="second__section">
          <div
            style="display: flex; flex-direction: row;justify-content: space-between; padding-bottom:10px;"
          >
            <strong style="font-size: 16px;">Resumen </strong>
            <strong v-if="total > 0" style="font-size: 16px;"
              >Total: ${{ formatNumberCustom(total) }}
            </strong>
          </div>

          <div class="stores__container" v-if="servicesAdded.length !== 0">
            <div class="store__added">
              <div v-for="item of servicesAdded" :key="item.id">
                <q-chip
                  v-model="item.flag"
                  removable
                  color="primary"
                  text-color="white"
                  icon="store"
                  style="width: 90%; margin-top: 20px;"
                  @remove="deleteLocal(item.id)"
                >
                  {{ item.local.label }}
                </q-chip>

                <div class="services__store__container">
                  <p v-for="item2 of item.services" :key="item2.id">
                    <i class="fas fa-check"></i> {{ item2.label }}
                    <strong
                      >${{
                        item2.value.includes("psp")
                          ? formatNumberCustom(item2.price)
                          : item2.price
                      }}</strong
                    >
                    <q-icon
                      name="delete"
                      color="primary"
                      size="sm"
                      style="margin-bottom: 3px; margin-left: 2px;cursor: pointer;"
                      @click="deleteService(item.id, item2.id)"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div class="btn__register">
              <q-btn
                color="green"
                rounded
                size="sm"
                label="Registrar"
                icon="check_circle"
                @click="register()"
                :disable="total === 0"
              >
              </q-btn>
            </div>
          </div>

          <div
            style="display:flex; flex-direction: column; width:100%; height: 92%; justify-content:center; align-items:center"
            v-if="servicesAdded.length === 0"
          >
            <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
            <p style="font-size:16px; font-weight:bold;text-align:center">
              Sin servicios agregados
            </p>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>

    <div
      style="margin-top:200px"
      class="fit column wrap justify-center items-center content-center"
      v-if="services.length === 0"
    >
      <img
        src="~/assets/maki-roll2.gif"
        alt="sad"
        width="130"
        style="border-radius:100%"
      />
    </div>
  </base-page>
</template>

<script>
//#edf1f5
import BasePage from "src/components/bases/BasePage.vue";
export default {
  props: ["props"],
  components: { BasePage },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "scrollTop",
    "formatNumber",
    "refreshToken"
  ],
  data() {
    return {
      locals: [],
      localSelected: {},
      servicesAdded: [],
      file_selected: null,
      serviceSelected: {},
      services: [],
      total: 0,
      weeklyPays: [],
      responsiveMobile: true
    };
  },
  computed: {
    validation() {}
  },
  created() {
    if (screen.width < 1098) {
      this.responsiveMobile = false;
    }
    this.init();
  },
  mounted() {
    this.responsiveMode();
  },
  methods: {
    sync() {},
    init() {
      this.formatLocals();
      this.getData();
    },
    formatLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ALL")];

      this.localSelected = this.locals[0];
    },
    changeLocal(val) {
      if (val !== null) {
        this.localSelected = val;

        this.services = this.services.filter(
          item => item.localId === undefined
        );
        let weeklyPay = this.weeklyPays.find(
          item => item.id_local === this.localSelected.value
        );

        this.addWeeklyPay(weeklyPay.saldos_pendientes);
        this.serviceSelected = this.services[0];
      }
    },
    changeService(val) {
      if (val !== null) {
        this.serviceSelected = val;
      }
    },
    fileAdded(files) {
      this.file_selected = files[0];
    },
    fileRemoved(files) {
      this.file_selected = null;
    },
    addServices() {
      let index = this.servicesAdded.findIndex(
        item => item.local.label === this.localSelected.label
      );

      if (index !== -1) {
        for (var i = 0; i < this.servicesAdded.length; i++) {
          let indexWeeklyPay = this.servicesAdded[i].services.findIndex(item =>
            item.value.includes("psp")
          );
          if (indexWeeklyPay !== -1) {
            let onlyWeeklyPays = this.servicesAdded[i].services.filter(
              item => item.id_postpago !== undefined
            );

            let validation = onlyWeeklyPays.some(
              item => item.id_postpago === this.serviceSelected.id_postpago
            );

            if (validation) {
              this.showNotification(
                "Ya se agrego ese pago semanal al local",
                "negative",
                "error"
              );
              return;
            }
          }
        }
        this.servicesAdded[index].services.push({
          id: Math.random(),
          ...this.serviceSelected
        });
        this.total += this.serviceSelected.price;
        return;
      }

      this.servicesAdded.push({
        id: Math.random(),
        services: [{ id: Math.random(), ...this.serviceSelected }],
        local: this.localSelected,
        flag: true
      });

      this.total += this.serviceSelected.price;
    },
    deleteLocal(storeId) {
      let item = this.servicesAdded.find(item => item.id === storeId);

      item.services.map(item => {
        this.total -= item.price;
      });

      this.servicesAdded = this.servicesAdded.filter(
        item => item.id !== storeId
      );
    },
    register() {
      this.showLoading();
      var data = {
        pay_type: "Transferencia",
        total: this.total,
        detail: this.servicesAdded
      };

      var url = `${this.$store.getters["routes/getRoute"]("transferences")}`;

      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.reset();
            this.hideLoading();

            this.Swal.fire({
              text: "Servicios Registrados",
              icon: "success",
              confirmButtonText: "Ok",
              confirmButtonColor: "#21ba45",
              timer: 5000,
              timerProgressBar: true
            });

            this.refreshToken(true, false);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    getPrices(pendingWeeklyPay) {
      var url = this.$store.getters["routes/getRoute"]("services.prices");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            let pricesGoUp = response.data.result.pricesGoUp;

            pricesGoUp.map(item => {
              this.services.push({
                value: `${item.qty}s`,
                label: `Pack ${item.qty} Subir`,
                price: Math.round(item.price),
                disable: false,
                service_type: "subir"
              });
            });

            let pricesStandOut = response.data.result.pricesStandOut;

            pricesStandOut.map(item => {
              this.services.push({
                value: `${item.qty}d`,
                label: `Pack ${item.qty} Destacados`,
                price: Math.round(item.price),
                disable: false,
                service_type: "destacado"
              });
            });
            if (pendingWeeklyPay.length !== 0) {
              this.addWeeklyPay(pendingWeeklyPay);
            }
            if (this.props) {
              this.localSelected = this.locals.find(
                item => item.value === this.props.row.local.id_local
              );

              this.serviceSelected = this.services.find(item => {
                if (item.id_postpago !== undefined) {
                  if (item.id_postpago === this.props.row.id) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              });

              if (this.serviceSelected === undefined) {
                this.serviceSelected = this.services[0];
                return;
              }
              this.servicesAdded.push({
                id: Math.random(),
                services: [{ id: Math.random(), ...this.serviceSelected }],
                local: this.localSelected,
                flag: true
              });
              this.total += +this.serviceSelected.price;
            } else {
              this.serviceSelected = this.services[0];
            }
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    formatNumberCustom(num) {
      return Math.round(num).toString();
    },
    addWeeklyPay(pendingWeeklyPay) {
      let map = pendingWeeklyPay.map(item => {
        this.services.unshift({
          value: `psp${item.id}`,
          label: `Pago Semanal`,
          price: Math.round(item.saldo_a_pagar),
          disable: false,
          localId: item.id_local,
          id_postpago: item.id,
          service_type: "pago_semanal"
        });
      });
    },
    getData() {
      var url = this.$store.getters["routes/getRoute"]("weekly.pay");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.weeklyPays = response.data.result;
            let weeklyPay = [];

            if (this.props) {
              this.localSelected = this.locals.find(
                item => item.value === this.props.row.local.id_local
              );
            }

            weeklyPay = this.weeklyPays.find(
              item => item.id_local === this.localSelected.value
            );

            this.getPrices(weeklyPay.saldos_pendientes);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    reset() {
      this.servicesAdded = [];
      this.total = 0;
      this.services = [];
      this.init();
    },
    deleteService(storeId, serviceId) {
      let serviceAdded = this.servicesAdded.find(item => item.id === storeId);
      let serviceAddedIndex = this.servicesAdded.findIndex(
        item => item.id === storeId
      );

      if (serviceAdded.services.length === 1) {
        this.deleteLocal(storeId);
        return;
      }

      let serviceToDelete = serviceAdded.services.find(
        item => item.id === serviceId
      );

      this.total -= serviceToDelete.price;

      let services = serviceAdded.services.filter(
        item => item.id !== serviceId
      );

      this.servicesAdded[serviceAddedIndex].services = [...services];
    },
    responsiveMode() {
      var responsive = window.matchMedia("(max-width: 1098px)");

      responsive.addListener(event => {
        if (event.matches) {
          this.responsiveMobile = false;
        } else {
          this.responsiveMobile = true;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.card__styles {
  width: 90%;
  height: 500px;
  border-radius: 20px;
  margin: 25px 0;
}

.firts__section {
  width: 50%;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.second__section {
  width: 50%;
  height: 500px;
}

.stores__container {
  position: relative;
  width: 100%;
  height: 90%;
}

.btn__register {
  position: absolute;
  height: 25px;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}

.store__added {
  position: absolute;
  max-height: 85%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
}

.services__store__container {
  margin-left: 20px;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}

.services__store__container > p {
  margin: 0;
  width: 50%;
}
@media screen and (max-width: 1098px) {
  .firts__section {
    width: 100% !important;
    height: 50% !important;
  }
  .second__section {
    width: 100% !important;
    height: auto;
  }
  .store__added,
  .btn__register,
  .stores__container {
    position: initial !important;
  }

  .store__added {
    background: #f2f2f2 !important;
    border-radius: 10px !important;
    padding: 0 20px !important;
    padding-bottom: 20px !important;
    margin-bottom: 50px !important;
  }

  .card__styles {
    height: auto !important;
  }

  .services__store__container > p {
    width: 100% !important;
  }
}

@media screen and (max-width: 550px) {
}
</style>
