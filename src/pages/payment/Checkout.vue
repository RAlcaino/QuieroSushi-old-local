<template>
  <q-page class="q-pa-sm bg-white" style="´padding: 30px">
    <div
      v-if="data !== undefined"
      class="row q-col-gutter-sm"
      style="justify-content:center; align-item:center;"
    >
      <q-card
        class="rounded-borders"
        style=" border-radius:15px; padding: 10px; width: 500px; margin-top:80px;"
      >
        <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
          <div class="row">
            <div class="col-12">
              <q-item-label header style="text-align:center" class="text-h6"
                >Resumen</q-item-label
              >
              <q-item
                v-for="service of getData"
                :key="service.name"
                class="full-width"
              >
                <q-item-section>
                  <q-item-label lines="1">{{ service.name }}</q-item-label>
                  <q-item-label caption
                    >Cantidad: {{ service.qty }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  $ {{ formatNumber(service.price) }}
                </q-item-section>
                <q-separator></q-separator>
              </q-item>

              <q-item class="full-width" style="border-top: 3px dotted #ff2d2d">
                <q-item-section>
                  <q-item-label lines="1">Total</q-item-label>
                </q-item-section>
                <q-item-section side>
                  $ {{ formatNumber(total) }}
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
        <q-card-actions align="center">
          <q-btn
            @click="pay()"
            size="sm"
            style="font-size:12px;padding: 0px 15px !important; margin-bottom:20px"
            rounded
            color="green"
          >
            Pagar</q-btn
          >
        </q-card-actions>
      </q-card>
      <!--<q-card class="rounded-borders">
              <q-card-section horizontal>
                <q-card-section class="col-5 q-pt-xs">
                  <div class="text-h6 text-center">Shipping</div>
                  <div class="text-subtitle1 ">Pratik Patel</div>
                  <div class="text-subtitle2">
                    4841 Johnston Locks
                  </div>
                </q-card-section>
                <q-card-section class="col-7 q-pt-xs">
                  <div class="text-h6 text-center">Payment details</div>
                  <div class="text-subtitle1 q-mb-xs">Card type  - Visa</div>
                  <div class="text-subtitle1 q-mb-xs">Card holder  - P***ik Patel</div>
                  <div class="text-subtitle1 q-mb-xs">Card Number  - xxxx-xxxx-xxxx-1234</div>
                  <div class="text-subtitle1 q-mb-xs">Expiry date - 04/2012</div>
                </q-card-section>


              </q-card-section>
            </q-card>-->
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Checkout",
  props: ["data", "total"],
  inject: [
    "showNotification",
    "formatNumber",
    "showLoading",
    "hideLoading",
    "errorHandling"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    var vue = this;
    if (this.data === undefined) {
      vue.$router.push({ path: "/cupones" });
    }
    console.log(this.data);
    console.log(this.total);
  },
  data() {
    return {
      step: 1,
      address_detail: {},
      card_detail: {},
      prod: null
    };
  },
  computed: {
    getData() {
      return this.data.filter(item => item.qty != 0);
    }
  },
  methods: {
    pay() {
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          window.open("https://www.google.com");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("get.url.pay");
        this.$axios
          .post(
            url,
            {
              idLocal: this.$store.getters["auth/getDataLocal"].id,
              amount: this.total,
              commerceOrder: Math.round(
                Math.random() * (99999999999999 - 1) + 1
              ),
              detail: this.data
            },
            {
              headers: {
                Authorization: this.$store.getters["auth/getToken"]
              }
            }
          )
          .then(response => {
            this.hideLoading();
            if (response.data.status === "success") {
              window.location.href = response.data.result;
            } else {
              this.showNotification(
                "Error al procesar el pago. Contacte al administrador del sistema.",
                "negative",
                "error"
              );
            }
          })
          .catch(error => {
            this.hideLoading();
            this.showNotification(
              "Error al procesar el pago. Contacte al administrador del sistema.",
              "negative",
              "error"
            );
          });
      }
    }
  }
};
</script>

<style scoped></style>
