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
          Detalle - {{ week }}
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>
      <q-card-section style="height: auto;">
        <div
          class="fit column wrap justify-start items-start content-start"
          v-if="!loading"
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
                  :rows-per-page-options="[5]"
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
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="sales-a">
                <q-table
                  :data="data.cancelledOrdersData"
                  :columns="columns"
                  :rows-per-page-options="[5]"
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
        </div>
        <div
          class="fit column wrap justify-center items-center content-center"
          v-else
          style="height: 200px !important;"
        >
          <img
            src="~/assets/maki-roll2.gif"
            alt="sad"
            width="130"
            style="border-radius:100%"
          />
        </div>
      </q-card-section>
      <q-card-actions
        style="height: 30%; display: flex; flex-direction: column;"
        v-if="!loading"
      >
        <div
          v-if="
            data.confirmedOrdersData.length !== 0 ||
              data.cancelledOrdersData.length !== 0
          "
        >
          <p style="text-align:center;">
            <strong>Comisión Ventas (10% + IVA):</strong>
            {{
              formatNumber(
                parseInt(data.generalData[0].comision.toString().split(".")[0])
              )
            }}
          </p>
          <p style="text-align:center;">
            <strong>Total a Pagar:</strong>
            {{
              formatNumber(
                parseInt(
                  data.generalData[0].saldo_a_pagar.toString().split(".")[0]
                )
              )
            }}
          </p>
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
          align: "left",
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
          sortable: true
        },
        {
          name: "comision",
          label: "Comision",
          field: "comision",
          sortable: true
        },
        {
          name: "despacho",
          label: "Despacho",
          field: "costo_despacho",
          sortable: true
        },
        { name: "total", label: "Total", field: "total", sortable: true },
        {
          name: "pago_online",
          label: "Pago Online",
          field: "pago_online",
          sortable: true
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
    }
  }
};
</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 10px;
  max-width: 100%;
  width: 60%;
  height: auto;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .my-card {
    width: 100% !important;
  }
}
</style>
