<template>
  <!--<q-page class="flex flex-center" style="padding-bottom:125px">
    <q-card class="bg-transparent no-border no-shadow">
      <div class="row items-center full-width justify-center q-col-gutter-lg">
        <q-icon
          name="settings"
          color="bg-grey-2 text-black"
          size="5rem"
        ></q-icon>
        <q-icon
          name="warnings"
          class="q-ml-lg"
          color="bg-grey-2 text-black"
          size="5rem"
        ></q-icon>
      </div>
      <div class="row full-width">
        <div class="col-lg-12 col-md-12 cl-sm-12 col-xs-12">
          <div>
            <div class="text-h3 text-center text-black">
              En construcción
            </div>
            <div class="text-h6 text-center text-black">
              Esta sección estará disponible pronto.
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>-->
  <base-page
    title=""
    icon=""
    :sync="false"
    :toolbar="false"
    :bgColor="`#eff4f7`"
    style="padding: 30px;"
  >
    <div style="display:flex; justify-content: center; margin-bottom: 25px;">
      <q-select
        rounded
        outlined
        dense
        :options="localsFilter"
        :options-dense="true"
        hide-hint
        label="Locales"
        v-model="localSelected"
        @input="change"
      >
        <template v-slot:prepend>
          <q-icon name="store" />
        </template>
        <template v-slot:before-options v-if="locals.length > 1">
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

    <card-social icon_position="right" />

    <div style="display:flex; flex-wrap: wrap; justify-content: space-between;">
      <bar-chart></bar-chart>
      <pie-chart></pie-chart>
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
import PieChart from "src/components/charts/PieChart.vue";
import BarChart from "src/components/charts/BarChart.vue";
import BarHorizontalChart from "src/components/charts/BarHorizontalChart.vue";
import AreaChart from "src/components/charts/AreaChart.vue";

export default {
  name: "PageIndex",
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals"
  ],
  components: {
    CardSocial: () => import("components/cards/CardSocial"),
    CardCharts: () => import("components/cards/CardCharts"),
    TabSocial: () => import("components/tabs/TabSocial"),
    CardWithImage: () => import("components/cards/CardWithImage"),
    CardTimeLine: () => import("components/cards/CardTimeLine"),
    TodoList: () => import("components/list/TodoList"),
    TableVisits: () => import("components/tables/TableVisits"),
    BasePage,
    AreaChart,
    PieChart,
    BarChart,
    BarHorizontalChart
  },
  mounted() {
    this.initLocals();
    this.localsFilter = this.locals;
    this.getData();
  },
  data() {
    return {
      locals: [],
      localFilter: "",
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      }
    };
  },
  methods: {
    initLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      if (this.$store.getters["auth/getDataLocal"].id === -1) {
        this.localSelected = {
          ...this.locals[0],
          name: `${this.locals[0].name}, ${this.locals[0].commune}`
        };

        this.$store.commit("auth/setCurrentLocal", {
          ...this.localSelected,
          id: this.localSelected.value
        });
      } else {
        this.localSelected = {
          ...this.$store.getters["auth/getDataLocal"],
          value: this.$store.getters["auth/getDataLocal"].id,
          label: `${this.$store.getters["auth/getDataLocal"].name}, ${this.$store.getters["auth/getDataLocal"].commune}`
        };
      }
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
        this.bus.$emit("reset-dashboard-card-data");
        this.localSelected = { ...val };
        this.getData();
        this.$store.commit("auth/setCurrentLocal", {
          ...this.localSelected,
          id: this.localSelected.value
        });
      }
    },
    getData() {
      var url = this.$store.getters["routes/getRoute"]("sales.amount", {
        idLocal: this.localSelected.value
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.bus.$emit("sync-dashboard-card-data", [
              ...response.data.result
            ]);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    }
  }
};
/*<div class="row q-col-gutter-sm  q-py-sm">
      <tab-social />
      <card-with-image />
    </div>

    <card-charts />
    <div class="row q-col-gutter-sm  q-py-sm">
      <todo-list />

      <card-time-line />
      
    <table-visits />
    </div>*/
</script>
