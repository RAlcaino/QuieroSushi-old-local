<template>
  <q-dialog v-model="card" persistent>
    <q-card
      style="border-radius:10px;width: 700px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="dashboard_customize"
          />
          Comprar Adicionales
        </div>
        <q-space />
        <q-btn
          icon="close"
          color="white"
          flat
          round
          dense
          @click="resetTotal()"
        />
      </q-card-section>
      <q-card-section
        class="row items-center justify-center"
        style="height:450px;"
        :style="sectionStyle"
      >
        <p
          style="width: 95%; font-weight:bold;auto;font-size:16px;text-align:center"
        >
          <q-icon
            style="margin-right:5px;padding-bottom:5px;"
            size="20px"
            name="store"
            color="blacklight"
          />{{ localName }}
        </p>
        <div
          v-if="section === 'just-one' || section === 'all'"
          style="width: 95%; border-radius:15px; border: 1px solid rgba(0,0,0,0.3);margin-bottom:20px;padding: 20px;"
        >
          <p
            style="width: 100%; font-weight:bold; height:5%;font-size:16px; margin-bottom:0"
          >
            <q-icon
              style="margin-right:5px;padding-bottom:5px;"
              size="20px"
              name="local_activity"
              color="amber-14"
            />Destacar tus cupones
          </p>
          <p style="width: 100%; height:5%;font-size:13.5px; color:grey">
            Haz que tus cupones se destaquen en nuestro portal y aumenten su visibilidad.
          </p>
          <div
            class="fit row wrap justify-around items-start content-start responsive-a"
            style="width: 100%; height:75%!important; padding-top:10px; padding-bottom:30px"
          >
            <div
              v-for="(item, index) of pricesStandOut"
              :key="index"
              style="width:25%;height:80%;"
              class="item-a"
            >
              <q-chip
                class="chip-a"
                color="amber-8"
                text-color="white"
                icon="star"
              >
                {{ item.qty }} Descatado
              </q-chip>
              <p class="price-a">${{ formatNumber(item.price) }}</p>
              <p class="cu-a">IVA incluido</p>
              <input
                v-model="qtyStandOut[index]"
                type="number"
                min="0"
                style="width:30%; margin: 0 auto; margin-top:5px;text-align:center; outline:none; border-bottom:0.5px solid #000;border-top:none;border-right:none;border-left:none;"
              />
            </div>
          </div>
          <p
            style="width: 100%; height:5%;font-size:13.5px; color:grey; text-align:center"
          >
            Cada destacado equivale a 1 dia completo en la sección superior de
            nuestra página principal y de la comuna donde esté tu local del
            cupón que escojas.
          </p>
        </div>
        <div
          v-if="section === 'just-two' || section === 'all'"
          style="width: 95%; border-radius:15px; border: 1px solid rgba(0,0,0,0.3);margin-bottom:20px; padding: 20px;"
        >
          <p
            style="width: 100%; font-weight:bold; height:5%; font-size:16px; margin-bottom:0"
          >
            <q-icon
              style="margin-right:5px; padding-bottom:5px;"
              size="20px"
              name="arrow_upward"
              color="primary"
            />Subir tus cupones
          </p>
          <p style="width: 100%; height:5%;font-size:13.5px; color:grey">
            Haz que tu cupón suba a la primera posición de la página principal y
            de la comuna donde está tu local.
          </p>
          <div
            class="fit row wrap justify-around items-start content-start responsive-a"
            style="width: 100%; height:75% !important;  padding-top:10px; padding-bottom:30px"
          >
            <div
              v-for="(item, index) of pricesGoUp"
              :key="index"
              style="width:25%;height:80%;"
              class="item-a"
            >
              <q-chip
                class="chip-a"
                color="red-8"
                text-color="white"
                icon="arrow_upward"
              >
                {{ item.qty }} Subir
              </q-chip>
              <p class="price-a">${{ formatNumber(item.price) }}</p>
              <p class="cu-a">${{ item.cu }} c/u</p>
              <input
                v-model="qtyGoUp[index]"
                type="number"
                min="0"
                style="width:30%; margin: 0 auto; margin-top:5px;text-align:center; outline:none; border-bottom:0.5px solid #000;border-top:none;border-right:none;border-left:none;"
              />
            </div>
          </div>
          <p
            style="width: 100%; height:5%;font-size:13.5px; color:grey; text-align:center"
          >
            Cada subir equivale tener la posibilidad de posicionar tu cupón de
            los primeros en QuieroSushi.cl
          </p>
        </div>
        <div
          class="fit row wrap items-start content-start"
          :class="responsiveMobile ? 'justify-center' : 'justify-end'"
          style="width: 80% !important; height:auto !important"
        >
          <p style="font-size:20px; margin-bottom:0">
            <strong>Total: ${{ formatNumber(getTotal) }}</strong>
          </p>
        </div>
        <q-card-actions align="center">
          <q-btn
            @click="buy()"
            size="sm"
            style="font-size:12px;padding: 0px 15px !important; margin-bottom:20px"
            rounded
            color="green"
            icon="add_shopping_cart"
            >Comprar</q-btn
          >
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["localName"],
  inject: [
    "formatNumber",
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling"
  ],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.getPrices();
    this.bus.$on("open-aditionals", data => {
      this.card = true;
      this.section = data;
    });
  },
  mounted() {
    this.responsiveMode();
  },
  data() {
    return {
      card: false,
      prod: null,
      section: "",
      responsiveMobile: false,
      pricesGoUp: [],
      pricesStandOut: [],
      result: {
        pricesGoUp: [
          {
            qty: 1,
            price: 1900,
            cu: 1900
          },
          {
            qty: 10,
            price: 17000,
            cu: 1700
          },
          {
            qty: 30,
            price: 30000,
            cu: 1500
          }
        ],
        pricesStandOut: [
          {
            qty: 1,
            price: 10000
          },
          {
            qty: 3,
            price: 25000
          },
          {
            qty: 6,
            price: 40000
          }
        ]
      },
      qtyGoUp: [0, 0, 0],
      qtyStandOut: [0, 0, 0],
      total: 0
    };
  },
  computed: {
    getTotal() {
      var vue = this;
      var final = 0;
      var numbers = [];
      var each = this.pricesGoUp.map(function(item, index) {
        let sum = item.price * vue.qtyGoUp[index];
        numbers.push(sum);
      });
      var each2 = this.pricesStandOut.map(function(item, index) {
        let sum = item.price * vue.qtyStandOut[index];
        numbers.push(sum);
      });
      for (var i = 0; i < numbers.length; i++) {
        final += numbers[i];
      }
      this.total = final;
      return this.total;
    },
    sectionStyle() {
      if (this.section === "all" || this.responsiveMobile) {
        return {
          overflowY: "scroll"
        };
      } else {
        return {
          overflowY: "hidden",
          height: "auto"
        };
      }
    }
  },
  methods: {
    resetTotal() {
      this.card = false;
      this.qtyGoUp = [0, 0, 0];
      this.qtyStandOut = [0, 0, 0];
    },
    buy() {
      var vue=this;
      var itemsToBuy=[];
      var each = this.pricesGoUp.map(function(item, index) {
        //if(vue.qtyGoUp[index]!==0){
          let service= {
            name: 'Paquete de '+item.qty + ' subir',
            price:item.price,
            qty: +vue.qtyGoUp[index]*item.qty
          }
          itemsToBuy.push(service);
        //}
      });
      var each = this.pricesStandOut.map(function(item, index) {
        //if(vue.qtyStandOut[index]!==0){
          let service= {
            name: 'Paquete de '+item.qty + ' destacados',
            price:item.price,
            qty:+vue.qtyStandOut[index]*item.qty
          }
          itemsToBuy.push(service);
        //}
      });
      this.$router.push({ name: "checkout", params:{
        data: itemsToBuy,
        total: vue.getTotal
      } });
      this.resetTotal();
    },
    responsiveMode() {
      var responsive = window.matchMedia("(max-width: 900px)");
      var vue = this;

      if (screen.width < 900) {
        vue.responsiveMobile = true;
      }

      responsive.addListener(function(event) {
        if (event.matches) {
          vue.responsiveMobile = true;
        } else {
          vue.responsiveMobile = false;
        }
      });
    },
    getPrices() {
      if (!this.prod) {
        setTimeout(() => {
          this.pricesGoUp = this.result.pricesGoUp;
          this.pricesStandOut = this.result.pricesStandOut;
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("services.prices");
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              var r = response.data.result;
              this.pricesGoUp = r.pricesGoUp;
              this.pricesStandOut = r.pricesStandOut;
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.errorHandling(error);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.item-a {
  display: flex;
  justify-content: center;
  flex-direction: column;
  p {
    width: 100%;
    text-align: center !important;
    margin-bottom: 0;
  }
  .chip-a {
    align-self: center;
    font-weight: bold;
  }
  .price-a {
    font-size: 24px;
    font-weight: bold;
  }
  .cu-a {
    font-size: 14px;
    font-weight: bold;
    color: gray;
  }
}
.padding-btn {
  padding-bottom: 20px !important;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
@media screen and (max-width: 500px) {
  .responsive-a {
    .item-a {
      width: 80% !important;
      margin-bottom: 15px;
    }
  }
}
</style>
