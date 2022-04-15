<template>
  <q-table
    :data="data"
    :columns="columns"
    :rows-per-page-options="[0]"
    row-key="timestamp_inicio"
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
          <template
            v-if="
              col.name === 'subtotal' ||
                col.name === 'total' ||
                col.name === 'comision' ||
                col.name === 'despacho' ||
                col.name === 'pago_online' ||
                col.name === 'descuento_qs'
            "
          >
            {{
              col.value === "UBER"
                ? "UBER"
                : `$${formatNumber(Math.round(col.value))}`
            }}
          </template>
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:bottom-row v-if="data.length > 0">
      <q-tr>
        <q-td
          v-for="col in bottomRow"
          :key="col.name"
          style="text-align: center;"
        >
          <strong v-if="col.name === 'fecha' || col.name === 'comprador'">{{
            col.value
          }}</strong>
          <strong v-else>${{ formatNumber(Math.round(col.value)) }}</strong>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  props: ["data", "formatNumber"],
  created() {
    this.calculateTotals(this.data);
    this.bus.$on("reset-row-bottom", () => {
      this.resetBottomRow();
    });
  },
  data() {
    return {
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
          name: "descuento_qs",
          label: "Descuento pagado por Quierosushi.cl",
          field: "descuento_pagado_por_qs",
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
          name: "descuento_qs",
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
    calculateTotals(data) {
      data.map(item => {
        this.bottomRow[2].value = this.bottomRow[2].value + item.subtotal;
        this.bottomRow[3].value = this.bottomRow[3].value + item.comision;

        if (!isNaN(item.costo_despacho)) {
          this.bottomRow[4].value =
            this.bottomRow[4].value + item.costo_despacho;
        }
        this.bottomRow[5].value = this.bottomRow[5].value + item.total;
        this.bottomRow[6].value =
          this.bottomRow[6].value + item.descuento_pagado_por_qs;
        this.bottomRow[7].value = this.bottomRow[7].value + item.pago_online;
      });
    },
    resetBottomRow() {
      this.bottomRow[2].value = 0;
      this.bottomRow[3].value = 0;
      this.bottomRow[4].value = 0;
      this.bottomRow[5].value = 0;
      this.bottomRow[6].value = 0;
      this.bottomRow[7].value = 0;
    }
  }
};
</script>

<style></style>
