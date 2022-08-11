<template>
  <q-dialog
    v-model="card"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="width: 450px; border-radius: 10px">
      <q-card-section class="column items-center">
        <span
          style="
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: 500;
            text-align: center;
          "
          class="q-ml-sm"
        >
          ¿En cuántos minutos quieres que llegue el repartidor al local?
        </span>

        <q-input
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
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          @click="confirm()"
          size="sm"
          rounded
          label="Confirmar"
          color="green"
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
    "getServerTime",
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-start", (row) => {
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
        { value: 30, label: "30 minutos" },
      ],
      option: { value: 10, label: "10 minutos" },
      pickup_ready: null,
      timePickupReady: null,
      date: null,
      deliveryStatus: "",
      deliveryStatusObject: {},
      newTime: 10,
    };
  },
  methods: {
    confirm() {
      this.showLoading();
      var urlConfirm =
        this.$store.getters["routes/getRoute"]("confirm.order.qd");
      let body = {
        orderID: this.orderId,
        pickup_ready_dt: +this.newTime,
        pickup_deadline_dt: +this.newTime + 15,
        delivery_type: "uber",
      };
      this.$axios
        .post(urlConfirm, body, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"],
          },
        })
        .then((response) => {
          this.hideLoading();
          this.bus.$emit("sync-orders");
          this.card = false;
        })
        .catch((error) => {
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
            delivery_id: this.orderDetail.delivery_id,
          }
        );
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"],
            },
          })
          .then((response) => {
            this.date = this.formatDate(response.data.pickup_ready);
            this.timePickupReady = this.formatDate(response.data.pickup_ready);
            this.pickup_ready = response.data.pickup_ready;
            this.deliveryStatus = response.data.status;
            this.deliveryStatusObject = { ...response.data };
          })
          .catch((error) => {
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
        timeZone: "America/Santiago",
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
        timeZone: "America/Santiago",
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
    },
  },
};
</script>

<style></style>
