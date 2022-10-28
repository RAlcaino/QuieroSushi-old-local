<template>
  <q-card
    class="q-ma-xs"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px;"
  >
    <div id="chart">
      <apexchart
        type="pie"
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
    this.series = [30, 40, 35, 50, 49, 60, 70, 91];
    this.chartOptions = {
      chart: {
        toolbar: {
          show: false
        },
        type: "pie",
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

      title: {
        text: "Ventas",
        align: "left",
        style: {
          fontSize: "16px",
          fontFamily: undefined,
          color: "#263238"
        }
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

<style></style>
