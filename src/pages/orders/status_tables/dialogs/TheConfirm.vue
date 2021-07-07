<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card class="my-card" style="width: 500px; border-radius:10px">
      <q-card-section class="q-pt-none">
        <q-tabs v-model="tab" class="text-blacklight">
          <q-tab label="Detalle" name="one" />
          <q-tab label="Manual" name="two" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel
            name="one"
            class="tab-panel-c"
            v-if="orderDetail.product"
          >
            <div class="tab-overview-headers-c" style="margn">
              <p
                style="display:flex; flex-direction: column; justify-content:center;align-items:center"
              >
                <strong style="color: #333"
                  >Hora actual
                  <div class="live-c"></div
                ></strong>
                <strong style="color: #333; font-size:18px">{{
                  currentTime
                }}</strong>
              </p>
              <p
                style="display:flex; flex-direction: column;justify-content:center;align-items:center"
              >
                <strong style="color: #333 ">Hora esperada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />

            <div class="tab-alerts-c" v-if="orderDetail.soon !== null">
              <p
                v-if="orderDetail.soon === 1"
                style="color: green; margin:0 auto;text-align: center; font-size: 13px; margin-top: 10px; width: 80%;"
              >
                Intenta dar tu mejor tiempo. El cliente lo necesita lo antes
                posible.
              </p>
              <p
                v-if="orderDetail.soon === 0"
                style="color: green; margin:0 auto;text-align: center; font-size: 13px; margin-top: 10px; width: 80%;"
              >
                Intenta no cambiar los tiempos. El cliente lo necesita a esa
                hora.
              </p>
              <p
                v-if="
                  orderDetail.soon === 0 &&
                    (preparationTime > minPreparationTime ||
                      deliveryTime > minDeliveryTime)
                "
                style="color: red; margin:0 auto;text-align: center; font-size: 13px; margin-top: 10px; width: 80%;"
              >
                El cliente lo pide para esa hora exacta, trata de no cambiarla.
              </p>
            </div>

            <q-separator v-if="orderDetail.soon !== null" />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">
                  Tiempo de preparación
                </strong>
                <div
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-input
                    v-model="preparationTime"
                    color="primary"
                    label="Minutos"
                    style="width: 100px;"
                    type="number"
                    :min="orderDetail.soon === 0 ? minPreparationTime : 0"
                  >
                    <template v-slot:prepend>
                      <q-icon name="query_builder" />
                    </template>
                  </q-input>
                </div>
                <p
                  style="color: red; margin:0 auto;text-align: center; font-size: 13px; margin-top: 10px; width: 80%;"
                  v-if="preparationTime > 60 && orderDetail.soon!==0"
                >
                  Usted está dando {{ preparationTime }} minutos en tiempo de
                  cocina. Intente mejorar sus tiempos.
                </p>
              </div>
            </div>

            <q-separator />
            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">
                  Tiempo de Despacho
                </strong>
                <p
                  style="display:flex; flex-direction: row; justify-content:space-around;align-items:center"
                >
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="room"
                    :label="orderDetail.gmapsDeliveryTime + ' min'"
                  />
                  <q-input
                    color="primary"
                    label="Minutos"
                    style="width: 100px;"
                    type="number"
                    v-model="deliveryTime"
                    :min="orderDetail.soon === 0 ? minDeliveryTime : 0"
                  >
                    <template v-slot:prepend>
                      <q-icon name="moped" />
                    </template>
                  </q-input>
                </p>
              </div>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center"
                  >Hora de confirmación final</strong
                >
                <p
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-chip
                    color="green"
                    text-color="white"
                    icon="room_service"
                    :label="orderDetail.soon === 1 ? finalTime : finalTime2"
                  />
                </p>
              </div>
            </div>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                size="sm"
                rounded
                color="primary"
                label="Cerrar"
                @click="close()"
              />
              <q-btn
                size="sm"
                @click="confirm()"
                rounded
                color="green"
                label="Confirmar"
              />
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel
            name="two"
            class="tab-panel-c"
            v-if="orderDetail.product"
          >
            <div class="tab-overview-headers-c">
              <p
                style="display:flex; flex-direction: column; justify-content:center;align-items:center"
              >
                <strong style="color: #333">
                  Hora actual
                  <div class="live-c"></div
                ></strong>
                <strong style="color: #333; font-size:18px">
                  {{ currentTime }}
                </strong>
              </p>
              <p
                style="display:flex; flex-direction: column;justify-content:center;align-items:center"
              >
                <strong style="color: #333">Hora esperada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong
                  style="color: #333; text-align:center;padding-bottom:5px "
                >
                  Horario de entrega
                </strong>
                <div
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-input filled v-model="finalDateManual">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="finalDateManual"
                            mask="YYYY-MM-DD HH:mm:ss"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Cerrar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <q-separator />

            <div class="tab-overview-c" v-if="finalDateManual">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">
                  Hora de confirmación final
                </strong>
                <p
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-chip
                    color="green"
                    text-color="white"
                    icon="room_service"
                    :label="finalDateManual"
                  />
                </p>
              </div>
            </div>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                size="sm"
                rounded
                color="primary"
                label="Cerrar"
                @click="close()"
              />
              <q-btn
                size="sm"
                @click="confirm()"
                rounded
                color="green"
                label="Confirmar"
              />
            </q-card-actions>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-confirm", data => {
      this.card = !this.card;
      this.orderDetail = data;
      this.finalDateManual = this.orderDetail.requestedTime;
      this.deliveryTime = this.orderDetail.local.aditionalDeliveryTime;
      this.minDeliveryTime = this.orderDetail.local.aditionalDeliveryTime;

      if (this.orderDetail.soon === 0) {
        this.calculatePreparationTime();
      } else {
        this.preparationTime = this.orderDetail.local.preparationTime;
        this.minPreparationTime = this.orderDetail.local.preparationTime;
      }
      this.updateTime();
      setInterval(() => {
        this.updateTime();
      }, 1000);
    });
  },
  computed: {
    time() {
      let time = this.orderDetail.requestedTime.split(" ")[1];
      let timeNSec = time.split(":");
      return timeNSec[0] + ":" + timeNSec[1];
    },
    currentTime() {
      let timeValue = "";
      timeValue +=
        this.current.hour < 10 ? "0" + this.current.hour : this.current.hour; // get hour
      timeValue +=
        this.current.minutes < 10
          ? ":0" + this.current.minutes
          : ":" + this.current.minutes; // get minutes
      return timeValue;
    },
    finalTime() {
      let tempFinalDetail = "";
      let date = new Date(Date.now());
      tempFinalDetail +=
        this.final.hour < 10 ? "0" + this.final.hour : this.final.hour; // get hour
      tempFinalDetail +=
        this.final.minutes < 10
          ? ":0" + this.final.minutes
          : ":" + this.final.minutes; // get minutes
      tempFinalDetail +=
        this.final.seconds < 10
          ? ":0" + this.final.seconds
          : ":" + this.final.seconds; //get seconds

      this.finalDateDetail =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        tempFinalDetail;

      return this.finalDateDetail;
    },
    finalTime2() {
      let tempFinalDetail = "";
      let date = new Date(Date.now());
      date.setMinutes(
        date.getMinutes() +
          (+this.preparationTime +
            +this.deliveryTime +
            +this.orderDetail.gmapsDeliveryTime)
      );
      tempFinalDetail +=
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      tempFinalDetail +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes
      tempFinalDetail +=
        date.getSeconds() < 10
          ? ":0" + date.getSeconds()
          : ":" + date.getSeconds(); //get seconds

      this.finalDateDetail =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        tempFinalDetail;

      return this.finalDateDetail;
    }
  },
  data() {
    return {
      prod: null,
      card: false,
      tab: "one",
      orderDetail: {},
      current: {
        hour: null,
        minutes: null
      },
      final: {
        hour: null,
        minutes: null,
        seconds: null
      },
      finalDateManual: null,
      finalDateDetail: null,
      deliveryTime: null,
      preparationTime: null,
      minPreparationTime: null,
      minDeliveryTime: null
    };
  },
  methods: {
    confirm() {
      var data = {
        orderID: this.orderDetail.id,
        confirmationTimestamp:
          this.tab === "one" ? this.finalDateDetail : this.finalDateManual,
        //confirmationTimestamp: '2021-03-08 23:00:00',
        deliveryTime: +this.deliveryTime,
        preparationTime: +this.preparationTime
      };

      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.bus.$emit("sync-orders");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("order.confirm");
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.hideLoading();
              this.bus.$emit("sync-orders");
            } else {
              this.hideLoading();
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
      this.close();
    },
    close() {
      this.card = !this.card;
      this.finalDateManual = null;
      this.tab = "one";
      this.preparationTime = this.orderDetail.local.preparationTime;
      this.deliveryTime = this.orderDetail.local.aditionalDeliveryTime;
      this.minPreparationTime = null;
      this.minDeliveryTime = null;
    },
    updateTime() {
      let date = new Date();
      this.current.hour = date.getHours();
      this.current.minutes = date.getMinutes();
      this.updateFinalTime();
    },
    updateFinalTime() {
      let date = new Date();
      date.setMinutes(
        date.getMinutes() +
          (+this.preparationTime +
            +this.deliveryTime +
            +this.orderDetail.gmapsDeliveryTime)
      );

      this.final.hour = date.getHours();
      this.final.minutes = date.getMinutes();
      this.final.seconds = date.getSeconds();
    },
    calculatePreparationTime() {
      let date = new Date(Date.now());
      date.setMinutes(
          date.getMinutes() +
          this.deliveryTime +
          this.orderDetail.gmapsDeliveryTime
      );
      let date2 = new Date(
        this.orderDetail.requestedTime.replaceAll("-", "/")
        //"2021/07/06 21:00:00"
      );
      this.minPreparationTime = Math.round(
        (date2.getTime() - date.getTime()) / 60000
      );
      
      this.preparationTime=this.minPreparationTime;
    }
  }
};
</script>

<style lang="scss">
.tab-panel-c {
  height: auto !important;
  overflow: visible !important;
}
.tab-overview-c {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 20px 0;
}

.tab-alerts-c {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-items: center;
  padding: 20px 0;
}
.tab-overview-headers-c {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  text-align: left;
  p {
    margin-bottom: 5px;
  }
}
.tab-overview-items-c {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: left;
  p {
    margin-bottom: 0;
  }
}

.tab-overview-subtotals-c {
  width: 30%;
  display: flex;
  justify-content: right;
  flex-direction: column;
  p {
    margin-bottom: 0;
  }
}

.tab-overview-footer-c {
  width: 100%;
  padding-top: 15px;
  display: flex;
  justify-content: right;
  align-items: right;
  flex-direction: column;
  p {
    text-align: right;
    margin-bottom: 0;
  }
}
.live-c {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 100%;
  margin-bottom: 2px;
  animation: live-animation 1s linear infinite;
}

@keyframes live-animation {
  50% {
    opacity: 0.2;
    color: red;
  }
}
</style>
