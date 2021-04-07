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
            <div class="tab-overview-headers-c">
              <p style="display:flex; flex-direction: column; justify-content:center;align-items:center">
                <strong style="color: #333"
                  >Hora actual
                  <div class="live-c"></div
                ></strong>
                <strong style="color: #333; font-size:18px">{{
                  currentTime
                }}</strong>
              </p>
              <p style="display:flex; flex-direction: column;justify-content:center;align-items:center" >
                <strong style="color: #333 ">Hora esperada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">
                  Tiempo de preparación
                </strong>
                <p style="display:flex; flex-direction: row; justify-content:center;align-items:center">
                  <q-input
                    v-model="preparationTime"
                    color="primary"
                    label="Minutos"
                    style="width: 100px;"
                    type="number"
                  >
                    <template v-slot:append>
                      <q-icon name="query_builder" />
                    </template>
                  </q-input>
                </p>
              </div>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">
                  Tiempo de Despacho 
                </strong>
                <p style="display:flex; flex-direction: row; justify-content:space-around;align-items:center">
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
                  >
                    <template v-slot:append>
                      <q-icon name="moped" />
                    </template>
                  </q-input>
                </p>
              </div>
            </div>

            <q-separator />

            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center">Hora de confirmación final</strong>
                <p style="display:flex; flex-direction: row; justify-content:center;align-items:center">
                  <q-chip
                    color="green"
                    text-color="white"
                    icon="room_service"
                    :label="finalTime"
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
              <p style="display:flex; flex-direction: column; justify-content:center;align-items:center">
                <strong style="color: #333">
                   Hora actual
                  <div class="live-c"></div
                ></strong>
                <strong style="color: #333; font-size:18px">
                  {{currentTime}}
                </strong>
              </p>
              <p style="display:flex; flex-direction: column;justify-content:center;align-items:center">
                <strong style="color: #333">Hora esperada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>

            <q-separator />
            
            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center;padding-bottom:5px ">
                  Horario de entrega
                </strong>
                <div style="display:flex; flex-direction: row; justify-content:center;align-items:center">
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
                                label="Close"
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
                <p style="display:flex; flex-direction: row; justify-content:center;align-items:center">
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
  created() {
    console.log("confirm created");
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-confirm", data => {
      this.card = !this.card;
      this.orderDetail = data;
      this.finalDateManual= this.orderDetail.requestedTime;
      this.preparationTime = this.orderDetail.local.preparationTime;
      this.deliveryTime = this.orderDetail.local.aditionalDeliveryTime;
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
      timeValue +=this.current.hour < 10 ? "0" + this.current.hour : this.current.hour; // get hour
      timeValue +=this.current.minutes < 10 ? ":0" + this.current.minutes: ":" + this.current.minutes; // get minutes
      return timeValue;
    },
    finalTime() {
      let tempFinalDetail = "";
      let date = new Date(Date.now());
      tempFinalDetail += this.final.hour < 10 ? "0" + this.final.hour : this.final.hour; // get hour
      tempFinalDetail += this.final.minutes < 10 ? ":0" + this.final.minutes: ":" + this.final.minutes; // get minutes
      tempFinalDetail += this.final.seconds < 10 ? ":0" + this.final.seconds: ":" + this.final.seconds //get seconds

      this.finalDateDetail  = date.getFullYear() + "-" + 
                              (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1): date.getMonth() + 1) + "-" +
                              (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
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
      preparationTime: null
    };
  },
  methods: {
    confirm() {
      var data = {
        orderID: this.orderDetail.id,
        confirmationTimestamp: this.tab === "one" ? this.finalDateDetail : this.finalDateManual,
        //confirmationTimestamp: '2021-03-08 23:00:00',
        deliveryTime: +this.deliveryTime,
        preparationTime: +this.preparationTime
      };
      //console.log(data);

      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          /*this.showNotification(
            "Pedido #" + this.orderDetail.id + " Confirmado",
            "positive",
            "check_circle"
          );*/
          this.bus.$emit("sync-orders");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("order.confirm");
        //console.log(url);
        this.$axios
          .put(url, data, {
            headers:{
              'Authorization':this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            //console.log(response.data);

            if (response.data.status === "success") {
              this.bus.$emit("sync-orders");
              /*this.showNotification(
                response.data.message,
                "positive",
                "check_circle"
              );*/
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            if (error.response) {
              if (error.response.status == 500) {
                this.showNotification(
                  "Ha ocurrido un error con el servidor",
                  "negative",
                  "error"
                );
              } else if (error.response.status == 404) {
                this.showNotification(
                  "Ha ocurrido un error de rutas",
                  "negative",
                  "error"
                );
              } else if (error.response.status == 400) {
                if (typeof error.response.data.message === "object") {
                  for (var field in error.response.data.message) {
                    this.showNotification(
                      error.response.data.message[field],
                      "negative",
                      "error"
                    );
                  }
                } else {
                    this.showNotification(
                      error.response.data.message,
                      "negative",
                      "error"
                    );
                }
              }
              else if(error.response.status == 401){
                  this.showNotification(
                    error.response.data.message,
                    "negative",
                    "error"
                  );
                  this.bus.$emit("logout");
              }
            } else {
              this.showNotification(error.message, "negative", "error");
            }
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
    },
    updateTime() {
      let date = new Date();
      this.current.hour = date.getHours();
      this.current.minutes = date.getMinutes();
      this.updateFinalTime();
    },
    updateFinalTime() {
      let date = new Date();
      date.setMinutes(date.getMinutes() + (
                      +this.preparationTime +
                      +this.deliveryTime +
                      +this.orderDetail.gmapsDeliveryTime));

      this.final.hour = date.getHours();
      this.final.minutes = date.getMinutes();
      this.final.seconds = date.getSeconds();
    },
    showNotification: function(message, color, icon) {
      this.$q.notify({
        progress: true,
        position: "top",
        message: message,
        color: color,
        icon: icon
      });
    },
    showLoading() {
      this.$q.loading.show({
        message: "Espere un momento, por favor..."
      });
    },
    hideLoading() {
      this.$q.loading.hide();
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
