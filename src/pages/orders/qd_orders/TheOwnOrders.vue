<template>
  <base-page
    title="Pedidos Propios"
    icon="inventory_2"
    :sync="sync"
    :toolbar="true"
  >
    <new-order></new-order>
    <div
      class="
        row
        wrap
        justify-between
        items-center
        content-center
        mobile-styles-o
      "
      style="margin: 20px auto; width: 90%"
    >
      <div class="input-style-o">
        <q-input
          dense
          rounded
          outlined
          label="Buscar"
          v-model="search"
          @focus="resetPage()"
          style="margin-bottom: 5px"
        />
      </div>
      <div style="display: flex">
        <div>
          <q-btn
            color="green"
            rounded
            size="sm"
            style="position: relative; bottom: 0px; margin-right: 10px"
            @click="createOrder()"
          >
            <q-icon style="margin-right: 5px" size="20px" name="add" />
            <div style="font-size: 12px">Crear</div>
          </q-btn>
        </div>
        <q-select
          ref="select"
          rounded
          outlined
          dense
          :options="localsFilter"
          :options-dense="true"
          hide-hint
          label="Locales"
          v-model="localSelected"
          @input="change"
          @popup-hide="allLocals()"
          :virtual-scroll-sticky-size-start="80"
          style="position: relative; bottom: 5px"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
          <template v-slot:before-options v-if="locals.length > 1">
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="
                    padding: 7px;
                    margin-top: 10px;
                    border-radius: 20px;
                    border: 1px solid #333;
                    outline: none;
                  "
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
                  style="
                    padding: 7px;
                    margin-top: 10px;
                    border-radius: 20px;
                    border: 1px solid #333;
                    outline: none;
                  "
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
    <div class="orders-tab" style="margin-top: 20px">
      <div style="width: 90%; height: 100%">
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="justify"
          narrow-indicator
          style="border-radius: 10px"
        >
          <q-tab
            class="text-primary"
            name="waiting"
            icon="payments"
            :label="responsiveLabels ? '' : 'Pendiente de pago'"
          />
          <q-tab
            class="text-blue-grey"
            name="started"
            icon="archive"
            :label="responsiveLabels ? '' : 'Ingresados'"
          />
          <q-tab
            class="text-orange-14"
            name="preparation"
            icon="watch_later"
            :label="responsiveLabels ? '' : 'En producción'"
          />
          <q-tab
            class="text-blue"
            name="delivery"
            icon="room_service"
            :label="responsiveLabels ? '' : 'En camino'"
          />
          <q-tab
            class="text-green"
            name="ready"
            icon="check_circle"
            :label="responsiveLabels ? '' : 'Finalizados'"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="waiting" style="padding: 0; overflow: hidden">
            <waiting
              :ordersWaiting="getOrdersWaiting"
              :refresh="refresh"
              :sendWs="sendWs"
            ></waiting>
          </q-tab-panel>

          <q-tab-panel name="started" style="padding: 0; overflow: hidden">
            <started
              :ordersStarted="getOrdersStarted"
              :refresh="refresh"
              :sendWs="sendWs"
            ></started>
          </q-tab-panel>

          <q-tab-panel name="preparation" style="padding: 0; overflow: hidden">
            <preparation
              :ordersPreparation="getOrdersPreparation"
              :refresh="refresh"
              :sendWs="sendWs"
            ></preparation>
          </q-tab-panel>

          <q-tab-panel name="delivery" style="padding: 0; overflow: hidden">
            <delivery
              :ordersDelivery="getOrdersDelivery"
              :sendWs="sendWs"
            ></delivery>
          </q-tab-panel>

          <q-tab-panel name="ready" style="padding: 0; overflow: hidden">
            <ready :ordersReady="getOrdersReady" :sendWs="sendWs"></ready>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </base-page>
</template>

<script>
import Preparation from "./status_tables/Preparation.vue";
import Delivery from "./status_tables/Delivery.vue";
import Ready from "./status_tables/Ready.vue";
import Waiting from "./status_tables/Waiting.vue";
import Started from "./status_tables/Started.vue";
import BasePage from "src/components/bases/BasePage.vue";
import NewOrder from "../qd_orders/status_tables/dialogs/NewOrder.vue";

