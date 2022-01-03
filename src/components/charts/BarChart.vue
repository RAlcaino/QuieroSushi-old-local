<template>
  <q-card
    class="q-pa-sm responsive__bar__chart"
    style="background-color: white;padding:20px; width: 49%; border-radius:20px; margin-top: 15px; height: 450px;"
  >
    <p class="title__styles">
      Ventas
      <q-spinner-facebook color="black" size="sm" v-if="isLoading" />
    </p>
    <q-card-section class="q-pa-none q-pt-md">
      <div
        v-if="barData[0] === 0 && barData[1] === 0 && isLoading === false"
        style="margin-top: 90px"
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
      <div :style="barStyle">
        <IEcharts
          style="height: 400px;"
          ref="barRef"
          :option="bar"
          :resizable="true"
        ></IEcharts>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";

export default {
  name: "BarChart",
  data() {
    return {
      bar: {},
      barData: [0, 0],
      isLoading: true
    };
  },
  mounted() {
    this.bus.$on("sync-dashboard-bar-chart", data => {
      this.sync(data);
      this.isLoading = false;
    });
    this.bus.$on("change-local-bar-chart", () => {
      this.isLoading = true;
    });
  },
  computed: {
    barStyle() {
      if (this.barData[0] === 0 && this.barData[1] === 0) {
        return { display: "none" };
      } else {
        return { display: "block" };
      }
    }
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
    sync(barData) {
      var vue = this;
      this.barData = barData.values;

      if (this.barData[0] === 0 && this.barData[1] === 0) {
        this.bar = {};
        return;
      }
      let dataAxis = barData.months;
      let data = [
        {
          value: barData.values[0],
          itemStyle: {
            color: "#a90000"
          }
        },
        {
          value: barData.values[1],
          itemStyle: {
            color: "#1167b1"
          }
        }
      ];
      let yMax = 1000000000000;
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
            name: "Monto ($)",
            type: "bar",
            barWidth: "50%",
            data: data,
            label: {
              normal: {
                formatter: function(params) {
                  var val = vue.format(params.value);
                  if (val === "$0") {
                    return "";
                  } else {
                    return val;
                  }
                },
                show: true,
                position: "inside"
              }
            }
          }
        ]
      };
    },
    format(data) {
      data = parseFloat(data);
      return `${data.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
      })}`;
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
  margin: 0;
}
@media screen and (max-width: 650px) {
  .responsive__bar__chart {
    width: 100% !important;
  }
}
</style>
