<template>
  <q-page class="q-pa-sm" style="background:white;">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px">
      <q-btn flat round dense icon="delivery_dining" />
      <q-toolbar-title :style="FontSize">
        Pedidos de {{ local.label }}</q-toolbar-title
      >
      <q-btn flat round dense icon="sync" class="q-mr-xs" @click="sync()" />
    </q-toolbar>

    <div class="dropdown-container" v-if="locals.length > 1">
      <div class="dropdown-locals">
        <q-btn-dropdown
          color="blacklight"
          rounded
          outline
          label="Sucursales"
          icon="store"
        >
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <input
                    v-model="localFilter"
                    type="text"
                    placeholder="Buscar"
                    style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-for="item in getLocals"
              :key="item.value"
              clickable
              v-close-popup
              @click="findOrders(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div class="orders-tab" style="margin-top:20px">
      <q-card style="width: 90%;height: 0;">
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="justify"
          narrow-indicator
          style="border-radius:10px"
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
          <q-tab-panel name="not-confirmed" style="padding: 0; overflow:hidden">
            <not-confirmed
              :ordersNotConfirmed="ordersNotConfirmed"
            ></not-confirmed>
          </q-tab-panel>

          <q-tab-panel name="confirmed" style="padding: 0; overflow:hidden">
            <the-confirmed :ordersConfirmed="ordersConfirmed"></the-confirmed>
          </q-tab-panel>

          <q-tab-panel name="done" style="padding: 0; overflow:hidden">
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
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  components: {
    NotConfirmed,
    TheConfirmed,
    TheDone
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("to-one-tab", () => {
      this.tab = "not-confirmed";
    });
  },
  mounted() {
    var vue = this;
    var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
      let row = {
        value: item.id,
        label: item.name
      };
      vue.locals.push(row);
    });

    this.local.value = this.$store.getters["auth/getDataLocal"].id;
    this.local.label = this.$store.getters["auth/getDataLocal"].name;
    this.sync();
    this.responsiveMode();

    this.bus.$on("sync-orders", () => {
      this.sync();
    });
  },
  computed: {
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    },
    getLocals() {
      let filteredLocals = this.locals.filter(item => {
        return item.label
          .toLowerCase()
          .includes(this.localFilter.toLowerCase());
      });
      let orderedLocals = filteredLocals.sort((a, b) => {
        return b.label - a.label;
      });
      return orderedLocals;
    }
  },
  data() {
    return {
      tab: "not-confirmed",
      splitterModel: 20,
      local: {
        value: null,
        label: ""
      },
      localFilter: "",
      selectedLocal: "Seleccionar",
      locals: [],
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63251,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63252,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63253,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63254,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63255,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63256,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63257,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 63258,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 0,
          total: 14000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Juan Perez",
            userPhone: "992232948",
            pay: "Sodexo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 28000,
          deliveryCost: 1000,
          total: 29000,

          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "Coca-Cola",
                price: 28000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "MariaJose",
            userPhone: "992232948",
            pay: "Debito",
            address: "Una direccion inventada AV"
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
          orderType: "retiro",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "50 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "Agua",
                price: 28000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "20 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "Fanta",
                price: 28000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 0,
          deliveryCost: 1000,
          total: 1000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "50 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "Pepsi",
                price: 28000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Alexi Anthoni zamora silva ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 3000,
          total: 17000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "Agua",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "500 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "Coca-Cola",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Ayleen romero ",
            userPhone: "992232948",
            pay: "Debito",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 15000,
          deliveryCost: 3000,
          total: 18000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "200 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "Coca-Cola",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "Agua",
                price: 15000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Mario sandoval ",
            userPhone: "992232948",
            pay: "Debito",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1000,
          total: 15000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "200 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "Agua",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "Coca-Cola",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Cristina Ocared",
            userPhone: "992232948",
            pay: "Debito",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 2000,
          total: 16000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Isabel Lagos",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 2000,
          total: 16000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Sara Toledo",
            userPhone: "992232948",
            pay: "Debito",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 15000,
          deliveryCost: 2000,
          total: 17000,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Nicolas aravena",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70471,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70472,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70473,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70474,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70475,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70476,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70477,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
          }
        },
        {
          id: 70478,
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
          orderType: "delivery",
          subtotal: 14000,
          deliveryCost: 1500,
          total: 15500,
          gmapsDeliveryTime: 10,
          product: [
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11801,
                name: "100 roles de sushi",
                price: 28000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11800,
                name: "100 roles de sushi",
                price: 15000
              }
            },
            {
              quantity: 1,
              detail: {
                id: 11799,
                name: "100 roles de sushi",
                price: 14000
              }
            }
          ],
          extras: {
            chopsticks: 1,
            ginger: 2,
            wasabi: 3
          },
          payDetail: {
            user: "Pablo Urz\u00faa Cid ",
            userPhone: "992232948",
            pay: "Efectivo",
            address: "Una direccion inventada AV"
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
            "Pedidos Actualizados",
            "positive",
            "check_circle"
          );
          this.bus.$emit("change-flag");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("orders", {
          localId: this.local.value
        });
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.hideLoading();
            if (response.data.status === "success") {
              this.data = response.data.result;
              this.filters();
              this.showNotification(
                "Pedidos Actualizados",
                "positive",
                "check_circle"
              );
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
            this.bus.$emit("change-flag");
          })
          .catch(error => {
            this.hideLoading();
            this.bus.$emit("change-flag");
            this.errorHandling(error);
          });
      }
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
      var newArray = [];
      var roots = this.data.map(function(item) {
        item.name = item.payDetail.user;
        item.userPhone = item.payDetail.userPhone;
        item.userAddress = item.payDetail.address;
        newArray.push(item);
      });

      this.data = newArray;
      this.ordersDone = this.data.filter(item => item.status === "done");
      this.ordersConfirmed = this.data.filter(
        item => item.status === "confirmed"
      );
      this.ordersNotConfirmed = this.data.filter(
        item => item.status === "not-confirmed"
      );
    },
    findOrders(local) {
      this.local.value = local.value;
      this.local.label = local.label;
      this.localFilter = "";
      this.sync();
    }
  }
};
</script>

<style lang="scss">
.orders-tab {
  height: 100vh;
  display: flex;
  justify-content: center;
}
.q-tab-panel {
  padding: 10px 16px;
}

.padding-table {
  padding-top: 3%;
}

.dropdown-container {
  padding-top: 3%;
  display: flex;
  width: auto;
  margin: 0 auto;
  flex-direction: row-reverse;
}
.dropdown-locals {
  padding: 0px 46px 0px 16px;
}
@media screen and (max-width: 900px) {
  .dropdown-container {
    padding-top: 3%;
    display: flex;
    width: 90%;
    margin: 0 auto;
    flex-direction: row-reverse;
  }
  .dropdown-locals {
    padding: 16px 0;
  }
}
</style>
