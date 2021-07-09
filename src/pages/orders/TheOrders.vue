<template>
  <q-page class="q-pa-sm" style="background:white;">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px">
      <q-btn flat round dense icon="delivery_dining" />
      <q-toolbar-title :style="FontSize"> Pedidos</q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="sync"
        class="q-mr-xs"
        @click="sync(false)"
      />
    </q-toolbar>

    <div
      class="fit row wrap justify-between items-center content-center mobile-styles-o"
      style="margin: 20px 0"
    >
      <div class="input-style-o">
        <q-input dense rounded outlined label="Buscar" v-model="search" @focus="resetPage()" />
      </div>
      <div v-if="locals.length > 1">
        <q-select
          ref="select"
          rounded
          outlined
          dense
          :options="localsFilter"
          :options-dense="true"
          hide-hint
          v-model="localSelected"
          @input="change"
          @popup-hide="allLocals()"
          style="margin-right:46px;"
          :virtual-scroll-sticky-size-start="80"
          class="q-select-responsive"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
          <template v-slot:before-options>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item dense clickable @click="allOrders()">
              <q-item-section>Todos</q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey">
                Sin Resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
              :ordersNotConfirmed="getOrdersNotConfirmed"
              :refresh="refresh"
            ></not-confirmed>
          </q-tab-panel>

          <q-tab-panel name="confirmed" style="padding: 0; overflow:hidden">
            <the-confirmed
              :ordersConfirmed="getOrdersConfirmed"
            ></the-confirmed>
          </q-tab-panel>

          <q-tab-panel name="done" style="padding: 0; overflow:hidden">
            <the-done :ordersDone="getOrdersDone"></the-done>
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
      this.bus.$emit("scroll-up");
      this.tab = "not-confirmed";
      this.refresh = true;
      this.search="";
      this.allOrders();
      this.sync(false);
    });
  },
  mounted() {
    this.initLocals();
    this.localsFilter = this.locals;

    this.sync(false);
    this.responsiveMode();

    this.bus.$on("sync-orders", () => {
      this.sync(false);
    });
  },
  computed: {
    getOrdersConfirmed() {
      var vue=this;
      if (this.search !== "") {
        return this.ordersConfirmed.filter(function(item){
          if(vue.conditionsToFilter(item,vue.search)){
            return true;
          }
        });
      } else {
        return this.ordersConfirmedOriginal;
      }
    },
    getOrdersNotConfirmed() {
      var vue=this;
      if (this.search !== "") {
        return this.ordersNotConfirmed.filter(function(item){
          if(vue.conditionsToFilter(item,vue.search)){
            return true;
          }
        });
      } else {
        return this.ordersNotConfirmed;
      }
    },
    getOrdersDone() {
      var vue=this;
      if (this.search !== "") {
        return this.ordersDone.filter(function(item){
          if(vue.conditionsToFilter(item,vue.search)){
            return true;
          }
        });
      } else {
        return this.ordersDoneOriginal;
      }
    },
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
      refresh: false,
      localFilter: "",
      selectedLocal: "Seleccionar",
      locals: [],
      prod: null,
      responsiveLabels: false,
      responsiveMobile: false,
      ordersDone: [],
      ordersConfirmed: [],
      ordersNotConfirmed: [],
      ordersDoneOriginal: [],
      ordersConfirmedOriginal: [],
      ordersNotConfirmedOriginal: [],
      search: "",
      response: [
        {
          id: 63250,
          status: "not-confirmed",
          finalTimestamp: null,
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618985675,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
          unixTermino: 1618467275,
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
      data: [],
      originalData: [],
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus:null
      }
    };
  },
  methods: {
    sync(flag) {
      if (flag) {
        this.showLoading();
      } else {
        this.bus.$emit("start-loader");
      }
      if (!this.prod) {
        setTimeout(() => {
          this.data = this.response;
          this.originalData = this.data;
          this.filters();
          if (flag) {
            this.hideLoading();
          } else {
            this.bus.$emit("end-loader");
            this.refresh = false;
          }
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("orders", {
          userId: this.$store.getters["auth/getDataUser"].id
        });
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              if (flag) {
                this.hideLoading();
              } else {
                this.bus.$emit("end-loader");
                this.refresh = false;
              }
              this.data = response.data.result;
              this.originalData = this.data;
              this.filters();
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            if (flag) {
              this.hideLoading();
            } else {
              this.bus.$emit("end-loader");
              this.refresh = false;
            }
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
      var vue = this;
      var newArray = [];
      var roots = this.data.map(function(item) {
        item.name = item.payDetail.user;
        item.userPhone = item.payDetail.userPhone;
        item.userAddress = item.payDetail.address;
        newArray.push(item);
      });

      this.data = newArray;
      if (vue.local.value !== -1) {
        this.data = this.originalData.filter(
          item => item.local.id_local === vue.local.value
        );
      }
      this.ordersDone = this.data.filter(item => item.status === "done");
      this.ordersConfirmed = this.data.filter(
        item => item.status === "confirmed"
      );
      this.ordersNotConfirmed = this.data.filter(
        item => item.status === "not-confirmed"
      );

      this.ordersDoneOriginal = this.ordersDone;
      this.ordersConfirmedOriginal = this.ordersConfirmed;
      this.ordersNotConfirmedOriginal = this.ordersNotConfirmed;
    },
    filterFn(val) {
      if (val === "") {
        this.localsFilter = this.locals;
        return;
      }

      const needle = val.toLowerCase();
      this.localsFilter = this.locals.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    change(val) {
      var vue = this;
      if (val !== null) {
        this.local = val;
        this.data = this.originalData.filter(
          item => item.local.id_local === vue.local.value
        );
        this.filters();
        this.$store.commit("auth/setCurrentLocal", {
          id: val.value,
          name: val.name,
          image: val.image,
          commune: val.commune,
          cartStatus:val.cartStatus
        });
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    allOrders() {
      if(this.$refs.select!==undefined){
        this.$refs.select.hidePopup();
      }
      this.data = this.originalData;
      this.localSelected = {
        value: -1,
        label: "Todos",
        name: "Todos",
        image:
          this.$store.getters["auth/getDataUser"].id === -1
            ? "icons/favicon-128.png"
            : this.$store.getters["auth/getDataLocals"][0].image,
        commune: null,
        cartStatus:null
      };
      this.local = this.localSelected;
      this.filters();
      this.$store.commit("auth/setCurrentLocal", {
        id: this.localSelected.value,
        name: this.localSelected.name,
        image: this.localSelected.image,
        commune: this.localSelected.commune,
        cartStatus:this.localSelected.cartStatus
      });
    },
    conditionsToFilter(item,value){
          if(item.id.toString().toLowerCase().indexOf(value) > -1 ||
             item.payDetail.user.toString().toLowerCase().indexOf(value) > -1 ||
             item.payDetail.userPhone.toString().toLowerCase().indexOf(value) > -1 ||
             item.payDetail.pay.toString().toLowerCase().indexOf(value) > -1 ||
             item.payDetail.address.toString().toLowerCase().indexOf(value) > -1 ||
             item.local.name.toString().toLowerCase().indexOf(value) > -1 ||
             item.local.commune.toString().toLowerCase().indexOf(value) > -1 ){
            return true;
          }
    },
    resetPage(){
      this.bus.$emit("reset-page");
    },
    initLocals(){
      var vue = this;
      vue.locals=[];
      var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          cartStatus:item.cartStatus
        };
          vue.locals.push(row);
          vue.locals.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
        this.localSelected.value = this.$store.getters["auth/getDataLocal"].id;
        this.localSelected.image = this.$store.getters["auth/getDataLocal"].image;
        this.localSelected.commune = this.$store.getters[
          "auth/getDataLocal"
        ].commune;
        this.localSelected.name = this.$store.getters["auth/getDataLocal"].name;
        this.localSelected.cartStatus = this.$store.getters["auth/getDataLocal"].cartStatus;

        if (this.localSelected.value !== -1) {
          this.localSelected.label =
            this.localSelected.name + ", " + this.localSelected.commune;
        } else {
          this.localSelected.label = this.localSelected.name;
        }
        this.local.value = this.localSelected.value;
        this.local.label = this.localSelected.label;
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

.input-style-o {
  margin-left: 50px;
  margin-top: 5px;
}
@media screen and (max-width: 900px) {
  .dropdown-container {
    padding-top: 3%;
    display: flex;
    justify-content: center;
    width: 90%;
    margin: 0 auto;
    flex-direction: row;
  }
  .dropdown-locals {
    padding: 16px 0;
  }
  .q-select-responsive {
    margin-left: 60px;
    margin-top: 10px;
  }
}
@media screen and (max-width: 450px) {
  .input-style-o {
    margin-top: 0px !important;
    margin-left: 5px !important;
  }
  .mobile-styles-o {
    justify-content: center !important;
  }
}
</style>
