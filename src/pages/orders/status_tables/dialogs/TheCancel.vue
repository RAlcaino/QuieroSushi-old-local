<template>
  <q-dialog v-model="card" persistent>
    <q-card style="width: 300px; border-radius:10px">
      <q-card-section class="column items-center">
        <span style="font-size:16px" class="q-ml-sm">
          Indique los motivos:
        </span>

        <q-input
          v-model="cancellationReason"
          filled
          type="textarea"
          style="width:90%; padding-top: 5px;font-size:16px"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn @click="DoCancel()" flat label="Anular" color="green" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("the-cancel", row => {
      this.card = true;
      this.orderId = row.id;
    });
  },
  data() {
    return {
      card: false,
      orderId: null,
      prod: null,
      cancellationReason: ""
    };
  },
  methods: {
    DoCancel() {
      let data = {
        orderID: this.orderId,
        canceledTimestamp: this.currentTimestamp(),
        cancellationReason: this.cancellationReason
      };

      console.log(data); //
      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.showNotification(
            "Pedido #" + this.orderId + " Cancelado",
            "positive",
            "check_circle"
          );
          this.bus.$emit("sync-orders");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("order.cancel");
        //console.log(url);
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            console.log(response.data);

            if (response.data.status === "success") {
              this.bus.$emit("sync-orders");
              this.showNotification(
                response.data.message,
                "positive",
                "check_circle"
              );
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
              } else if (error.response.status == 401) {
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
      this.card = false;
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
    },
    currentTimestamp() {
      let currentTime = "";
      let date = new Date(Date.now());
      currentTime +=
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      currentTime +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes
      currentTime +=
        date.getSeconds() < 10
          ? ":0" + date.getSeconds()
          : ":" + date.getSeconds(); //get seconds

      let currentTimestamp =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        currentTime;
      return currentTimestamp;
    }
  }
};
</script>

<style></style>
