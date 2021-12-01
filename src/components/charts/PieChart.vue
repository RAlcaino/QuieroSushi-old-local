<template>
  <q-card
    class="q-pa-sm"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px;"
  >
    <p class="title__styles">
      Custom Pie Chart
    </p>
    <q-card-section class="q-pa-none q-pt-md">
      <IEcharts
        style="height: 350px;"
        :option="getPieChartOptions"
        :resizable="true"
      ></IEcharts>
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
  computed: {
    getPieChartOptions() {
      return {
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          bottom: "0%",
          left: "right"
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "80%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
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
</style>
