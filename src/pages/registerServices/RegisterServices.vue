<template>
  <base-page
    icon="credit_score"
    :sync="false"
    title="Registrar Transferencia"
    :toolbar="true"
    style="display: flex; flex-direction: column; align-items: center;"
  >
    <q-card class="card__styles">
      <q-card-section horizontal style="height: 100%">
        <q-card-section
          style="width: 50%; display: flex; flex-direction: column;"
        >
          <strong style="font-size: 16px;">Servicios: </strong>
          <q-select
            outlined
            rounded
            dense
            v-model="serviceSelected"
            :options="services"
            label="Servicios"
            @input="changeService"
            style="width: 100%; margin-top: 20px;"
            multiple
            map-options
            hint="Selecciona uno o varios servicios"
          />

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

          <q-separator></q-separator>

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
          </div>
        </q-card-section>

        <q-separator vertical></q-separator>

        <q-card-section style="width: 50%;">
          <strong style="font-size: 16px; padding: 20px 0;">Resumen: </strong>
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
                  style="margin-left: 20px; margin-top: 10px;"
                  v-for="item2 of item.services"
                  :key="item2.value"
                >
                  <p style="margin:0">
                    <i class="fas fa-check"></i> {{ item2.label }}
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
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
export default {
  components: { BasePage },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "scrollTop"
  ],
  data() {
    return {
      locals: [],
      localSelected: {},
      servicesAdded: [],
      file_selected: null,
      serviceSelected: [
        {
          value: "psp",
          label: "Pago semanal sin pagar"
        }
      ],
      services: [
        {
          value: "psp",
          label: "Pago semanal sin pagar"
        },
        {
          value: "1d",
          label: "1 Destacado"
        },
        {
          value: "3d",
          label: "3 Destacados"
        },
        {
          value: "6d",
          label: "6 Destacados"
        },
        {
          value: "1s",
          label: "1 Subir"
        },
        {
          value: "10s",
          label: "10 Subir"
        },
        {
          value: "20s",
          label: "20 Subir"
        }
      ]
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
      let exist = this.servicesAdded.find(
        item => item.local.label === this.localSelected.label
      );

      if (exist !== undefined) {
        this.showNotification("El local ya fue agregado a su lista","negative" ,"error");
        return;
      }

      this.servicesAdded.push({
        id: Math.random(),
        services: this.serviceSelected,
        local: this.localSelected,
        flag: true
      });
      this.serviceSelected = [
        {
          value: "psp",
          label: "Pago semanal sin pagar"
        }
      ];
      this.localSelected = this.locals[0];
    },
    deleteLocal(storeId) {
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