export default {
  props: ["toAll"],
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreQDLocals"
  ],
  components: {
    Preparation,
    Delivery,
    Ready,
    BasePage,
    NewOrder,
    Waiting,
    Started
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    if (this.toAll) {
      this.allOrders();
    }
    this.bus.$on("to-one-tab", () => {
      this.bus.$emit("scroll-up");
      this.tab = "pending";
      this.refresh = true;
      this.search = "";
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
    getOrdersStarted() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersStarted.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersStartedOriginal;
      }
    },
    getOrdersWaiting() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersWaiting.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersWaitingOriginal;
      }
    },
    getOrdersReady() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersReady.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersReadyOriginal;
      }
    },
    getOrdersPreparation() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersPreparation.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersPreparationOriginal;
      }
    },
    getOrdersDelivery() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersDelivery.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersDeliveryOriginal;
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
      tab: "waiting",
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
      ordersReady: [],
      ordersWaiting: [],
      ordersDelivery: [],
      ordersPreparation: [],
      ordersStarted: [],
      ordersReadyOriginal: [],
      ordersDeliveryOriginal: [],
      ordersWaitingOriginal: [],
      ordersStartedOriginal: [],
      ordersPreparationOriginal: [],
      orders: [],
      search: "",
      data: [],
      originalData: [],
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      }
    };
  },
  methods: {
    sync(flag) {
      console.log(flag);
      if (flag) {
        this.showLoading();
      } else {
        this.bus.$emit("start-loader");
      }

      var url = this.$store.getters["routes/getRoute"]("get.order.qd", {
        userId: this.$store.getters["auth/getDataUser"].id,
        filter: "Todos"
      });

      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (flag) {
            this.hideLoading();
          } else {
            this.bus.$emit("end-loader");
            this.refresh = false;
          }
          this.data = response.data.result;
          this.originalData = this.data;
          this.filters();
        })
        .catch(error => {
          console.log(error);
          this.hideLoading();
          this.errorHandling(error);
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
      var vue = this;
      var newArray = [];
      var roots = this.data.map(function(item) {
        item.name = item.userDetail.user;
        item.userPhone = item.userDetail.userPhone;
        item.userAddress = item.userDetail.address;
        newArray.push(item);
      });

      this.data = newArray;
      if (vue.local.value !== -1) {
        this.data = this.originalData.filter(
          item => item.local.id_local === vue.local.value
        );
      }
      this.ordersDelivery = this.data.filter(
        item => item.status === "delivery"
      );
      this.ordersPreparation = this.data.filter(
        item => item.status === "preparation"
      );
      this.ordersReady = this.data.filter(item => item.status === "ready");
      this.ordersWaiting = this.data.filter(
        item => item.status === "waiting_payment"
      );
      this.ordersStarted = this.data.filter(item => item.status === "started");

      this.ordersReadyOriginal = this.ordersReady;
      this.ordersDeliveryOriginal = this.ordersDelivery;
      this.ordersWaitingOriginal = this.ordersWaiting;
      this.ordersStartedOriginal = this.ordersStarted;
      this.ordersPreparationOriginal = this.ordersPreparation;
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
          cartStatus: val.cartStatus
        });
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    allOrders() {
      if (this.$refs.select !== undefined) {
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
            : this.getStoreLocals("ACTIVE")[0].image,
        commune: null,
        cartStatus: null
      };
      this.local = this.localSelected;
      this.filters();
      this.$store.commit("auth/setCurrentLocal", {
        id: this.localSelected.value,
        name: this.localSelected.name,
        image: this.localSelected.image,
        commune: this.localSelected.commune,
        cartStatus: this.localSelected.cartStatus
      });
    },
    conditionsToFilter(item, value) {
      if (
        item.id
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.payDetail.user
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.payDetail.userPhone
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.payDetail.pay
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.payDetail.address
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.local.name
          .toString()
          .toLowerCase()
          .indexOf(value) > -1 ||
        item.local.commune
          .toString()
          .toLowerCase()
          .indexOf(value) > -1
      ) {
        return true;
      }
    },
    resetPage() {
      this.bus.$emit("reset-page");
    },
    createOrder() {
      this.bus.$emit("modal-new-order");
    },
    initLocals() {
      this.locals = [];
      this.locals = [...this.getStoreQDLocals("ACTIVE")];

      if (this.locals.length === 1) {
        this.localSelected = this.locals[0];
      } else {
        let dataLocal = { ...this.$store.getters["auth/getDataLocal"] };

        this.localSelected = {
          ...dataLocal,
          value: dataLocal.id,
          label:
            dataLocal.id !== -1
              ? `${dataLocal.name}, ${dataLocal.commune}`
              : `${dataLocal.name}`
        };
      }

      this.local.value = this.localSelected.value;
      this.local.label = this.localSelected.label;
    },
    sendWs(id) {
      var url = this.$store.getters["routes/getRoute"]("send.ws.email");
      this.$axios
        .post(
          url,
          { orderId: id },
          {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          }
        )
        .then(response => {
          if (response.data.status !== "success") {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    }
  }
};
</script>

<style lang="scss">
.orders-tab {
  height: 100%;
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
    justify-content: center;
    width: 90%;
    margin: 0 auto;
    flex-direction: row;
  }
  .dropdown-locals {
    padding: 16px 0;
  }
}

@media screen and (max-width: 768px) {
  .class-card {
    width: 100% !important;
  }
}

@media screen and (max-width: 550px) {
  .input-style-o {
    margin-right: 5px !important;
  }
  .mobile-styles-o {
    justify-content: center !important;
  }
}
</style>
