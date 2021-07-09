<template>
  <q-page class="q-pa-sm" style="padding-bottom:100px">
    <the-cancel :mode="'sales'"></the-cancel>
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="paid" />
      <q-toolbar-title :style="FontSize"
        >Estadisticas de ventas</q-toolbar-title
      >
    </q-toolbar>
    <div
      class="fit column no-wrap justify-center items-center content-center"
      style="margin-top:20px"
    >
      <q-card class="card-bg" style="width:95%;">
        <q-card-section
          class="text-h6"
          style="display: flex; flex-direction:row; justify-content:space-between"
        >
          <div>
            <div class="c-q-select-responsive" v-if="locals.length > 1">
              <q-select
                ref="select"
                rounded
                outlined
                dense
                :options="localsFilter"
                :options-dense="true"
                hide-hint
                v-model="localSelected"
                @input="change"
                label="Locales"
                @popup-hide="allLocals()"
                style="margin-bottom: 10px; width: 350px;"
                :virtual-scroll-sticky-size-start="80"
              >
                <template v-slot:prepend>
                  <q-icon name="store" />
                </template>
                <template v-slot:before-options>
                  <q-item>
                    <q-item-section class="text-grey">
                      <input
                        v-model="localFilter"
                        @input="filterFn(localFilter)"
                        type="text"
                        placeholder="Buscar"
                        style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item dense clickable @click="allOption()">
                    <q-item-section>Todos</q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      <input
                        v-model="localFilter"
                        @input="filterFn(localFilter)"
                        type="text"
                        placeholder="Buscar"
                        style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
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
            </div>
            <form autocomplete="off" style="display: flex; flex-direction: row">
              <q-input
                v-model="startDate"
                dense
                rounded
                outlined
                :maxlength="10"
                :rules="['date']"
                label="Desde"
                style="width: 170px; margin-right: 10px;"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="startDate" minimal>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                v-model="finalDate"
                dense
                rounded
                outlined
                :maxlength="10"
                :rules="['date']"
                label="Hasta"
                style="width: 170px; margin-right: 10px;"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="finalDate" minimal>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-btn
                color="primary"
                round
                size="sm"
                :disable="validateDate"
                style="width:30px; height:30px; margin-top: 5px;"
                @click="getHistory()"
              >
                <q-icon size="20px" name="search" />
              </q-btn>
            </form>
          </div>
          <div>
            <form autocomplete="off">
              <p style="text-align: right; font-size: 16px">
                <strong>Total Ventas:</strong> ${{ formatNumber(total) }}
              </p>
              <q-input
                dense
                debounce="300"
                v-model="filter"
                type="text"
                rounded
                outlined
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </form>
          </div>
        </q-card-section>
      </q-card>
      <q-table
        v-if="data.length !== 0 && searching === false"
        :data="data"
        :columns="columns"
        :filter="filter"
        :pagination-label="getPaginationLabel"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        no-results-label="No se encontraron ventas. Intenten de nuevo."
        no-data-label="Realice una busqueda"
        rows-per-page-label="Ventas por página"
        :loading="loadingPage"
        row-key="name"
        style="width:95%;border-radius:15px; margin-top: 15px"
      >
        <template v-slot:top-left>
          <strong style="font-size:16px;">Resultados</strong>
        </template>

        <template v-slot:top-right>
          <q-select
            style="width: 90px;"
            rounded
            v-model="pagination.currentPage"
            :options="pagesOptions"
            :options-dense="true"
            outlined
            @input="changePage()"
            dense
            label="Página"
          />
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>Anular</q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <div style="width:100%; display:flex; justify-content:center">
                <q-btn
                  color="primary"
                  round
                  size="sm"
                  @click="dialogCancel(props.row)"
                >
                  <q-icon size="20px" name="undo" />
                </q-btn>
              </div>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div
        v-if="count !== 0 && searching === false"
        class="row justify-center q-mt-md"
      >
        <q-pagination
          v-model="pagination.currentPage"
          color="grey-8"
          :max="pagination.totalPages"
          size="sm"
          input
          @input="changePage()"
        />
      </div>
    </div>
    <div
      style="margin-top:100px"
      class="fit column wrap justify-center items-center content-center"
      v-if="data.length === 0 && searching === false"
    >
      <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
      <p style="font-size:16px; font-weight:bold;text-align:center">
        No se encontraron ventas
      </p>
    </div>
    <div
      style="margin-top:100px;border-radius:100%; overflow:hidden"
      class="fit column wrap justify-center items-center content-center"
      v-if="flag === true"
    >
      <img
        src="~/assets/maki-roll.gif"
        alt="sad"
        width="130"
        style="border-radius:100%"
      />
    </div>
  </q-page>
