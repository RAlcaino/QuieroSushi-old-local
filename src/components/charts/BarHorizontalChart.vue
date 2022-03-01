<template>
  <q-card
    class="q-pa-sm"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px;"
  >
    <p class="title__styles">
      Custom Bar Horizontal Chart
    </p>
    <div id="chart">
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </q-card>
</template>

<script>
export default {
  mounted() {
    this.series = [
      {
        name:"Ventas",
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
      }
    ];
    this.chartOptions = {
      chart: {
        toolbar: {
          show: false
        },
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany"
        ]
      }
    };
  },
  data() {
    return {
      series: [],
      chartOptions: {}
    };
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
