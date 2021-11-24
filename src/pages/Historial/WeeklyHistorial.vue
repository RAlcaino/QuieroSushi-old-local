<template>
  <base-page
    icon="date_range"
    :sync="sync"
    title="Histórico Cobro Semanal"
    :toolbar="true"
  >
    <the-detail></the-detail>
    <div class="row no-wrap justify-end q__select__wh">
      <q-select
        v-if="locals.length > 1"
        outlined
        rounded
        dense
        v-model="localSelected"
        :options="locals"
        label="Locales"
        @input="change"
      />
    </div>

    <div
      class="fit column no-wrap justify-center items-center content-center"
      style="margin-top: 20px"
      v-if="data.length !== 0"
    >
      <q-table
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :loading="loadingPage"
        :pagination-label="getPaginationLabel"
        no-results-label="No se encontraron cobros. Intenten de nuevo."
        class="table__weekly__historial"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'semana'">
                {{ generateWeek(col.value) }}
              </template>
              <template v-if="col.name === 'saldo'">
                {{ formatBalance(col.value, props) }}</template
              >
              <template v-if="col.name === 'acciones'">
                <div style="display:flex; justify-content: center">
                  <q-btn
                    v-if="
                      props.row.fecha_pago === '0000-00-00 00:00:00' &&
                        props.cols[1].value > 0
                    "
                    class="gt-sm"
                    color="green"
                    rounded
                    size="sm"
                    style="margin-right:5px"
                    @click="payProcess(props)"
                    label="Pagar Online"
                  >
                    <!--<q-tooltip>
                      Pagar
                    </q-tooltip>
                    <q-icon style="margin-right:0px" size="20px" name="paid" />
                    <div style="font-size:12px">Pagar</div>-->
                  </q-btn>
                  <q-btn
                    class="gt-sm"
                    color="blue"
                    rounded
                    size="sm"
                    style="margin-right:5px"
                    @click="detail(props)"
                    label="Detalle"
                  >
                    <!--<q-tooltip>
                      Ver Detalle
                    </q-tooltip>
                    <q-icon style="margin-right:0px" size="20px" name="info" />
                    <div style="font-size:12px">Ver Detalle</div>-->
                  </q-btn>

                  <q-btn
                    class="gt-sm"
                    color="primary"
                    rounded
                    size="sm"
                    style="margin-right:5px"
                    @click="registerPay(props)"
                    label="Registrar Transferencia"
                    v-if="
                      props.row.fecha_pago === '0000-00-00 00:00:00' &&
                        props.cols[1].value > 0
                    "
                  >
                    <!--<q-tooltip>
                      Registrar Transferencia
                    </q-tooltip>
                    <q-icon
                      style="margin-right:0px"
                      size="20px"
                      name="credit_score"
                    />
                    <div style="font-size:12px">Registrar Transferencia</div>-->
                  </q-btn>
                  <q-btn
                    class="lt-md"
                    size="12px"
                    flat
                    dense
                    round
                    icon="more_vert"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="payProcess(props)"
                          v-close-popup
                          v-if="
                            props.row.fecha_pago === '0000-00-00 00:00:00' &&
                              props.cols[1].value > 0
                          "
                        >
                          <q-item-section>Pagar Online</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable @click="detail(props)" v-close-popup>
                          <q-item-section>Detalle</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          clickable
                          @click="registerPay(props)"
                          v-close-popup
                          v-if="
                            props.row.fecha_pago === '0000-00-00 00:00:00' &&
                              props.cols[1].value > 0
                          "
                        >
                          <q-item-section
                            >Registrar Transferencia</q-item-section
                          >
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div v-if="data.length !== 0" class="row justify-center q-mt-md">
        <q-pagination
          v-model="page"
          color="grey-8"
          :max="meta.total_pages"
          size="sm"
          input
          @input="changePage()"
        />
      </div>
    </div>
    <div
      class="fit column wrap justify-center items-center content-center"
      v-else
    >
      <div v-if="data.length === 0 && !loadingPage" class="not__found">
        <img src="~src/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron pagos semanal
        </p>
      </div>
      <div v-if="loadingPage" style="margin-top:150px">
        <img
          src="~/assets/maki-roll2.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
