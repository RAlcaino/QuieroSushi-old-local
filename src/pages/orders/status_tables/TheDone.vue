<template>
  <div>
    <more-details></more-details>
    <q-table
      :pagination.sync="pagination"
      class="q-my-xs q-my-md"
      :data="ordersDone"
      :columns="columns"
      row-key="key"
      :loading="loading"
      no-data-label="I didn't find anything for you"
      title="Pedidos listos"
      :filter="filter"
      style="border-radius: 10px !important"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            v-on:click="onChangeField(col, datatable.currentPage)"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <base-more-component :props="props" color="green">
            <q-item clickable @click="moreDetails(props.row)">
              <q-item-section class="i-section">
                <q-icon name="more" class="i-icon" />
                <span> Ver más</span>
              </q-item-section>
            </q-item>
            <q-separator />
          </base-more-component>
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

export default {
  props: ["ordersDone"],
  components: {
    BaseMoreComponent,
    MoreDetails
  },
  data() {
    return {
      filter: "",
      loading: false,
      pagination: {
        rowsPerPage: 10
      },
      columns: [
        {
          name: "id",
          required: true,
          label: "ID Pedido",
          align: "left",
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "requestedTime",
          align: "center",
          label: "Fecha",
          field: "requestedTime",
          sortable: true
        },
        {
          name: "orderType",
          label: "Tipo de Venta",
          field: "orderType",
          sortable: true
        },
        {
          name: "subtotal",
          label: "Subtotal ($)",
          field: "subtotal",
          sortable: true
        },
        {
          name: "total",
          label: "Total ($)",
          field: "total",
          sortable: true
        }
      ]
    };
  },
  methods: {
    moreDetails(row) {
      this.bus.$emit("more-details", row);
    }
  }
};
</script>

<style></style>
