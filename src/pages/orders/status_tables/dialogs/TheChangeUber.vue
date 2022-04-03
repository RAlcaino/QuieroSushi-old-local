<template>
  <q-dialog
    v-model="card"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="width: 300px; border-radius:10px">
      <q-card-section class="column items-center">
        <span style="font-size:16px, margin-bottom: 10px" class="q-ml-sm">
          ¿En cuantos minutos?
        </span>

        <q-select filled v-model="option" :options="options" label="Minutos" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="DoChange()"
          size="sm"
          rounded
          label="Cambiar"
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
    "getServerTime"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-change-uber", row => {
      this.option = { value: 10, label: "10 minutos" };
      this.orderDetail = { ...row };
      this.card = true;
      this.orderId = row.id;
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
      option: { value: 10, label: "10 minutos" }
    };
  },
  methods: {
    DoChange() {
      let data = {
        delivery_id: this.orderDetail.delivery_id
      };
      let serverTime = this.getServerTime();
      let data2 = {
        orderId: this.orderId,
        local_name: this.orderDetail.local.name,
        local_address: this.orderDetail.local.address,
        pickup_ready_dt: this.getTime(this.option.value, serverTime),
        pickup_deadline_dt: this.getTime(this.option.value + 10, serverTime)
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
    getTime(value, serverTime) {
      let time = new Date(serverTime);
      time = time.setMinutes(time.getMinutes() + value);

      return new Date(time).toISOString();
    }
  }
};
</script>

<style></style>
