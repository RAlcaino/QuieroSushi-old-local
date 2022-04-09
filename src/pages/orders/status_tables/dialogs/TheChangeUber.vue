<template>
  <q-dialog
    v-model="card"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="width: 450px; border-radius:10px">
      <q-card-section class="column items-center">
        <span
          style="font-size:16px; margin-bottom: 15px; font-weight: 500;"
          class="q-ml-sm"
        >
          ¿A que hora quieres que llegue el Uber?
        </span>

        <q-input
          v-if="date !== null && deliveryStatus !== 'delivered'"
          filled
          v-model="date"
          readonly
          style="width: 90%"
          :hint="
            `La fecha y hora actual de llegada al local es el ${timePickupReady}`
          "
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <p
          style="font-size:15px; margin-bottom: 15px; text-align: center"
          class="q-ml-sm"
          v-if="deliveryStatus === 'delivered'"
        >
          El pedido ya fue entregado
        </p>

        <q-item-label v-if="date === null">
          <q-spinner-facebook color="primary" size="2em"
        /></q-item-label>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="DoChange()"
          size="sm"
          rounded
          label="Cambiar"
          color="green"
          :disabled="deliveryStatus === 'delivered'"
        />
        <q-btn
          size="sm"
          rounded
          label="cerrar"
          color="primary"
          @click="closeDialog()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getServerTime"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-change-uber", row => {
      this.date = null;
      this.timePickupReady = null;
      this.pickup_ready = null;
      this.option = { value: 10, label: "10 minutos" };
      this.orderDetail = { ...row };
      this.card = true;
      this.orderId = row.id;
      this.deliveryStatus = "delivered";
      this.getStatus();
    });
  },
  data() {
    return {
      card: false,
      orderId: null,
      prod: null,
      orderDetail: {},
      options: [
        { value: 10, label: "10 minutos" },
        { value: 20, label: "20 minutos" },
        { value: 30, label: "30 minutos" }
      ],
      option: { value: 10, label: "10 minutos" },
      pickup_ready: null,
      timePickupReady: null,
      date: null,
      deliveryStatus: "delivered"
    };
  },
  methods: {
    DoChange() {
      if (!this.validations()) {
        return;
      }

      let data = {
        delivery_id: this.orderDetail.delivery_id
      };
      let data2 = {
        orderId: this.orderId,
        local_name: this.orderDetail.local.name,
        local_address: this.orderDetail.local.address,
        pickup_ready_dt: this.getTime(0),
        pickup_deadline_dt: this.getTime(10)
      };
      var url = this.$store.getters["routes/getRoute"]("uber.cancel");

      this.showLoading();
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          console.log(response);
          var url2 = this.$store.getters["routes/getRoute"]("uber.create");
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
              this.closeDialog();
            })
            .catch(error => {
              this.hideLoading();
              this.errorHandling(error);
            });
          this.closeDialog();
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },
    closeDialog() {
      this.card = false;
    },
    getTime(val) {
      if (val !== 0) {
        let dateISO = new Date(this.date);
        dateISO = dateISO.setMinutes(dateISO.getMinutes() + val);

        return new Date(dateISO).toISOString();
      }

      let dateISO = new Date(this.date);
      return dateISO.toISOString();
    },
    getStatus() {
      this.deliveryStatus = "delivered";
      if (this.orderDetail.delivery_id !== null) {
        var url = this.$store.getters["routes/getRoute"](
          "get.delivery.status",
          {
            delivery_id: this.orderDetail.delivery_id
          }
        );
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.date = this.formatDate(response.data.pickup_ready);
            this.timePickupReady = this.formatDate(response.data.pickup_ready);
            this.pickup_ready = response.data.pickup_ready;
            this.deliveryStatus = response.data.status;
          })
          .catch(error => {
            this.errorHandling(error);
          });
      }
    },
    formatDate(dateISO) {
      let date = new Date(dateISO);
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
    validations() {
      let selectedTime = this.date;
      let santiagoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Santiago"
      });
      let unixDate = new Date(santiagoTime).valueOf();
      let unixSelectedDatetime = new Date(selectedTime).valueOf();
      let selectedDatetime = new Date(selectedTime);
      let finalPickupReady = new Date(this.pickup_ready);

      if (unixSelectedDatetime < unixDate) {
        this.showNotification(
          "Ha seleccionado una hora antes que la estimada actual",
          "negative",
          "error"
        );
        return false;
      }

      let diffMs = selectedDatetime.getTime() - finalPickupReady.getTime();
      let diffMins = Math.round(Math.round(diffMs / 60000)); // minutes

      if (diffMins < 5) {
        this.showNotification(
          "La diferencia es menor a 5 minutos",
          "negative",
          "error"
        );
        return false;
      }

      return true;
    },
    getFullDateTime(time) {
      let santiagoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Santiago"
      });
      let date = new Date(santiagoTime);

      let currentTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;

      return currentTime;
    }
  }
};
</script>

<style></style>
