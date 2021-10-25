<template>
  <base-page icon="date_range" :sync="sync" title="Histórico Cobro Semanal" :toolbar="true">
    <div class="fit row no-wrap justify-end q__select__wh" >
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
    >
      <q-table
        :data="response"
        :columns="columns"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        no-results-label="No se encontraron cobros. Intenten de nuevo."
        style="height: 450px; width: 95%; border-radius: 15px; margin-top: 15px;"
        class="my-sticky-header-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <!--<q-th>Anular</q-th>-->
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
import { dataHistorial } from "../../data/WeeklyHistorial";
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
      pagination: {
        rowsPerPage: 10,
        currentPage: null,
        totalPages: null
      },
      columns: [
        {
          name: "timestamp_cobro",
          required: true,
          label: "Fecha Cobro",
          align: "center",
          field: "timestamp_cobro",
          sortable: true
        },
        {
          name: "fecha_pago",
          required: true,
          label: "Fecha Pago",
          align: "center",
          field: "fecha_pago",
          sortable: true
        },
        {
          name: "fecha_facturacion",
          required: true,
          align: "center",
          label: "Fecha Facturación",
          field: "fecha_facturacion",
          sortable: true
        },
        {
          name: "usuario_pago",
          required: true,
          align: "center",
          label: "Usuario Pago",
          field: "usuario_pago",
          sortable: true
        },
        {
          name: "usuario_facturacion",
          required: true,
          align: "center",
          label: "Usuario Facturación",
          field: "usuario_facturacion",
          sortable: true
        },
        {
          name: "comision",
          required: true,
          align: "center",
          label: "Comisión ($)",
          field: "comision",
          sortable: true
        },
        {
          name: "comision_devolucion",
          required: true,
          align: "center",
          label: "Comisión Devolución ($)",
          field: "comision_devolucion_anuladas",
          sortable: true
        },
        {
          name: "comision_online",
          required: true,
          align: "center",
          label: "Comisión Online ($)",
          field: "comision_online",
          sortable: true
        },
        {
          name: "comision_online_anuladas",
          required: true,
          align: "center",
          label: "Comisión Online Anuladas ($)",
          field: "comision_online_anuladas",
          sortable: true
        },
        {
          name: "pago_total",
          required: true,
          align: "center",
          label: "Pago Total ($)",
          field: "pago_total",
          sortable: true
        },
        {
          name: "saldo_a_pagar",
          required: true,
          align: "center",
          label: "A Pagar ($)",
          field: "saldo_a_pagar",
          sortable: true
        },
        {
          name: "formaPago",
          required: true,
          align: "center",
          label: "Forma De Pago",
          field: "formaPago",
          sortable: true
        }
      ],
      response: dataHistorial,
      locals: [],
      localSelected: {}
    };
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
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.sync();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.my-sticky-header-table .q-table__middle {
  max-height: 200px;
}

.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  background-color: #f2f2f2;
  z-index: 1000;
}

thead tr:first-child th {
  position: sticky;
  top: 0;
}

.q__select__wh {
  padding-top: 20px;
  width: 98% !important;
}

@media screen and (max-width: 500px) {
  .q__select__wh {
    justify-content: center;
    width: 100% !important;
  }
}
</style>
