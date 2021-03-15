<template>
  <q-table
    :pagination.sync="pagination"
    class="q-my-xs q-my-md"
    :data="data"
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
          <q-item clickable @click="test(props.row.name)">
            <q-item-section>New tab</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>New incognito tab</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section>Help &amp; Feedback</q-item-section>
          </q-item>
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
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";

export default {
  props: ["data"],
  components:{
      BaseMoreComponent
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
          name: "desc",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs" }
      ]
    };
  },
  methods: {
    test(name) {
      console.log(name);
    }
  }
};
</script>

<style></style>