</template>

<script>
import TheCancel from "../orders/status_tables/dialogs/TheCancel.vue";
export default {
  name: "OrderStadistics",
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "formatNumber",
    "capitalize"
  ],
  components: {
    TheCancel
  },
  data() {
    return {
      filter: "",
      locals: [],
      searching: false,
      flag: false,
      responsiveMobile: false,
      data: [],
      loadingPage: false,
      startDate: "",
      finalDate: "",
      pagination: {
        rowsPerPage: 10,
        currentPage: null,
        totalPages: null
      },
      pagesOptions: [],
      count: 0,
      meta: {},
      total: 0,
      columns: [
        {
          name: "id",
          required: true,
          label: "Id",
          align: "center",
          field: "id",
          sortable: true
        },
        {
          name: "localName",
          align: "left",
          label: "Nombre Local",
          field: "localName",
          sortable: true
        },
        {
          name: "comuneLocal",
          align: "left",
          label: "Comuna Local",
          field: "comuneLocal",
          sortable: true
        },
        {
          name: "customerName",
          required: true,
          label: "Nombre Cliente",
          align: "center",
          field: "customerName"
        },
        {
          name: "saleType",
          align: "center",
          label: "Tipo Venta",
          field: "saleType",
          sortable: true
        },
        {
          name: "subtotal",
          align: "center",
          label: "Subtotal ($)",
          field: "subtotal",
          sortable: true
        },
        {
          name: "delivery",
          align: "center",
          label: "Delivery ($)",
          field: "delivery",
          sortable: true
        },
        {
          name: "total",
          align: "center",
          label: "Total ($)",
          field: "total",
          sortable: true
        },
        {
          name: "confirmationDate",
          align: "center",
          label: "Fecha Confirmación",
          field: "confirmationDate",
          sortable: true
        }
      ],
      response: [
        {
          id: 1,
          localName: "Nori Sushi",
          comuneLocal: "La Candelaria",
          customerName: "Gabriel Romero",
          phone: "123456789",
          saleType: "Despacho",
          subtotal: 1000,
          delivery: 500,
          total: 1500,
          confirmationDate: "2021-05-27"
        },
        {
          id: 2,
          localName: "Nori Sushi",
          comuneLocal: "La Candelaria",
          customerName: "Gabriel Romero",
          phone: "123456789",
          saleType: "Despacho",
          subtotal: 1000,
          delivery: 500,
          total: 1500,
          confirmationDate: "2021-05-27"
        },
        {
          id: 3,
          localName: "Nori Sushi",
          comuneLocal: "La Candelaria",
          customerName: "Gabriel Romero",
          phone: "123456789",
          saleType: "Despacho",
          subtotal: 1000,
          delivery: 500,
          total: 1500,
          confirmationDate: "2021-05-27"
        },
        {
          id: 4,
          localName: "Nori Sushi",
          comuneLocal: "La Candelaria",
          customerName: "Gabriel Romero",
          phone: "123456789",
          saleType: "Despacho",
          subtotal: 1000,
          delivery: 500,
          total: 1500,
          confirmationDate: "2021-05-27"
        },
        {
          id: 5,
          localName: "Nori Sushi",
          comuneLocal: "La Candelaria",
          customerName: "Gabriel Romero",
          phone: "123456789",
          saleType: "Despacho",
          subtotal: 1000,
          delivery: 500,
          total: 1500,
          confirmationDate: "2021-05-27"
        }
      ],
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      },
      localFilter: ""
    };
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.initLocals();

    this.bus.$on("sync-page-after-refund", () => {
      this.getHistory(true);
    });
  },
  mounted() {
    this.localsFilter = this.locals;
  },
  computed: {
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    },
    validateDate() {
      if (this.startDate === "" || this.finalDate === "") {
        return true;
      }

      if (this.startDate.length < 10 || this.finalDate.length < 10) {
        return true;
      }

      return false;
    }
  },
  methods: {
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return "Total de filas: " + this.meta.meta.total;
    },
    changePage() {
      this.loadingPage = true;
      var url = this.$store.getters["routes/getRoute"]("orders.history", {
        page: this.pagination.currentPage
      });
      this.$axios
        .post(
          url,
          {
            startDate: this.startDate.replaceAll("/", "-"),
            finalDate: this.finalDate.replaceAll("/", "-"),
            localId: this.localSelected.value,
            idUser:
              this.localSelected.value === null
                ? this.$store.getters["auth/getDataUser"].id
                : null
          },
          {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          }
        )
        .then(response => {
          if (response.data.status === "success") {
            this.meta = response.data.result.pop();
            this.pagination.totalPages = this.meta.meta.totalPages;
            this.pagination.currentPage = this.meta.meta.currentPage;
            this.total = this.meta.meta.ordersTotal;
            this.count = this.meta.meta.total;
            this.mapResponse(response.data.result);
            this.initSelectPages();
            this.loadingPage = false;
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    initLocals() {
      var vue = this;
      vue.locals = [];
      var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          cartStatus: item.cartStatus
        };
        vue.locals.push(row);
        vue.locals.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
      this.localSelected = {
        label: "Todos",
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      };
    },
    filterFn(val) {
      if (val === "") {
        this.localsFilter = this.locals;
        return;
      }

      const needle = val.toLowerCase();
      this.localsFilter = this.locals.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    allOption() {
      if (this.$refs.select !== undefined) {
        this.$refs.select.hidePopup();
      }
      this.localSelected = {
        label: "Todos",
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      };
    },
    getHistory() {
      this.loading();

      var url = this.$store.getters["routes/getRoute"]("orders.history", {
        page: 1
      });
      this.$axios
        .post(
          url,
          {
            startDate: this.startDate.replaceAll("/", "-")+' '+'00:00:00',
            finalDate: this.finalDate.replaceAll("/", "-")+' '+'23:59:59',
            localId: this.localSelected.value,
            idUser:
              this.localSelected.value === null
                ? this.$store.getters["auth/getDataUser"].id
                : null
          },
          {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          }
        )
        .then(response => {
          if (response.data.status === "success") {
            this.meta = response.data.result.pop();
            this.pagination.totalPages = this.meta.meta.totalPages;
            this.pagination.currentPage = this.meta.meta.currentPage;
            this.total = this.meta.meta.ordersTotal;
            this.count = this.meta.meta.total;
            this.mapResponse(response.data.result);
            this.initSelectPages();
            this.stopLoading();
          } else {
            this.stopLoading();
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.stopLoading();
          this.errorHandling(error);
        });
    },
    loading() {
      this.flag = true;
      this.searching = true;
    },
    stopLoading() {
      this.flag = false;
      this.searching = false;
    },
    dialogCancel(item) {
      this.bus.$emit("the-cancel", item);
    },
    mapResponse(response) {
      var vue = this;
      vue.data = [];
      var each = response.map(function(item) {
        let row = {
          id: item.id,
          localName: item.local.name,
          comuneLocal: item.local.commune,
          customerName: item.payDetail.user,
          saleType: item.orderType,
          subtotal: vue.formatNumber(item.subtotal),
          delivery: vue.formatNumber(item.deliveryCost),
          total: vue.formatNumber(item.total),
          confirmationDate:
            item.dateConfirmation !== null
              ? item.dateConfirmation.replaceAll("-", "/")
              : "Sin Fecha"
        };
        vue.data.push(row);
        vue.data.sort(function(a, b) {
          if (a.id > b.id) {
            return 1;
          }
          if (a.id < b.id) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
    },
    initSelectPages() {
      this.pagesOptions = [];
      for (let index = 1; index <= this.pagination.totalPages; index++) {
        this.pagesOptions.push(index);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card-bg {
  background-color: white;
  border-radius: 10px;
}
.input-schedule {
  width: 25%;
}
@media screen and (max-width: 500px) {
  .input-schedule {
    width: 30%;
  }
}
</style>
