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
          ¿En cuántos minutos quieres que llegue el moto al local?
        </span>

        <q-input
          v-if="
            date !== null &&
              deliveryStatus !== 'delivered' &&
              deliveryStatus !== 'canceled'
          "
          v-model="newTime"
          color="primary"
          label="Minutos"
          style="width: 100px"
          type="number"
          :min="10"
        >
          <template v-slot:prepend>
            <q-icon name="query_builder" />
          </template>
        </q-input>

        <div v-if="Object.entries(deliveryStatusObject).length !== 0">
          <p
            style="font-size:15px; margin-bottom: 15px; text-align: center"
            class="q-ml-sm"
            v-if="deliveryStatus === 'delivered'"
          >
            El pedido ya fue entregado
          </p>

          <p
            style="font-size:15px; margin-bottom: 15px; text-align: center"
            class="q-ml-sm"
            v-if="deliveryStatus === 'canceled'"
          >
            El pedido ya fue cancelado
          </p>
        </div>

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
          :disabled="
            Object.entries(deliveryStatusObject).length === 0 ||
              deliveryStatus === 'delivered' ||
              deliveryStatus === 'canceled'
          "
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
      this.newTime = 10;
      this.timePickupReady = null;
      this.pickup_ready = null;
      this.option = { value: 10, label: "10 minutos" };
      this.orderDetail = { ...row };
      this.card = true;
      this.orderId = row.id;
      this.deliveryStatus = "";
      this.deliveryStatusObject = {};
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
      deliveryStatus: "",
      deliveryStatusObject: {},
      newTime: 10
    };
  },
  methods: {
    DoChange() {
      let data = {
        delivery_id: this.orderDetail.delivery_id
      };
      let data2 = {
        orderId: this.orderId,
        local_name: this.orderDetail.local.name,
        local_address: this.orderDetail.local.address,
        pickup_ready_dt: +this.newTime,
        pickup_deadline_dt: +this.newTime + 10
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
            this.deliveryStatusObject = { ...response.data };
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
