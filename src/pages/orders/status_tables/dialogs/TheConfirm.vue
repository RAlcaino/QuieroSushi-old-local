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
              <p
                style="display:flex; flex-direction: column; justify-content:center;align-items:center"
              >
                <strong style="color: #333">Hora actual</strong>
                <strong style="color: #333; font-size:18px">{{
                  currentTime
                }}</strong>
              </p>
              <p
                style="display:flex; flex-direction: column;justify-content:center;align-items:center"
              >
                <strong style="color: #333 ">Hora solicitada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>
            <q-separator />
            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center"
                  >Tiempo de preparación</strong
                >
                <p
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="query_builder"
                    :label="orderDetail.local.preparationTime + ' min'"
                    v-if="!flagPreparation"
                  />
                  <q-icon
                    v-if="flagPreparation"
                    style="cursor:pointer"
                    @click="changeFlagPreparation()"
                    name="close"
                    class="i-icon"
                  />
                  <input
                    v-if="flagPreparation"
                    style="width:50px; border:0; border-bottom: 1px solid #333;outline:none;"
                    type="number"
                    ref="newPreparation"
                    :value="orderDetail.local.preparationTime"
                  />
                  <q-icon
                    v-if="!flagPreparation"
                    style="cursor:pointer"
                    @click="changeFlagPreparation()"
                    name="edit"
                    class="i-icon"
                  />
                  <q-icon
                    v-if="flagPreparation"
                    style="cursor:pointer"
                    @click="changePreparationTime()"
                    name="check"
                    class="i-icon"
                  />
                </p>
              </div>
            </div>
            <q-separator />
            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong style="color: #333; text-align:center"
                  >Tiempo de Despacho</strong
                >
                <p
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="room"
                    :label="orderDetail.gmapsDeliveryTime + ' min'"
                  />
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="moped"
                    :label="
                      'Adicional: ' + orderDetail.local.deliveryTime + ' min'
                    "
                    v-if="!flagDelivery"
                  />
                  <q-icon
                    v-if="flagDelivery"
                    style="cursor:pointer;margin-left:10px"
                    @click="changeFlagDelivery()"
                    name="close"
                    class="i-icon"
                  />
                  <input
                    v-if="flagDelivery"
                    style="width:50px; border:0; border-bottom: 1px solid #333;outline:none;"
                    type="number"
                    ref="newDelivery"
                    :value="orderDetail.local.deliveryTime"
                  />
                  <q-icon
                    v-if="!flagDelivery"
                    style="cursor:pointer"
                    @click="changeFlagDelivery()"
                    name="edit"
                    class="i-icon"
                  />
                  <q-icon
                    v-if="flagDelivery"
                    style="cursor:pointer"
                    @click="changeDeliveryTime()"
                    name="check"
                    class="i-icon"
                  />
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
              <p
                style="display:flex; flex-direction: column; justify-content:center;align-items:center"
              >
                <strong style="color: #333">Hora actual</strong>
                <strong style="color: #333; font-size:18px">{{
                  currentTime
                }}</strong>
              </p>
              <p
                style="display:flex; flex-direction: column;justify-content:center;align-items:center"
              >
                <strong style="color: #333">Hora solicitada</strong>
                <strong style="color: #333; font-size:18px">{{ time }}</strong>
              </p>
            </div>
            <q-separator />
            <div class="tab-overview-c">
              <div class="tab-overview-items-c">
                <strong
                  style="color: #333; text-align:center;padding-bottom:5px "
                  >Horario de entrega</strong
                >
                <div
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-input filled v-model="selectedTime">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="selectedTime"
                            mask="YYYY-MM-DD HH:mm"
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
            <div class="tab-overview-c" v-if="selectedTime">
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
                    :label="selectedTime"
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
    this.bus.$on("the-confirm", data => {
      this.card = !this.card;
      this.orderDetail = data;
      this.currentPreparationTime= this.orderDetail.local.preparationTime;
      this.currentDeliveryTime=this.orderDetail.local.deliveryTime;
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
      //timeValue += this.current.hour >= 12 ? " P.M." : " A.M."; // get AM/PM
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
      card: false,
      tab: "one",
      orderDetail: {},
      selectedTime: null,
      current: {
        hour: null,
        minutes: null
      },
      final: {
        hour: null,
        minutes: null
      },
      finalDateDetail: null,
      flagPreparation: false,
      flagDelivery: false,
      currentDeliveryTime:null,
      currentPreparationTime:null
    };
  },
  methods: {
    confirm() {
      console.log(this.orderDetail.id);
      console.log(this.finalDateDetail);
      this.close();
    },
    updateProxy() {
      this.proxyDate = this.date;
    },

    save() {
      this.date = this.proxyDate;
    },
    close() {
      this.card = !this.card;
      this.selectedTime = null;
      this.tab = "one";
      this.flagPreparation = false;
      this.flagDelivery = false;
      this.orderDetail.local.preparationTime=this.currentPreparationTime;
      this.orderDetail.local.deliveryTime=this.currentDeliveryTime;
    },
    updateTime() {
      let date = new Date();
      this.current.hour = date.getHours();
      this.current.minutes = date.getMinutes();
      this.updateFinalTime();
    },
    updateFinalTime() {
      console.log;
      let date = new Date();
      date.setMinutes(
        date.getMinutes() +
          this.orderDetail.local.deliveryTime +
          this.orderDetail.local.preparationTime +
          this.orderDetail.gmapsDeliveryTime
      );
      this.final.hour = date.getHours();
      this.final.minutes = date.getMinutes();
    },
    changeFlagPreparation() {
      if (this.flagDelivery) {
        this.showNotification(
          "Termine de editar el tiempo de despacho ",
          "warning",
          "warning"
        );
        return;
      }
      this.flagPreparation = !this.flagPreparation;
    },
    changeFlagDelivery() {
      if (this.flagPreparation) {
        this.showNotification(
          "Termine de editar el tiempo de preparación ",
          "warning",
          "warning"
        );
        return;
      }
      this.flagDelivery = !this.flagDelivery;
    },
    changePreparationTime() {
      this.orderDetail.local.preparationTime = +this.$refs.newPreparation.value;
      this.flagPreparation = false;
      this.updateFinalTime();
    },
    changeDeliveryTime() {
      this.orderDetail.local.deliveryTime = +this.$refs.newDelivery.value;
      this.flagDelivery = false;
      this.updateFinalTime();
    },
    showNotification: function(message, color, icon) {
      this.$q.notify({
        progress: true,
        position: "top",
        message: message,
        color: color,
        icon: icon
      });
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
</style>
