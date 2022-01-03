<template>
  <q-card
    class="q-pa-sm responsive__pie__chart"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px; height: 450px;"
  >
    <p class="title__styles">
      Porcentaje de ventas de cada promoción
      <q-spinner-facebook color="black" size="sm" v-if="isLoading" />
    </p>
    <q-card-section class="q-pa-none q-pt-md">
      <div
        v-if="pieData.length === 0 && isLoading === false"
        style="margin-top: 75px"
        class="fit column wrap justify-center items-center content-center"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          Sin información
        </p>
      </div>
      <div
        v-if="isLoading === true"
        style="margin-top: 100px"
        class="fit column wrap justify-center items-center content-center"
      >
        <img
          src="~/assets/maki-roll.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <div :style="pieStyle">
        <IEcharts
          style="height: 350px;"
          :option="pie"
          :resizable="true"
        ></IEcharts>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";

export default {
  name: "PieChart",
  components: {
    IEcharts
  },
  data() {
    return {
      pie: {},
      pieData: [],
      isLoading: true
    };
  },
  computed: {
    pieStyle() {
      if (this.pieData.length === 0) {
        return { display: "none" };
      } else {
        return { display: "block" };
      }
    }
  },
  mounted() {
    this.bus.$on("sync-dashboard-pie-chart", data => {
      this.sync(data);
      this.isLoading = false;
    });
    this.bus.$on("change-local-pie-chart", () => {
      this.pieData = [];
      this.isLoading = true;
    });
  },
  methods: {
    sync(pieData) {
      this.pieData = pieData;
      console.log(this.pieData);
      this.pie = {
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "Cantidad de venta de la promoción",
            type: "pie",
            radius: "80%",
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              formatter: "{b} ({d}%)"
            }
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.title__styles {
  text-anchor: start;
  font-size: 18px;
  font-weight: 900;
  fill: rgb(38, 50, 56);
  color: #263238;
}

@media screen and (max-width: 500px) {
  .responsive__pie__chart {
    width: 100% !important;
  }
}
</style>
