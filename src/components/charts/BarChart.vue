<template>
  <q-card
    class="q-pa-sm"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px;"
  >
    <!--<q-card-section class="text-h6">
      Bar
      <q-btn
        icon="fa fa-download"
        class="float-right "
        @click="SaveImage"
        flat
        dense
        color="black"
        size="sm"
      >
        <q-tooltip>Descargar PNG</q-tooltip>
      </q-btn>
    </q-card-section>-->
    <p class="title__styles">
      Ventas
    </p>
    <q-card-section class="q-pa-none q-pt-md">
      <IEcharts
        style="height: 350px;"
        ref="barRef"
        @ready="onReady"
        :option="bar"
        :resizable="true"
      ></IEcharts>
    </q-card-section>
  </q-card>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";

export default {
  name: "BarChart",
  data() {
    return {
      ins: null,
      echarts: null,
      bar: {}
    };
  },
  methods: {
    SaveImage() {
      const linkSource = this.$refs.barRef.getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = "BarChart.png";
      downloadLink.click();
    },
    onReady(instance, echarts) {
      this.echarts = echarts;
      let dataAxis = ["Enero", "Febrero"];
      let data = [
        {
          value: 220,
          itemStyle: {
            color: "#a90000"
          }
        },
        {
          value: 100,
          itemStyle: {
            color: "#1167b1"
          }
        }
      ];
      let yMax = 500;
      let dataShadow = [];
      for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }
      this.bar = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: false,
            textStyle: {
              color: "#000"
            }
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        grid: {
          top: "5%",
          bottom: "15%",
          left: "8%",
          right: "5%"
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#000"
            }
          }
        },
        series: [
          {
            name: "Monto",
            type: "bar",
            barWidth: "50%",
            data: data
          }
        ]
      };
    }
  },
  components: {
    IEcharts
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
