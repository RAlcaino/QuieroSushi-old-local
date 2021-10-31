<template>
  <base-page
    icon="credit_score"
    :sync="false"
    title="Registrar Transferencia"
    :toolbar="true"
    style="display: flex; flex-direction: column; align-items: center;"
  >
    <q-card class="card__styles" v-if="services.length !== 0">
      <q-card-section horizontal style="height: 100%">
        <q-card-section
          style="width: 50%; display: flex; flex-direction: column;"
        >
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
                >{{scope.opt.label}} <strong>${{scope.opt.price}}</strong></span
              >
              <span v-else>Seleccionar...</span>
            </template>

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label
                    v-html="`${scope.opt.label} <strong>$${scope.opt.price}</strong>`"
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

        <q-separator vertical></q-separator>

        <q-card-section style="width: 50%;">
          <div
            style="display: flex; flex-direction: row;justify-content: space-between"
          >
            <strong style="font-size: 16px;">Resumen </strong>
            <strong v-if="total !== 0" style="font-size: 16px;"
              >Total: ${{ formatNumberCustom(total) }}
            </strong>
          </div>

          <div
            style="position: relative; width: 100%; height: 90%;"
            v-if="servicesAdded.length !== 0"
          >
            <div
              style="position: absolute; max-height: 85% ; width: 100%; overflow-y: auto; overflow-x: hidden; top: 0;"
            >
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

                <div
                  style="margin-left: 20px; margin-top: 10px; display: flex; flex-wrap:wrap; "
                >
                  <p
                    v-for="item2 of item.services"
                    :key="item2.id"
                    style="margin:0; width: 50%;"
                  >
                    <i class="fas fa-check"></i> {{ item2.label }}
                    <strong>${{ item2.price }}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div
              style="position: absolute; height: 25px ; width: 100%; bottom: 0; display: flex; justify-content: flex-end;"
            >
              <q-btn
                color="green"
                rounded
                size="sm"
                label="Registrar"
                icon="check_circle"
                @click="register()"
              >
              </q-btn>
            </div>
          </div>

          <div
            class="fit column wrap justify-center items-center content-center"
            v-if="servicesAdded.length === 0"
          >
            <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
            <p style="font-size:16px; font-weight:bold;text-align:center">
              Sin servicios registrados
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
  components: { BasePage },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "scrollTop",
    "formatNumber"
  ],
  data() {
    return {
      locals: [],
      localSelected: {},
      servicesAdded: [],
      file_selected: null,
      serviceSelected: {},
      services: [],
      total: 0
    };
  },
  computed: {
    validation() {}
  },
  created() {
    this.init();
  },
  methods: {
    sync() {},
    init() {
      this.formatLocals();
      this.getPrices();
    },
    formatLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      this.localSelected = this.locals[0];
    },
    changeLocal(val) {
      if (val !== null) {
        this.localSelected = val;
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
        this.servicesAdded[index].services.push({
          id: Math.random(),
          ...this.serviceSelected
        });
        this.total += +this.serviceSelected.pricev2;
        return;
      }

      this.servicesAdded.push({
        id: Math.random(),
        services: [{ id: Math.random(), ...this.serviceSelected }],
        local: this.localSelected,
        flag: true
      });

      this.total += +this.serviceSelected.pricev2;
      this.serviceSelected = this.services[0];
    },
    deleteLocal(storeId) {
      let item = this.servicesAdded.find(item => item.id === storeId);

      item.services.map(item => {
        this.total -= item.pricev2;
      });

      this.servicesAdded = this.servicesAdded.filter(
        item => item.id !== storeId
      );
    },
    register() {
      this.showLoading();
      console.log(this.servicesAdded);

      setTimeout(() => {
        this.hideLoading();
      }, 2000);
    },
    getPrices() {
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
                label: `${item.qty} Subir`,
                price: this.formatNumber(item.price),
                pricev2: item.price
              });
            });

            let pricesStandOut = response.data.result.pricesStandOut;

            pricesStandOut.map(item => {
              this.services.push({
                value: `${item.qty}d`,
                label:
                  item.qty === 1
                    ? `${item.qty} Destacado`
                    : `${item.qty} Destacados`,
                price: this.formatNumber(item.price),
                pricev2: item.price
              });
            });

            this.serviceSelected = this.services[0];
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    formatNumberCustom(num) {
      let splitNumber = num.toString().split(".");
      let integer = this.formatNumber(parseInt(splitNumber[0])).toString();
      let decimals = splitNumber[1];

      if (decimals) {
        return `${integer},${decimals}`;
      } else {
        return integer;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card__styles {
  width: 80%;
  height: 500px;
  border-radius: 20px;
  margin: 25px 0;
}
</style>
