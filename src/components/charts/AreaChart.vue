<template>
  <q-card
    class="q-pa-sm"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px;"
  >
    <p class="title__styles">
      Custom Area Chart
    </p>
    <div id="chart">
      <apexchart
        type="area"
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
        name: "Ventas",
        data: [30, 40, 35, 50, 49, 60, 70, 91]
      }
    ];
    this.chartOptions = {
      chart: {
        toolbar: {
          show: false
        },
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      labels: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
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
