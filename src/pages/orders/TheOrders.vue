<template>
  <q-page class="q-pa-sm" style="background:white">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px">
      <q-btn flat round dense icon="delivery_dining" />
      <q-toolbar-title> Pedidos de {{ local.name }} </q-toolbar-title>
      <q-btn flat round dense icon="sync" class="q-mr-xs" @click="sync()"/>
      <q-btn flat round dense icon="info" class="q-mr-xs" />
    </q-toolbar>
    <div class="orders-tab">
      <q-splitter
        v-model="splitterModel"
        style="height: 250px, margin-top: 100px; width: 100%;"
      >
        <template v-slot:before>
          <q-tabs v-model="tab" vertical>
            <q-tab
              class="text-primary"
              name="not-confirmed"
              icon="watch_later"
              label="Sin Confirmar"
            />
            <q-tab
              class="text-blue"
              name="confirmed"
              icon="room_service"
              label="Confirmados"
            />
            <q-tab
              class="text-green"
              name="done"
              icon="check_circle"
              label="Listos"
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
    this.local = this.$store.getters["auth/getDataLocal"];
    this.sync();
    /*console.log(this.ordersNotConfirmed);
    console.log(this.ordersConfirmed);
    console.log(this.ordersDone);*/
  },
  data() {
    return {
      tab: "not-confirmed",
      splitterModel: 20,
      local: {
        id: null,
        name: ""
      },
      ordersDone: [],
      ordersConfirmed: [],
      ordersNotConfirmed: [],
      data: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65
        }
      ],
      result: [
        {
          id: 105,
          status: "done",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "done",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "done",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "not-confimed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "not-confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "not-confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "done",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        },
        {
          id: 105,
          status: "not-confirmed",
          idLocal: 3,
          requestedTime: "2021-02-04 18:51:21",
          orderType: "despacho",
          subtotal: 13000,
          deliveryCost: 2000,
          total: 15000,
          product: [
            {
              quantity: 1,
              detail: {
                name: "Coca-Cola",
                price: 3000
              }
            },
            {
              quantity: 4,
              detail: {
                name: "Gyosas",
                price: 2500
              }
            }
          ],
          payDetail: {
            user: "Juan Perez",
            userPhone: "3432423423",
            pay: "credito",
            address: "Calle 1 Apto 10 Edificio Pina"
          }
        }
      ]
    };
  },
  methods: {
    sync() {
      setTimeout(() => {
        this.ordersDone = this.result.filter(item => item.status === "done");
        this.ordersConfirmed = this.result.filter(
          item => item.status === "confirmed"
        );
        this.ordersNotConfirmed = this.result.filter(
          item => item.status === "not-confirmed"
        );
      }, 5000);
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