import TheDetail from "./dialogs/TheDetail.vue";
export default {
  components: { BasePage, TheDetail },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "formatNumber",
    "setCurrentLocal"
  ],
  data() {
    return {
      pagination: {
        rowsPerPage: 15,
        currentPage: null,
        totalPages: null
      },
      page: 1,
      meta: {},
      loadingPage: false,
      columns: [
        {
          name: "semana",
          required: true,
          label: "Semana",
          align: "center",
          field: "timestamp_cobro",
          sortable: true
        },
        {
          name: "saldo",
          required: true,
          align: "center",
          label: "Saldo",
          field: "saldo_a_pagar",
          sortable: true
        },
        {
          name: "acciones",
          align: "center",
          label: "Acciones"
        }
      ],
      data: [],
      locals: [],
      localSelected: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return "Total de filas: " + this.meta.total;
    },
    sync() {
      this.loadingPage = true;
      var url = `${this.$store.getters["routes/getRoute"](
        "status.postpago"
      )}?idLocal=${this.localSelected.value}&page=${this.page}`;

      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.data = response.data.result.data;
            this.meta = response.data.result.meta;
            this.loadingPage = false;
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    init() {
      this.formatLocals();
      this.sync();
    },
    formatLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ALL")];
      this.localSelected = this.locals.find(
        item => item.value === this.$store.getters["auth/getDataLocal"].id
      );
      if (this.localSelected === undefined) {
        this.localSelected = this.locals[0];
        this.setCurrentLocal(this.localSelected);
      }
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.setCurrentLocal(this.localSelected);
        this.data = [];
        this.page = 1;
        this.sync();
      }
    },
    generateWeek(day) {
      let date = new Date(day);
      let back = date.getDay() === 1 ? 10080 : 11520;
      let lastWeek = new Date(date.setMinutes(date.getMinutes() - back));

      let startDay = lastWeek.getDate();
      let startMonth = lastWeek.getMonth();

      let lastWeekPlus6Days = new Date(
        lastWeek.setMinutes(lastWeek.getMinutes() + 8640)
      );

      let endDay = lastWeekPlus6Days.getDate();
      let endMonth = lastWeekPlus6Days.getMonth();

      return `Del ${startDay} ${this.getMonth(
        startMonth
      )} ${lastWeek.getFullYear()} al ${endDay} ${this.getMonth(
        endMonth
      )} ${lastWeekPlus6Days.getFullYear()}`;
    },
    formatBalance(balance, props) {
      if (balance < 0) {
        balance *= -1;
        return `A favor $${this.formatNumber(balance)}`;
      } else if (
        balance > 0 &&
        props.row.fecha_pago === "0000-00-00 00:00:00"
      ) {
        return `A pagar $${this.formatNumberCustom(balance)}`;
      } else {
        return `Pagado $${this.formatNumberCustom(balance)}`;
      }
    },
    formatNumberCustom(balance) {
      let splitNumber = balance.toString().split(".");
      let integer = this.formatNumber(parseInt(splitNumber[0])).toString();
      return integer;
    },
    weekDay(day) {
      if (day === 0) {
        return "Domingo";
      } else if (day === 1) {
        return "Lunes";
      } else if (day === 2) {
        return "Martes";
      } else if (day === 3) {
        return "Miercoles";
      } else if (day === 4) {
        return "Jueves";
      } else if (day === 5) {
        return "Viernes";
      } else if (day === 6) {
        return "Sabado";
      }
    },
    getMonth(month) {
      if (month === 0) {
        return "Enero";
      } else if (month === 1) {
        return "Febrero";
      } else if (month === 2) {
        return "Marzo";
      } else if (month === 3) {
        return "Abril";
      } else if (month === 4) {
        return "Mayo";
      } else if (month === 5) {
        return "Junio";
      } else if (month === 6) {
        return "Julio";
      } else if (month === 7) {
        return "Agosto";
      } else if (month === 8) {
        return "Septiembre";
      } else if (month === 9) {
        return "Octubre";
      } else if (month === 10) {
        return "Noviembre";
      } else if (month === 11) {
        return "Diciembre";
      }
    },
    detail(props) {
      this.bus.$emit("open-details-postpago", {
        ...props,
        week: this.generateWeek(props.row.timestamp_cobro)
      });
    },
    registerPay(props) {
      var data = { ...props };
      this.$router.push({
        name: "register-services",
        params: {
          props: data
        }
      });
    },
    changePage() {
      this.bus.$emit("scrollTopPage");
      this.sync();
    },
    payProcess(props) {
      this.showLoading();
      var data = {       
        pay_type: "Pago Online",
        id_postpago: props.row.id,
        payed_amount: props.row.saldo_a_pagar,
        id_local: props.row.local.id_local
      };

      var url = `${this.$store.getters["routes/getRoute"]("weekly.payment")}`;

      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.hideLoading();
            window.location.href = response.data.result;
          } else {
            this.showNotification("Ha ocurrido un error", "negative", "error");
            this.hideLoading();
          }
        })
        .catch(error => {
          this.errorHandling(error);
          this.hideLoading();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.q__select__wh {
  padding-top: 20px;
  width: 90% !important;
}

.table__weekly__historial {
  width: 80%;
  border-radius: 15px;
  margin-top: 15px;
}

.not__found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 150px;
}

@media screen and (max-width: 500px) {
  .q__select__wh {
    justify-content: center;
    width: 100% !important;
  }
  .table__weekly__historial {
    width: 100%;
    border-radius: 15px;
    margin-top: 15px;
  }
}
</style>
