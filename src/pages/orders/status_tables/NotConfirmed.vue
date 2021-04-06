<template>
  <div>
    <more-details></more-details>
    <keep-alive>
      <the-confirm></the-confirm>
    </keep-alive>
    <the-cancel></the-cancel>
    <q-table
      :pagination.sync="pagination"
      class="q-my-xs q-my-md"
      :data="ordersNotConfirmed"
      :columns="getColumns"
      row-key="key"
      :loading="loading"
      no-data-label="No se encontro ningún registro"
      no-results-label="No se encontro ningún registro"
      rows-per-page-label="Registros por página"
      title="Pedidos sin confirmar"
      :filter="filter"
      style="border-radius: 10px !important"
      virtual-scroll
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <base-more-component :props="props" color="primary">
            <q-item clickable @click="moreDetailsDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="more" class="i-icon" />
                <span> Ver más</span>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="confirmDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="check_circle" class="i-icon" />
                <span> Confirmar</span>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="cancelDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="cancel" class="i-icon" />
                <span> Anular</span>
              </q-item-section>
            </q-item>
          </base-more-component>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'total'">{{
              formatNumber(col.value)
            }}</template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheConfirm from "./dialogs/TheConfirm.vue";
import TheCancel from "./dialogs/TheCancel.vue";

export default {
  props: ["ordersNotConfirmed"],
  inject: ["formatNumber"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheConfirm,
    TheCancel
  },
  mounted() {
    var responsive = window.matchMedia("(max-width: 450px)");
    var vue = this;

    if (screen.width < 450) {
      vue.pagination.rowsPerPage = 7;
    }

    responsive.addListener(function(event) {
      if (event.matches) {
        vue.pagination.rowsPerPage = 7;
      } else {
        vue.pagination.rowsPerPage = 10;
      }
    });
  },
  computed: {
    getColumns() {
      var newArray = [];
      var role = this.$store.getters["auth/getDataUser"].role;
      var roots = this.columns.map(function(item) {
        if (item.role.some(item2 => item2 === role)) {
          newArray.push(item);
        }
      });
      return newArray;
    }
  },
  data() {
    return {
      filter: "",
      loading: false,
      pagination: {
        rowsPerPage: 9
      },
      columns: [
        {
          name: "id",
          required: true,
          label: "ID del pedido",
          align: "left",
          field: row => row.id,
          format: val => `${val}`,
          sortable: true,
          role: ["Administrador", "Super Admin", "God"]
        },
        {
          name: "name",
          required: true,
          label: "Cliente",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "userPhone",
          align: "center",
          label: "Teléfono",
          field: "userPhone",
          sortable: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "requestedTime",
          align: "center",
          label: "Fecha Solicitud",
          field: "requestedTime",
          sortable: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "orderType",
          align: "center",
          label: "Tipo de Venta",
          field: "orderType",
          sortable: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "total",
          label: "Total ($)",
          align: "right",
          field: "total",
          sortable: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        }
      ]
    };
  },
  methods: {
    moreDetailsDialog(row) {
      this.bus.$emit("more-details", row);
    },
    confirmDialog(row) {
      this.bus.$emit("the-confirm", row);
    },
    cancelDialog(row) {
      this.bus.$emit("the-cancel", row);
    }
  }
};
</script>

<style>
.i-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.i-icon {
  padding-right: 5px;
}
</style>
