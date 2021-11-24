<template>
  <q-dialog v-model="open" persistent>
    <q-card class="my-card">
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="description"
          />
          Detalle
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section style="max-height: 90%; overflow: auto;padding: 5px;">
        <div
          class="fit column wrap justify-start items-start content-start"
          v-if="!loading"
        >
          <strong
            style="width: 100%; text-align: center;margin: 15px 0; font-size: 16px;"
            >Semana {{ week }}</strong
          >
          <div style="width: 100%; height: 100%; border-radius: 15px; ">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              align="justify"
              narrow-indicator
            >
              <q-tab
                name="sales-c"
                label="Ventas Confirmadas"
                class="text-green"
              />
              <q-tab
                name="sales-a"
                label="Ventas Anuladas"
                class="text-primary"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated keep-alive>
              <q-tab-panel name="sales-c">
                <q-table
                  :data="data.confirmedOrdersData"
                  :columns="columns"
                  :rows-per-page-options="[0]"
                  no-results-label="No se encontraron ventas confirmadas"
                  row-key="timestamp_inicio"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <template
                          v-if="
                            col.name === 'subtotal' ||
                              col.name === 'total' ||
                              col.name === 'comision' ||
                              col.name === 'despacho' ||
                              col.name === 'pago_online'
                          "
                        >
                          ${{ formatNumber(col.value) }}
                        </template>
                        <template v-else>
                          {{ col.value }}
                        </template>
                      </q-td>
                    </q-tr>
                  </template>

                  <template v-slot:bottom-row>
                    <q-tr>
                      <q-td
                        v-for="col in bottomRow"
                        :key="col.name"
                        style="text-align: center;"
                      >
                        <strong
                          v-if="
                            col.name === 'fecha' || col.name === 'comprador'
                          "
                          >{{ col.value }}</strong
                        >
                        <strong v-else>${{ formatNumber(col.value) }}</strong>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="sales-a">
                <q-table
                  :data="data.cancelledOrdersData"
                  :columns="columns"
                  :rows-per-page-options="[0]"
                  row-key="timestamp_inicio"
                  no-results-label="No se encontraron ventas anuladas"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <template
                          v-if="
                            col.name === 'subtotal' ||
                              col.name === 'total' ||
                              col.name === 'comision' ||
                              col.name === 'despacho' ||
                              col.name === 'pago_online'
                          "
                        >
                          ${{ formatNumber(col.value) }}
                        </template>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div
            style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; width: 100%; margin-top: 20px; padding: 0 15px;"
            v-if="!loading"
          >
            <div
              v-if="
                data.confirmedOrdersData.length !== 0 ||
                  data.cancelledOrdersData.length !== 0
              "
            >
              <p style="text-align:right;">
                <strong>Comisión Ventas (12% + IVA):</strong>
                ${{
                  formatNumber(
                    parseInt(data.generalData.comision.toString().split(".")[0])
                  )
                }}
              </p>
              <p style="text-align:right;">
                <strong>Comisión Pago Online (3% + IVA) :</strong>
                ${{
                  formatNumber(
                    parseInt(
                      data.generalData.comision_online.toString().split(".")[0]
                    )
                  )
                }}
              </p>
              <p style="text-align:right;">
                <strong>Total a Pagar:</strong>
                ${{
                  formatNumber(
                    parseInt(
                      data.generalData.totalToPay.toString().split(".")[0]
                    )
                  )
                }}
              </p>
              <p style="text-align:right;">
                <strong>Pagos Recibidos Online:</strong>
                ${{
                  formatNumber(
                    parseInt(
                      data.generalData.pago_online.toString().split(".")[0]
                    )
                  )
                }}
              </p>
              <p
                style="text-align:right;border-top: 3px dotted #ff2d2d; padding-top: 10px; font-size: 18px;"
              >
                <strong v-if="data.generalData.saldo_a_pagar > 0"
                  >Saldo a pagar:</strong
                >
                <strong v-else>Monto a recibir:</strong>
                ${{
                  formatNumber(
                    parseInt(
                      data.generalData.saldo_a_pagar.toString().split(".")[0]
                    )
                  )
                    .toString()
                    .replaceAll("-", "")
                }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="fit column wrap justify-center items-center content-center"
          v-else
          style="height: 450px !important;"
        >
          <img
            src="~/assets/maki-roll2.gif"
            alt="sad"
            width="130"
            style="border-radius:100%"
          />
        </div>
      </q-card-section>
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
    "getStoreLocals",
    "formatNumber"
  ],
  created() {
    this.bus.$on("open-details-postpago", props => {
      this.open = true;
      this.week = props.week;
      this.getDetail(props.key);
    });
  },
  data() {
    return {
      open: false,
      data: [],
      tab: "sales-c",
      loading: true,
      salesConfirmed: [],
      week: "",
      columns: [
        {
          name: "fecha",
          label: "Fecha",
          align: "center",
          field: "timestamp_inicio",
          sortable: true
        },
        {
          name: "comprador",
          align: "center",
          label: "Comprador",
          field: "nombre",
          sortable: true
        },
        {
          name: "subtotal",
          label: "Subtotal",
          field: "subtotal",
          sortable: true,
          align: "center"
        },
        {
          name: "comision",
          label: "Comision",
          field: "comision",
          sortable: true,
          align: "center"
        },
        {
          name: "despacho",
          label: "Despacho",
          field: "costo_despacho",
          sortable: true,
          align: "center"
        },
        {
          name: "total",
          label: "Total",
          field: "total",
          sortable: true,
          align: "center"
        },
        {
          name: "pago_online",
          label: "Pago Online",
          field: "pago_online",
          sortable: true,
          align: "center"
        }
      ],
      bottomRow: [
        {
          name: "fecha",
          value: ""
        },
        {
          name: "comprador",
          value: "TOTALES"
        },
        {
          name: "subtotal",
          value: 0
        },
        {
          name: "comision",
          value: 0
        },
        {
          name: "despacho",
          value: 0
        },
        {
          name: "total",
          value: 0
        },
        {
          name: "pago_online",
          value: 0
        }
      ]
    };
  },
  methods: {
    getDetail(idPostpago) {
      var url = this.$store.getters["routes/getRoute"]("report", {
        idPostpago: idPostpago
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.data = response.data.result;
            this.calculateTotals(this.data);
            this.loading = false;
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    close() {
      this.open = false;
      this.data = [];
      this.tab = "sales-c";
      this.loading = true;
      this.salesConfirmed = [];
      this.week = "";
      this.resetBottomRow();
    },
    calculateTotals(data) {
      data.confirmedOrdersData.map(item => {
        this.bottomRow[2].value = this.bottomRow[2].value + item.subtotal;
        this.bottomRow[3].value = this.bottomRow[3].value + item.comision;
        this.bottomRow[4].value = this.bottomRow[4].value + item.costo_despacho;
        this.bottomRow[5].value = this.bottomRow[5].value + item.total;
        this.bottomRow[6].value = this.bottomRow[6].value + item.pago_online;
      });
    },
    resetBottomRow() {
      this.bottomRow[2].value = 0;
      this.bottomRow[3].value = 0;
      this.bottomRow[4].value = 0;
      this.bottomRow[5].value = 0;
      this.bottomRow[6].value = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 10px;
  max-width: 100%;
  width: 65%;
  height: 600px;
  overflow: hidden;
}

@media screen and (max-width: 900px) {
  .my-card {
    width: 100% !important;
  }
}
</style>
