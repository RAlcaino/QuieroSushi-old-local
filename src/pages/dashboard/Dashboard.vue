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
    <card-social icon_position="right" />
    

    <div style="display:flex; flex-wrap: wrap; justify-content: space-between;">
      <area-chart></area-chart>
      <pie-chart></pie-chart>
      <bar-chart></bar-chart>
      <bar-horizontal-chart></bar-horizontal-chart>
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
import AreaChart from "src/components/charts/AreaChart.vue";
import PieChart from 'src/components/charts/PieChart.vue';
import BarChart from 'src/components/charts/BarChart.vue';
import BarHorizontalChart from 'src/components/charts/BarHorizontalChart.vue';

export default {
  name: "PageIndex",
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

  data() {
    return {
      mode: "list",
      messages: [
        {
          id: 5,
          name: "Pratik Patel",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://avatars2.githubusercontent.com/u/34883558?s=400&v=4",
          time: "10:42 PM"
        },
        {
          id: 6,
          name: "Winfield Stapforth",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/img/avatar6.jpg",
          time: "11:17 AM"
        },
        {
          id: 1,
          name: "Boy",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          time: "5:17 AM"
        },
        {
          id: 2,
          name: "Jeff Galbraith",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/team/jeff_galbraith.jpg",
          time: "5:17 AM"
        },
        {
          id: 3,
          name: "Razvan Stoenescu",
          msg:
            " -- I'll be in your neighborhood doing errands this\n" +
            "            weekend. Do you want to grab brunch?",
          avatar: "https://cdn.quasar.dev/team/razvan_stoenescu.jpeg",
          time: "5:17 AM"
        }
      ]
    };
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
