<template>
  <q-page class="q-pa-sm" style="background:white">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px">
      <q-btn flat round dense icon="delivery_dining" />
      <q-toolbar-title :style="FontSize">
        Pedidos de {{ local.name }}</q-toolbar-title
      >
      <q-btn flat round dense icon="sync" class="q-mr-xs" @click="sync()" />
      <q-btn flat round dense icon="info" class="q-mr-xs" />
    </q-toolbar>
    <div class="orders-tab">
      <q-splitter
        v-model="splitterModel"
        style="height: 250px, margin-top: 100px; width: 100%;"
        v-if="!responsiveMobile"
      >
        <template v-slot:before>
          <q-tabs v-model="tab" vertical>
            <q-tab
              class="text-primary"
              name="not-confirmed"
              icon="watch_later"
              :label="responsiveLabels ? '' : 'Sin Confirmar'"
            />
            <q-tab
              class="text-blue"
              name="confirmed"
              icon="room_service"
              :label="responsiveLabels ? '' : 'Confirmados'"
            />
            <q-tab
              class="text-green"
              name="done"
              icon="check_circle"
              :label="responsiveLabels ? '' : 'Listos'"
            />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="not-confirmed">
              <not-confirmed
                :ordersNotConfirmed="ordersNotConfirmed"
              ></not-confirmed>
            </q-tab-panel>

            <q-tab-panel name="confirmed">
              <the-confirmed :ordersConfirmed="ordersConfirmed"></the-confirmed>
            </q-tab-panel>

            <q-tab-panel name="done">
              <the-done :ordersDone="ordersDone"></the-done>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>

      <q-card v-if="responsiveMobile" style="width: 90%;height: 0;">
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="justify"
          narrow-indicator
        >
          <q-tab
            class="text-primary"
            name="not-confirmed"
            icon="watch_later"
            :label="responsiveLabels ? '' : 'Sin Confirmar'"
          />
          <q-tab
            class="text-blue"
            name="confirmed"
            icon="room_service"
            :label="responsiveLabels ? '' : 'Confirmados'"
          />
          <q-tab
            class="text-green"
            name="done"
            icon="check_circle"
            :label="responsiveLabels ? '' : 'Listos'"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="not-confirmed" style="padding: 0">
            <not-confirmed
              :ordersNotConfirmed="ordersNotConfirmed"
            ></not-confirmed>
          </q-tab-panel>

          <q-tab-panel name="confirmed" style="padding: 0">
            <the-confirmed :ordersConfirmed="ordersConfirmed"></the-confirmed>
          </q-tab-panel>

          <q-tab-panel name="done" style="padding: 0">
            <the-done :ordersDone="ordersDone"></the-done>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import NotConfirmed from "./status_tables/NotConfirmed.vue";
import TheConfirmed from "./status_tables/TheConfirmed.vue";
import TheDone from "./status_tables/TheDone.vue";

