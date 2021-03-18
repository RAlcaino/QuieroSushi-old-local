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
                  style="display:flex; flex-direction: column; justify-content:center;align-items:center"
                >
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="query_builder"
                    :label="orderDetail.local.preparationTime + ' min'"
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
                    :label="'Viaje: 6 min'"
                  />
                  <q-chip
                    color="red"
                    text-color="white"
                    icon="moped"
                    :label="
                      'Adicional: ' + orderDetail.local.deliveryTime + ' min'
                    "
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
                    :label="'2021-03-02 20:00'"
                  />
                </p>
              </div>
            </div>
            <q-separator />
            <q-card-actions align="right">
              <q-btn size="sm" v-close-popup rounded color="primary" label="Cerrar" />
              <q-btn size="sm" @click="confirm()" rounded color="green" label="Confirmar" />
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
                <strong style="color: #333; text-align:center;padding-bottom:5px "
                  >Horario de entrega</strong
                >
                <div
                  style="display:flex; flex-direction: row; justify-content:center;align-items:center"
                >
                  <q-btn size="sm" icon="query_builder" round color="primary">
                    <q-popup-proxy
                      @before-show="updateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="model"
                        mask="YYYY-MM-DD HH:mm"
                        color="primary"
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          />
                          <q-btn
                            label="OK"
                            color="primary"
                            flat
                            @click="save"
                            v-close-popup
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                  <strong style="color: #333; text-align:center; padding-left:10px">
                    {{model}}
                  </strong>
                </div>

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
                    :label="'2021-03-02 20:00'"
                  />
                </p>
              </div>
            </div>
            <q-separator />
            <q-card-actions align="right">
              <q-btn size="sm" v-close-popup rounded color="primary" label="Cerrar" />
              <q-btn size="sm" @click="confirm()" rounded color="green" label="Confirmar" />
           
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
    this.bus.$on("the-confirm", data => {
      this.card = !this.card;
      this.orderDetail = data;
    });
  },
  computed: {
    time() {
      let time = this.orderDetail.requestedTime.split(" ")[1];
      let timeNSec = time.split(":");
      return timeNSec[0] + ":" + timeNSec[1];
    },
    currentTime() {
      let date = new Date();
      return date.getHours() + ":" + date.getMinutes();
    }
  },
  data() {
    return {
      card: false,
      tab: "one",
      orderDetail: {},
      model: null
    };
  },
  methods: {
    confirm() {
      console.log(this.orderDetail.id);
      this.card = !this.card;
    },
    updateProxy() {
      this.proxyDate = this.date;
    },

    save() {
      this.date = this.proxyDate;
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
