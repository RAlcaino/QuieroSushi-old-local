<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card class="my-card" style="width: 500px; border-radius: 10px">
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
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                "
              >
                <strong style="color: #333"
                  >Hora actual
                  <div class="live-c"></div
                ></strong>
                <q-item-label v-if="readyToView">
                  <strong style="color: #333; font-size: 18px">
                    {{ currentTime }}
                  </strong></q-item-label
                >
                <q-item-label v-else>
                  <q-spinner-facebook color="red" size="sm"
                /></q-item-label>
              </p>
              <p
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                "
              >
                <strong style="color: #333">Hora esperada</strong>
                <strong style="color: #333; font-size: 18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />

            <div class="tab-alerts-c" v-if="orderDetail.soon !== null">
              <p
                v-if="orderDetail.soon === 1 && readyToView"
                style="
                  color: green;
                  margin: 0 auto;
                  text-align: center;
                  font-size: 13px;
                  margin-top: 10px;
                  width: 80%;
                "
              >
                Intenta dar tu mejor tiempo. El cliente lo necesita lo antes
                posible.
              </p>
              <p
                v-if="orderDetail.soon === 0 && readyToView"
                style="
                  color: green;
                  margin: 0 auto;
                  text-align: center;
                  font-size: 13px;
                  margin-top: 10px;
                  width: 80%;
                "
              >
                Intenta no cambiar los tiempos. El cliente lo necesita a esa
                hora.
              </p>
              <p
                v-if="
                  orderDetail.soon === 0 &&
                    readyToView &&
                    (preparationTime > minPreparationTime ||
                      deliveryTime > minDeliveryTime)
                "
                style="
                  color: red;
                  margin: 0 auto;
                  text-align: center;
                  font-size: 13px;
                  margin-top: 10px;
                  width: 80%;
                "
              >
                El cliente lo pide para esa hora exacta, trata de no cambiarla.
              </p>
            </div>

            <q-separator v-if="orderDetail.soon !== null" />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align: center">
                  Tiempo de preparación
                </strong>
                <div
                  v-if="readyToView"
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-input
                    v-model="preparationTime"
                    color="primary"
                    label="Minutos"
                    style="width: 100px"
                    type="number"
                    @input="changeTimes()"
                    :min="orderDetail.soon === 0 ? minPreparationTime : 0"
                  >
                    <template v-slot:prepend>
                      <q-icon name="query_builder" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-item-label>
                    <q-spinner-facebook color="red" size="sm"
                  /></q-item-label>
                </div>
                <p
                  style="
                    color: red;
                    margin: 0 auto;
                    text-align: center;
                    font-size: 13px;
                    margin-top: 10px;
                    width: 80%;
                  "
                  v-if="
                    preparationTime > 60 &&
                      orderDetail.soon !== 0 &&
                      readyToView
                  "
                >
                  Usted está dando {{ preparationTime }} minutos en tiempo de
                  cocina. Intente mejorar sus tiempos.
                </p>
              </div>
            </div>

            <q-separator v-if="orderDetail.es_uber !== 1" />
            <div class="tab-overview-c" v-if="orderDetail.es_uber !== 1">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align: center">
                  Tiempo de Despacho
                </strong>
                <div
                  v-if="readyToView"
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                  "
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
                    style="width: 100px"
                    type="number"
                    v-model="deliveryTime"
                    @input="changeTimes()"
                    :min="orderDetail.soon === 0 ? minDeliveryTime : 0"
                  >
                    <template v-slot:prepend>
                      <q-icon name="moped" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-item-label>
                    <q-spinner-facebook color="red" size="sm"
                  /></q-item-label>
                </div>
              </div>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align: center"
                  >Hora de confirmación final</strong
                >
                <div
                  v-if="readyToView"
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-chip
                    color="green"
                    text-color="white"
                    icon="room_service"
                    :label="finalDateDetail"
                  />
                </div>
                <div
                  v-else
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-item-label>
                    <q-spinner-facebook color="red" size="sm"
                  /></q-item-label>
                </div>
              </div>
            </div>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                size="sm"
                @click="confirm()"
                rounded
                color="green"
                label="Confirmar"
                :disabled="!readyToView"
              />
              <q-btn
                size="sm"
                rounded
                color="primary"
                label="Cerrar"
                @click="close()"
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
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                "
              >
                <strong style="color: #333">
                  Hora actual
                  <div class="live-c"></div
                ></strong>
                <q-item-label v-if="readyToView">
                  <strong style="color: #333; font-size: 18px">
                    {{ currentTime }}
                  </strong></q-item-label
                >
                <q-item-label v-else>
                  <q-spinner-facebook color="red" size="sm"
                /></q-item-label>
              </p>
              <p
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                "
              >
                <strong style="color: #333">Hora esperada</strong>
                <strong style="color: #333; font-size: 18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong
                  style="color: #333; text-align: center; padding-bottom: 5px"
                >
                  Horario de entrega
                </strong>
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
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
                            mask="HH:mm"
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
                <strong style="color: #333; text-align: center">
                  Hora de confirmación final
                </strong>
                <p
                  style="
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <q-chip
                    color="green"
                    text-color="white"
                    icon="room_service"
                    :label="getFormatForManual(finalDateManual)"
                  />
                </p>
              </div>
            </div>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                size="sm"
                @click="confirm()"
                rounded
                color="green"
                label="Confirmar"
                :disabled="!readyToView"
              />
              <q-btn
                size="sm"
                rounded
                color="primary"
                label="Cerrar"
                @click="close()"
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
  props: ["requestServerTime"],
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  mounted() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-confirm", data => {
      this.$store.commit("auth/setRefreshOrders", false);
      this.card = !this.card;
      this.orderDetail = { ...data };
      if (this.orderDetail.es_uber === 1) {
        this.requestedTimeShow = new Date(this.orderDetail.requestedTime);
        this.requestedTimeShow = this.format(
          this.requestedTimeShow.setMinutes(
            this.requestedTimeShow.getMinutes() - this.orderDetail.uberTime
          )
        );
        this.orderDetail.requestedTime = this.requestedTimeShow;
        this.finalDateManual = this.orderDetail.requestedTime.split(" ")[1];
        this.preparationTimeIsUber = this.orderDetail.gmapsDeliveryTime;
        this.deliveryTime = 0;
        this.constDeliveryTime = 0;
        this.minDeliveryTime = 0;
        this.orderDetail.gmapsDeliveryTime = 0;
      } else {
        this.finalDateManual = this.orderDetail.requestedTime
          .slice(0, -3)
          .split(" ")[1];
        this.deliveryTime = this.orderDetail.local.aditionalDeliveryTime;
        this.constDeliveryTime = this.orderDetail.local.aditionalDeliveryTime;
        this.minDeliveryTime = this.orderDetail.local.aditionalDeliveryTime;
      }
      this.doAlgorithm = false;
      this.readyToView = false;
      this.autoMode = true;
      let promise = this.requestServerTime();
      promise
        .then(res => {
          let date = new Date(res.data.result);
          this.$store.commit("auth/setServerTime", date.toString());
          this.calculatePreparationTime(true);
          this.updateTime();
          this.readyToView = true;
          setInterval(() => {
            this.updateTime();
          }, 1000);
        })
        .catch(error => console.error(error));
    });
  },
  computed: {
    time() {
      let time = "";
      if (this.orderDetail.es_uber === 1) {
        time = this.requestedTimeShow.split(" ")[1];
      } else {
        time = this.orderDetail.requestedTime.split(" ")[1];
      }
      let timeNSec = time.split(":");
      return timeNSec[0] + ":" + timeNSec[1];
    },
    currentTime() {
      let timeValue = "";
      timeValue +=
        this.serverTime.getHours() < 10
          ? "0" + this.serverTime.getHours()
          : this.serverTime.getHours(); // get hour
      timeValue +=
        this.serverTime.getMinutes() < 10
          ? ":0" + this.serverTime.getMinutes()
          : ":" + this.serverTime.getMinutes(); // get minutes
      return timeValue;
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
      minDeliveryTime: null,
      autoMode: true,
      doAlgorithm: false,
      constDeliveryTime: null,
      constPreparationTime: null,
      serverTime: null,
      requestedTimeShow: null,
      preparationTimeIsUber: null,
      confirmationTimestamp2: null,
      readyToView: false
    };
  },
  methods: {
    format(d, withSeconds) {
      let date = new Date(d);
      let time = "";
      let formated = "";

      time += date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      time +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes

      if (withSeconds) {
        time +=
          date.getSeconds() < 10
            ? ":0" + date.getSeconds()
            : ":" + date.getSeconds(); // get seconds
      }

      formated =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;

      return formated;
    },
    confirm() {
      if (this.orderDetail.es_uber === 1 && this.preparationTime < 10) {
        this.preparationTime = 10;
        let date = new Date(this.$store.getters["auth/getServerTime"]);
        date.setMinutes(
          date.getMinutes() +
            (10 + +this.deliveryTime + +this.orderDetail.gmapsDeliveryTime)
        );

        this.finalDateDetail = this.format(date, true);
      } else {
        this.finalDateDetail = this.format(this.finalDateDetail, true);
      }
      let pickup_ready_dt =
        this.tab === "one"
          ? +this.preparationTime
          : this.getDiff(this.getFormatForManual(this.finalDateManual));
      let pickup_deadline_dt =
        this.tab === "one"
          ? +this.preparationTime + 10
          : this.getDiff(this.getFormatForManual(this.finalDateManual)) + 10;

      if (this.orderDetail.es_uber === 1) {
        let date =
          this.tab === "one"
            ? new Date(this.finalDateDetail)
            : new Date(this.getFormatForManual(this.finalDateManual));
        let final = date.setMinutes(
          date.getMinutes() + this.preparationTimeIsUber
        );
        this.confirmationTimestamp2 = this.format(final, true);
      }

      var confirmationFinal;
      if (this.tab === "one") {
        if (this.orderDetail.es_uber !== 1) {
          confirmationFinal = this.finalDateDetail;
        } else {
          confirmationFinal = this.confirmationTimestamp2;
        }
      } else {
        if (this.orderDetail.es_uber !== 1) {
          confirmationFinal = this.getFormatForManual(this.finalDateManual);
        } else {
          confirmationFinal = this.confirmationTimestamp2;
        }
      }

      var data = {
        orderID: this.orderDetail.id,
        confirmationTimestamp:
          this.tab === "one"
            ? this.finalDateDetail
            : this.getFormatForManual(this.finalDateManual) + ":00",
        confirmationTimestamp2: confirmationFinal,
        deliveryTime:
          this.orderDetail.es_uber === 1
            ? this.preparationTimeIsUber
            : +this.deliveryTime,
        preparationTime: +this.preparationTime,
        doAlgorithm: this.doAlgorithm,
        pickup_ready_dt: pickup_ready_dt,
        pickup_deadline_dt: pickup_deadline_dt,
        plataforma: 'Dev'
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
              if (response.data.result.uber === undefined) {
                this.showNotification(
                  response.data.result,
                  "negative",
                  "error"
                );
              }
              if (response.data.result.uber !== null) {
                let { code } = response.data.result.uber;
                if (code !== undefined) {
                  this.showNotification(
                    this.getTranslate(code),
                    "negative",
                    "error"
                  );
                }
              }
              this.bus.$emit("sync-orders");
            } else {
              this.hideLoading();
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            if (error.response) {
              if (error.response.data.error_code) {
                this.showNotification(
                  error.response.data.message,
                  "negative",
                  "error"
                );
              } else {
                this.errorHandling(error);
              }
            }
            this.hideLoading();
          });
      }
      this.close();
    },
    close() {
      this.$store.commit("auth/setRefreshOrders", true);
      this.card = !this.card;
      this.finalDateManual = null;
      this.tab = "one";
      this.preparationTime = this.orderDetail.local.preparationTime;
      this.deliveryTime = this.orderDetail.local.aditionalDeliveryTime;
      this.minPreparationTime = null;
      this.minDeliveryTime = null;
      this.readyToView = false;
    },
    updateTime() {
      let date = new Date(this.$store.getters["auth/getServerTime"]);
      this.serverTime = new Date(this.$store.getters["auth/getServerTime"]);
      date.setMinutes(
        date.getMinutes() +
          (+this.preparationTime +
            +this.deliveryTime +
            +this.orderDetail.gmapsDeliveryTime)
      );
      this.calculatePreparationTime(false);
      this.updateFinalTime(date);
      this.finalConfirmationDate(date);
    },
    updateFinalTime(date) {
      this.final.hour = date.getHours();
      this.final.minutes = date.getMinutes();
      this.final.seconds = date.getSeconds();
    },
    calculatePreparationTime(flag) {
      let date = new Date(this.$store.getters["auth/getServerTime"]);
      if (this.orderDetail.es_uber !== 1) {
        date.setMinutes(
          date.getMinutes() +
            this.deliveryTime +
            this.orderDetail.gmapsDeliveryTime
        );
      }
      let date2 = new Date(
        this.orderDetail.requestedTime.replaceAll("-", "/")
        //"2021/07/23 15:00:00"
      );

      if (this.autoMode) {
        let diff = Math.ceil((date2.getTime() - date.getTime()) / 60000);
        if (diff >= 0) {
          this.minPreparationTime = diff;
          this.preparationTime = this.minPreparationTime;
        } else {
          this.minPreparationTime = 0;
          this.preparationTime = 0;
        }
      }
      if (flag) {
        this.constPreparationTime = this.preparationTime;
      }
    },
    changeTimes() {
      this.autoMode = false;
      if (
        +this.deliveryTime !== this.constDeliveryTime ||
        +this.preparationTime !== this.constPreparationTime
      ) {
        this.doAlgorithm = true;
      } else {
        this.doAlgorithm = false;
      }
    },
    finalConfirmationDate(date) {
      let tempFinalDetail = "";

      tempFinalDetail +=
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      tempFinalDetail +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes

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
    },
    getTranslate(code) {
      if (code === "address_undeliverable") {
        return "La ubicación especificada no se encuentra en un área de entrega.";
      } else if (code === "invalid_params") {
        return "Los parámetros de su solicitud no son válidos.";
      } else if (code === "unknown_location") {
        return "No se entendió la ubicación especificada.";
      } else {
        return "Error desconocido al crear el delivery.";
      }
    },
    getDiff(d) {
      let date1 = new Date(this.$store.getters["auth/getServerTime"]);
      let date2 = new Date(d);

      let diff = Math.ceil((date2.getTime() - date1.getTime()) / 60000);
      if (diff > 10) {
        this.preparationTime = diff;
        return diff;
      } else {
        this.preparationTime = 10;
        return 10;
      }
    },
    getFormatForManual(time) {
      let date = new Date(this.$store.getters["auth/getServerTime"]);
      let formated = "";

      formated =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;

      return formated;
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