export default {
  components: {
    NotConfirmed,
    TheConfirmed,
    TheDone
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },

  mounted() {
    this.local = this.$store.getters["auth/getDataLocal"];
    this.sync();
    this.responsiveMode();

    this.bus.$on("sync-orders", () => {
      this.sync();
    });
    /*console.log(this.ordersNotConfirmed);
    console.log(this.ordersConfirmed);
    console.log(this.ordersDone);*/
  },
  computed: {
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    }
  },
  data() {
    return {
      tab: "not-confirmed",
      splitterModel: 20,
      local: {
        id: null,
        name: ""
      },
      prod: null,
      responsiveLabels: false,
      responsiveMobile: false,
      ordersDone: [],
      ordersConfirmed: [],
      ordersNotConfirmed: [],
      response: [
        {
          id: 63250,
          status: "not-confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-09 17:00:00",
          confirmationTimestamp: null,
          orderType: "retiro",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "QS",
            userPhone: "992232948",
            pay: "Sodexo",
            address: ""
          }
        },
        {
          id: 63371,
          status: "not-confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 20,
            aditionalDeliveryTime: 10
          },
          requestedTime: "2020-12-10 15:53:00",
          confirmationTimestamp: null,
          orderType: "despacho",
          subtotal: 28000,
          deliveryCost: 1000,
          total: 29000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            }
          ],
          payDetail: {
            user: "MariaJose",
            userPhone: "992232948",
            pay: "Debito",
            address: "cruzada moon 632"
          }
        },
        {
          id: 65131,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-18 21:02:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            }
          ],
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Maximiliano Ib\u00e1\u00f1ez 1331 "
          }
        },
        {
          id: 65132,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-18 21:02:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            }
          ],
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Maximiliano Ib\u00e1\u00f1ez 1331 "
          }
        },
        {
          id: 65133,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-18 21:04:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            }
          ],
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Maximiliano Ib\u00e1\u00f1ez 1331 "
          }
        },
        {
          id: 65505,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-19 23:42:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 14000,
          deliveryCost: 3000,
          total: 17000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "Ayleen romero ",
            userPhone: "992232948",
            pay: "Debito",
            address: "Romero 2385"
          }
        },
        {
          id: 65707,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-21 00:01:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 15000,
          deliveryCost: 3000,
          total: 18000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            }
          ],
          payDetail: {
            user: "Mario sandoval ",
            userPhone: "992232948",
            pay: "Debito",
            address: "Almirante la torre 37"
          }
        },
        {
          id: 65853,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2020-12-21 21:18:00",
          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 14000,
          deliveryCost: 1000,
          total: 15000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "Cristina Ocared",
            userPhone: "992232948",
            pay: "Debito",
            address: "Antonio Ebner 1413"
          }
        },
        {
          id: 69420,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2021-01-08 20:50:00",

          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 14000,
          deliveryCost: 2000,
          total: 16000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "Isabel Lagos",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Gonzalo Bulnes 2514"
          }
        },
        {
          id: 69553,
          status: "confirmed",
          finalTimestamp: null,
          finalDate: null,
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2021-01-09 16:12:00",

          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 14000,
          deliveryCost: 2000,
          total: 16000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "Sara Toledo",
            userPhone: "992232948",
            pay: "Debito",
            address: "Meza Bell 2851"
          }
        },
        {
          id: 69949,
          status: "done",
          finalTimestamp: "2021-01-14 18:48:00",
          finalDate: "2021-01-14",
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2021-01-10 22:00:00",

          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 15000,
          deliveryCost: 2000,
          total: 17000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            }
          ],
          payDetail: {
            user: "Nicolas aravena",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Patricio lynch 1650"
          }
        },
        {
          id: 70470,
          status: "done",
          finalTimestamp: "2021-01-14 18:48:00",
          finalDate: "2021-01-14",
          local: {
            id_local: 1912,
            preparationTime: 30,
            aditionalDeliveryTime: 5
          },
          requestedTime: "2021-01-14 17:48:00",

          confirmationTimestamp: "2021-12-20 21:02:00",
          orderType: "despacho",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name:
                  "\u00bfTe lo vas a perder? $p ricas de sushi en con un sabor \u00fanico",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name:
                  "\u00a1Imperdible! \u00a1No te quedes sin estas ricas $p piezas de selecci\u00f3n!",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name:
                  "\u00a1Mix de $p piezas! variedad de sabores y un exclusivo sabor",
                price: 14000
              }
            }
          ],
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Heriberto rojas 5935"
          }
        }
      ],
      data: []
    };
  },
  methods: {
    sync() {
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.data = this.response;
          this.filters();
          this.hideLoading();
          this.showNotification(
            "Pedidos Obtenidos",
            "positive",
            "check_circle"
          );
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("orders", {
          localId: this.local.id
        });
        this.$axios
          .get(url)
          .then(response => {
            console.log(response.data);
            this.hideLoading();
            if (response.data.status === "success") {
              this.data = response.data.result;
              this.filters();
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
              }
            } else {
              this.showNotification(error.message, "negative", "error");
            }
          });
      }
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
    responsiveMode() {
      var responsive = window.matchMedia("(max-width: 900px)");
      var vue = this;

      if (screen.width < 900) {
        vue.responsiveLabels = true;
        vue.responsiveMobile = true;
      }

      responsive.addListener(function(event) {
        if (event.matches) {
          vue.responsiveLabels = true;
          vue.responsiveMobile = true;
        } else {
          vue.responsiveLabels = false;
          vue.responsiveMobile = false;
        }
      });
    },
    filters() {
      console.log(this.data);
      this.ordersDone = this.data.filter(item => item.status === "done");
      this.ordersConfirmed = this.data.filter(
        item => item.status === "confirmed"
      );
      this.ordersNotConfirmed = this.data.filter(
        item => item.status === "not-confirmed"
      );
    },

    showLoading() {
      this.$q.loading.show({
        message: "Espere un momento, por favor..."
      });
    },
    hideLoading() {
      this.$q.loading.hide();
    }
  }
};
</script>

<style lang="scss">
.orders-tab {
  height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
</style>
