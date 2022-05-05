<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
    style="width: 800px;"
  >
    <q-card class="my-card" style="width: 100%; border-radius:10px;">
      <q-card-section class="q-pt-none" style="padding-bottom:0">
        <q-tabs v-model="tab" class="text-blacklight">
          <q-tab
            name="one"
            style="text-transform: capitalize;"
            :label="
              `${
                $store.getters['auth/getDataUser'].role === 'God'
                  ? `N° Pedido: ${orderDetail.id} - ${orderDetail.internalCode}`
                  : `N° Pedido: ${orderDetail.internalCode}`
              }`
            "
          />
          <q-tab
            v-if="orderDetail.es_uber === 1 && orderDetail.delivery_id !== null"
            label="Uber"
            name="two"
            @click="
              () => {
                getStatus();
                getLocations();
              }
            "
          />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="one" class="tab-panel" v-if="orderDetail.product">
            <q-list class="list-style" style="border-bottom: 1.2px dotted #000">
              <q-item
                v-if="orderDetail.extras"
                v-ripple
                style="padding: 8px 0 !important"
              >
                <q-item-section avatar>
                  <img
                    src="~assets/salsas.jpg"
                    width="50"
                    style="border-radius:10%"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    style="text-align: left;color:#333; margin:0;font-weight:bold; font-size: 14px"
                  >
                    Palitos: {{ orderDetail.extras.chopsticks }} | Jengibre:
                    {{ orderDetail.extras.ginger }} | Wasabi:
                    {{ orderDetail.extras.wasabi }}
                  </q-item-label>
                  <q-item-label caption> Incluido</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-for="(item, index) in orderDetail.product"
                :key="index"
                v-ripple
                style="padding: 8px 0 !important"
              >
                <q-item-section avatar>
                  <img
                    :src="item.detail.image"
                    width="50"
                    style="border-radius:10%"
                  />
                </q-item-section>
                <q-item-section
                  class="fit row wrap justify-between items-start content-start"
                  style="flex-direction: row !important"
                >
                  <q-item-label
                    style="width: 60%; font-weight:bold;font-size: 14px; color: #333"
                  >
                    {{ item.quantity }} x {{ item.detail.name }}
                  </q-item-label>
                  <q-item-label
                    style="width: 40%; text-align: right; margin:0;font-weight:bold; color:#ff2d2d; font-size: 14px"
                  >
                    {{ " $" + formatNumber(item.quantity * item.detail.price) }}
                  </q-item-label>
                  <q-item-label caption>
                    {{
                      " $" + formatNumber(item.detail.price) + " C/U"
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
            <div class="tab-overview-footer">
              <p v-if="orderDetail.discount !== 0" style="font-size:14px">
                <strong style="color: #333;">Descuento: </strong> ${{
                  formatNumber(orderDetail.discount)
                }}
              </p>
              <p style="font-size:14px">
                <strong style="color: #333;"
                  >{{ `${orderDetail.es_uber !== 1 ? "Subtotal:" : "Total:"}` }}
                </strong>
                ${{ formatNumber(orderDetail.subtotal) }}
              </p>
              <p style="font-size:14px" v-if="orderDetail.es_uber !== 1">
                <strong style="color: #333;">Costo Despacho: </strong> ${{
                  formatNumber(orderDetail.deliveryCost)
                }}
              </p>
              <p style="font-size:14px" v-if="orderDetail.es_uber !== 1">
                <strong style="color: #333;">Total: </strong>
                <span style="color:#ff2d2d; font-weight:bold"
                  >${{ formatNumber(orderDetail.total) }}</span
                >
              </p>
            </div>
            <div class="tab-overview-footer">
              <q-list>
                <q-item
                  v-if="
                    orderDetail.aditionalMessage !== '' &&
                      orderDetail.aditionalMessage !== null
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="message" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label style="font-weight: bold;"
                      >Mensaje del cliente</q-item-label
                    >
                    <q-item-label>{{
                      orderDetail.aditionalMessage
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>
          <q-tab-panel name="two" class="tab-panel">
            <q-list>
              <q-item v-if="orderDetail.delivery_id !== null">
                <q-item-section avatar>
                  <q-icon name="delivery_dining" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="font-weight: bold;"
                    >Estado del repartidor:
                    <q-icon
                      name="refresh"
                      size="1.3em"
                      style="cursor: pointer;"
                      @click="getStatus()"
                    ></q-icon>
                  </q-item-label>
                  <q-item-label
                    v-if="deliveryStatus !== '' && deliveryStatusObject !== {}"
                    >{{ deliveryStatus }}
                    <q-item-label
                      style="display:flex; justify-content: center; margin-top: 10px"
                      v-if="deliveryShortStatus === 'canceled'"
                    >
                      <q-btn
                        size="sm"
                        @click="createDelivery()"
                        rounded
                        color="green"
                        label="Pedir otro delivery"
                      />
                    </q-item-label>
                  </q-item-label>
                  <q-item-label v-else>
                    <q-spinner-facebook color="primary" size="2em" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="
                  orderDetail.delivery_id !== null &&
                    courier !== null &&
                    deliveryShortStatus !== 'pending' &&
                    deliveryShortStatus !== 'delivered' &&
                    deliveryShortStatus !== 'returned' &&
                    deliveryShortStatus !== ''
                "
              >
                <q-item-section avatar>
                  <q-icon name="location_on" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="font-weight: bold;"
                    >Ubicación del repartidor:
                  </q-item-label>
                  <q-item-label v-if="courier !== null">
                    <GmapMap
                      :center="{
                        lat: courier.location.lat,
                        lng: courier.location.lng
                      }"
                      :zoom="18"
                      style="width: 100%; height: 226px; border-radius:10px;"
                    >
                      <GmapMarker
                        v-for="(marker, index) in markers"
                        :key="index"
                        :position="marker"
                        :clickable="true"
                        :icon="{
                          url: require(`../../../../assets/${marker.icon}`),
                          size: {
                            width: 30,
                            height: 30,
                            f: 'px',
                            b: 'px'
                          },
                          scaledSize: {
                            width: 30,
                            height: 30,
                            f: 'px',
                            b: 'px'
                          }
                        }"
                      /> </GmapMap
                  ></q-item-label>
                  <q-item-label v-else>
                    <q-spinner-facebook color="primary" size="2em" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="
                  orderDetail.delivery_id !== null &&
                    deliveryShortStatus !== '' &&
                    (deliveryShortStatus === 'pickup' ||
                      deliveryShortStatus === 'pickup_complete' ||
                      deliveryShortStatus === 'dropoff' ||
                      deliveryShortStatus === 'returned') &&
                    courier !== null
                "
              >
                <q-item-section avatar>
                  <q-icon name="face" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="display: flex; flex-direction: column;">
                    <p style="font-weight: bold; margin: 0;">
                      Información del repartidor:
                    </p>
                    <div style="display: flex; margin-top: 15px;">
                      <img
                        style="border-radius: 100%"
                        width="80px"
                        :src="courier.img_href"
                        alt="foto uber"
                      />
                      <div style="margin-left: 10px">
                        <p style="margin: 0; margin-bottom: 3px">
                          <label style="font-weight: bold;">Nombre: </label
                          >{{ courier.name }}
                        </p>
                        <p style="margin: 0; margin-bottom: 3px">
                          <label style="font-weight: bold;">Télefono: </label
                          >{{ courier.phone_number }}
                        </p>
                      </div>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="
                  orderDetail.delivery_id !== null &&
                    (deliveryShortStatus === 'pickup' ||
                      deliveryShortStatus === 'pickup_complete') &&
                    deliveryShortStatus !== ''
                "
              >
                <q-item-section avatar>
                  <q-icon name="schedule" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    v-if="pickup_eta !== '' && deliveryStatusObject !== {}"
                    style="display: flex;"
                  >
                    <p style="font-weight: bold; margin: 0;">
                      Hora estimada en llegar al local:
                    </p>
                    <p style="margin: 0; margin-left: 6px;">
                      {{ pickup_eta.split(" ")[1].slice(0, 5) }}
                    </p>
                  </q-item-label>
                  <q-item-label v-else>
                    <q-spinner-facebook color="primary" size="2em"
                  /></q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="
                  orderDetail.delivery_id !== null &&
                    (deliveryShortStatus === 'dropoff' ||
                      deliveryShortStatus === 'returned') &&
                    deliveryShortStatus !== ''
                "
              >
                <q-item-section avatar>
                  <q-icon name="schedule" color="primary" />
                </q-item-section>
                <q-item-section style="display: flex;">
                  <q-item-label
                    v-if="dropoff_eta !== '' && deliveryStatusObject !== {}"
                    style="display: flex;"
                  >
                    <p style="font-weight: bold; margin: 0;">
                      Hora estimada en llegar al destino:
                    </p>
                    <p style="margin: 0; margin-left: 6px;">
                      {{ dropoff_eta.split(" ")[1].slice(0, 5) }}
                    </p>
                  </q-item-label>
                  <q-item-label v-else>
                    <q-spinner-facebook color="primary" size="2em"
                  /></q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="
                  orderDetail.delivery_id !== null &&
                    deliveryShortStatus !== 'pending' &&
                    deliveryShortStatus !== 'delivered' &&
                    deliveryShortStatus !== 'canceled' &&
                    deliveryShortStatus !== ''
                "
              >
                <q-item-section avatar>
                  <q-icon name="message" color="primary" />
                </q-item-section>
                <q-item-section>
                  <div>
                    <q-input
                      v-model="msg"
                      filled
                      type="textarea"
                      hint="Mensaje para el delivery"
                    />
                  </div>
                  <q-item-label
                    style="display:flex; justify-content: center; margin-top: 10px"
                  >
                    <q-btn
                      size="sm"
                      v-close-popup
                      rounded
                      @click="updateDelivery('msg')"
                      color="green"
                      label="Enviar"
                      :disabled="msg === null || msg === ''"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="
                  orderDetail.delivery_id !== null && deliveryShortStatus !== ''
                "
              >
                <q-item-section avatar>
                  <q-icon name="phone" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="display: flex;">
                    <p style="font-weight: bold; margin: 0;">
                      Télefono de soporte de Uber:
                    </p>
                    <p style="margin: 0; margin-left: 6px;">
                      +56-800231021
                    </p>
                  </q-item-label>
                  <q-item-label
                    style="display: flex;"
                    v-if="
                      orderDetail.uuid !== null &&
                        orderDetail.uuid !== undefined &&
                        $store.getters['auth/getDataUser'].role === 'God'
                    "
                  >
                    <p style="font-weight: bold; margin: 0;">
                      uuid:
                    </p>
                    <p style="margin: 0; margin-left: 6px;">
                      {{ orderDetail.uuid }}
                    </p>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!--<q-item v-if="orderDetail.delivery_id !== null">
                <q-item-section avatar>
                  <q-icon name="attach_money" color="primary" />
                </q-item-section>
                <q-item-section style="display: flex; flex-direction: column;">
                  <div>
                    <q-input
                      v-model="tip"
                      filled
                      type="number"
                      hint="Propina para el delivery (CLP)"
                    />
                  </div>
                  <q-item-label
                    style="display:flex; justify-content: center; margin-top: 10px"
                  >
                    <q-btn
                      size="sm"
                      v-close-popup
                      rounded
                      color="green"
                      @click="updateDelivery('tip')"
                      label="Agregar"
                      :disabled="tip === null || tip === ''"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>-->
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="sm" v-close-popup rounded color="primary" label="Cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["currentTab"],
  inject: [
    "formatNumber",
    "errorHandling",
    "getServerTime",
    "showNotification",
    "showLoading",
    "hideLoading"
  ],
  created() {
    this.bus.$on("more-details", data => {
      this.markers = [];
      this.courier = null;
      this.tab = "one";
      this.tip = null;
      this.card = !this.card;
      this.orderDetail = data;
      this.deliveryStatus = "";
      this.msg = "";
      this.pickup_eta = "";
      this.dropoff_eta = "";
      this.deliveryShortStatus = "";
      this.deliveryStatusObject = {};
      this.dataLocal = {
        lat: null,
        lng: null
      };
      this.dataUser = {
        lat: null,
        lng: null
      };
    });
  },
  data() {
    return {
      card: false,
      tab: "one",
      orderDetail: {},
      deliveryStatus: "",
      pickup_eta: "",
      dropoff_eta: "",
      deliveryStatusObject: {},
      deliveryShortStatus: "",
      courier: null,
      flag: 1,
      msg: "",
      markers: [],
      apiKey: process.env.API_GOOGLE,
      baseUrl:
        "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apikeyGoogle}",
      tip: null,
      dataLocal: {
        lat: null,
        lng: null
      },
      dataUser: {
        lat: null,
        lng: null
      }
    };
  },
  methods: {
    getStatus() {
      this.deliveryStatus = "";
      if (this.orderDetail.delivery_id !== null) {
        var url = this.$store.getters["routes/getRoute"](
          "get.delivery.status",
          {
            delivery_id: this.orderDetail.delivery_id
            //delivery_id: "del_gALMXHSKQp2wlI1cVWl9Gw"
          }
        );
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.deliveryShortStatus = response.data.status;
            this.pickup_eta = this.formatDate(response.data.pickup_eta);
            this.dropoff_eta = this.formatDate(response.data.dropoff_eta);
            this.deliveryStatusObject = { ...response.data };
            this.courier =
              response.data.courier === null
                ? null
                : { ...response.data.courier };
            this.getMarkers();
            this.setDeliveryStatus(response.data.status);
          })
          .catch(error => {
            this.errorHandling(error);
          });
      }
    },
    setDeliveryStatus(status) {
      if (status === "pending") {
        this.deliveryStatus = "Estamos buscando un repartidor...";
      }
      if (status === "pickup") {
        this.deliveryStatus = `El repartidor llegará al local en ${this.getMinutesDiff(
          this.pickup_eta
        )}`;
      }
      if (status === "pickup_complete") {
        this.deliveryStatus = `El repartidor llegará al local en ${this.getMinutesDiff(
          this.pickup_eta
        )}`;
      }
      if (status === "dropoff") {
        this.deliveryStatus = `El pedido llegará a destino en ${this.getMinutesDiff(
          this.dropoff_eta
        )}`;
      }
      if (status === "delivered") {
        this.deliveryStatus = `El pedido fue recibido a las ${this.dropoff_eta
          .split(" ")[1]
          .slice(0, 5)} `;
      }
      if (status === "returned") {
        this.deliveryStatus = "El pedido llegará de vuelta al local";
      }
      if (status === "canceled") {
        this.deliveryStatus = "El pedido fue cancelado";
      }
    },
    goToTrackingUrl(url) {
      window.open(url);
    },
    formatDate(date_eta) {
      let date = new Date(date_eta);
      let time = "";
      let timestamp = "";

      time += date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      time +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes

      timestamp =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;
      return timestamp;
    },
    getMarkers() {
      this.markers = [];

      if (this.courier !== null) {
        let markerCourier = {
          lat: this.courier.location.lat,
          lng: this.courier.location.lng,
          icon: "moto-copy.png"
        };

        this.markers.push(markerCourier);

        let markerCustomer = {
          lat: this.dataUser.lat,
          lng: this.dataUser.lng,
          icon: "home-copy.png"
        };

        this.markers.push(markerCustomer);

        let markerLocal = {
          lat: this.dataLocal.lat,
          lng: this.dataLocal.lng,
          icon: "store-copy.png"
        };

        this.markers.push(markerLocal);
      }
    },
    createDelivery() {
      this.showLoading();
      var url2 = this.$store.getters["routes/getRoute"]("uber.create");
      let serverTime = this.getServerTime();
      let data2 = {
        orderId: this.orderDetail.id,
        local_name: this.orderDetail.local.name,
        local_address: this.orderDetail.local.address,
        pickup_ready_dt: this.getTime(5, serverTime),
        pickup_deadline_dt: this.getTime(20, serverTime)
      };
      this.$axios
        .post(url2, data2, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          console.log(response);
          this.bus.$emit("sync-orders");
          this.hideLoading();
          this.card = false;
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },
    getTime(value, serverTime) {
      let time = new Date(serverTime);
      if (value !== 0) {
        time = time.setMinutes(time.getMinutes() + value);
      }

      return new Date(time).toISOString();
    },
    updateDelivery(type) {
      this.showLoading();
      var url = this.$store.getters["routes/getRoute"]("uber.update", {
        orderId: this.orderDetail.id
      });

      if (type === "msg") {
        var data = {
          delivery_id: this.orderDetail.delivery_id,
          dropoff_notes: this.msg
        };
      } else {
        var data = {
          delivery_id: this.orderDetail.delivery_id,
          tip_by_customer: this.tip
        };
      }

      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.kind === "error") {
            if (response.data.code === "tip_already_recorded") {
              this.showNotification(
                "Ya agrego la propina anteriormente",
                "negative",
                "error"
              );
            }
          } else {
            this.bus.$emit("sync-orders");
            this.showNotification(
              type === "msg"
                ? "Mensaje enviado al delivery"
                : "Propina agregada",
              "positive",
              "check"
            );
          }

          this.hideLoading();
          this.card = false;
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },

    getLocations() {
      var addressLocal = `${this.orderDetail.local.address}, ${this.orderDetail.local.commune}`;
      var addressCustomer = `${this.orderDetail.payDetail.address}, ${this.orderDetail.payDetail.userCommune}`;

      var finalAddressLocal = addressLocal.trim().replace(/ /g, "+");
      var url = this.baseUrl.replace("{address}", finalAddressLocal);
      url = url.replace("{apikeyGoogle}", this.apiKey);

      var finalAddressCustomer = addressCustomer.trim().replace(/ /g, "+");
      var url2 = this.baseUrl.replace("{address}", finalAddressCustomer);
      url2 = url2.replace("{apikeyGoogle}", this.apiKey);

      this.$axios
        .get(url)
        .then(response => {
          let location = response.data.results[0].geometry.location;
          this.dataLocal.lat = location.lat;
          this.dataLocal.lng = location.lng;
          this.$axios
            .get(url2)
            .then(response => {
              let location = response.data.results[0].geometry.location;
              this.dataUser.lat = location.lat;
              this.dataUser.lng = location.lng;
            })
            .catch(error => {
              this.errorHandling(error);
            });
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },

    getMinutesDiff(time) {
      let santiagoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Santiago"
      });
      let serverTime = new Date(santiagoTime);
      let endTime = new Date(time);

      let diffMs = endTime.getTime() - serverTime.getTime();
      let diffMins = Math.round(Math.round(diffMs / 60000)); // minutes

      if (diffMins <= 1) {
        return `menos de 1 minuto`;
      } else {
        return `${diffMins} minutos`;
      }
    }
  }
};
</script>

<style lang="scss">
.tab-panel {
  height: auto !important;
  overflow: visible !important;
}
.tab-overview {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 20px;
}
.tab-overview-headers {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  text-align: left;
  p {
    margin-bottom: 5px;
  }
}
.tab-overview-items {
  width: 100%;
  display: flex;
  justify-content: right;
  flex-direction: column;
  text-align: left;
  p {
    word-wrap: break-word;
    hyphens: manual;
    width: 100%;
    margin-bottom: 10px;
  }
}
.tab-overview-subtotals {
  width: 30%;
  display: flex;
  justify-content: right;
  flex-direction: column;
  p {
    margin-bottom: 0;
  }
}

.tab-overview-footer {
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: right;
  align-items: right;
  flex-direction: column;
  p {
    text-align: right;
    margin-bottom: 0;
  }
}

.list-style {
  margin-left: 20px;
}

@media screen and (max-width: 600px) {
  .list-style {
    margin-left: 0px;
  }
}
</style>
