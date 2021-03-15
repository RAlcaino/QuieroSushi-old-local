<template>
  <q-page class="q-pa-sm" style="background:white">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px">
      <q-btn flat round dense icon="delivery_dining" />
      <q-toolbar-title>
        Pedidos
      </q-toolbar-title>
      <q-btn flat round dense icon="info" class="q-mr-xs" />
      <q-btn flat round dense icon="help" />
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
                <not-confirmed :data="data"></not-confirmed>
            </q-tab-panel>

            <q-tab-panel name="confirmed"> 
                <the-confirmed :data="data"></the-confirmed>
            </q-tab-panel>

            <q-tab-panel name="done">
                <the-done :data="data"></the-done>
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
  data() {
    return {
      tab: "not-confirmed",
      splitterModel: 20,
      
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
      ]
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
