<template>
  <base-page
    title="Pedidos"
    icon="delivery_dining"
    :sync="sync"
    :toolbar="true"
  >
    <div
      class="row wrap justify-between items-center content-center mobile-styles-o"
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
          style="margin-bottom: 5px;"
        />
      </div>
      <div>
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
          style="margin-bottom: 5px;"
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
      <div style="width: 90%;height: 100%;">
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
              :sendWs="sendWs"
            ></not-confirmed>
          </q-tab-panel>

          <q-tab-panel name="confirmed" style="padding: 0; overflow:hidden">
            <the-confirmed
              :ordersConfirmed="getOrdersConfirmed"
              :sendWs="sendWs"
            ></the-confirmed>
          </q-tab-panel>

          <q-tab-panel name="done" style="padding: 0; overflow:hidden">
            <the-done :ordersDone="getOrdersDone" :sendWs="sendWs"></the-done>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </base-page>
</template>

<script>
import NotConfirmed from "./status_tables/NotConfirmed.vue";
import TheConfirmed from "./status_tables/TheConfirmed.vue";
import TheDone from "./status_tables/TheDone.vue";
import BasePage from "src/components/bases/BasePage.vue";

export default {
  props: ["toAll"],
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals"
  ],
  components: {
    NotConfirmed,
    TheConfirmed,
    TheDone,
    BasePage
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    if (this.toAll) {
      this.allOrders();
    }
    this.bus.$on("to-one-tab", () => {
      this.bus.$emit("scroll-up");
      this.tab = "not-confirmed";
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
    getOrdersConfirmed() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersConfirmed.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersConfirmedOriginal;
      }
    },
    getOrdersNotConfirmed() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersNotConfirmed.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
            return true;
          }
        });
      } else {
        return this.ordersNotConfirmed;
      }
    },
    getOrdersDone() {
      var vue = this;
      if (this.search !== "") {
        return this.ordersDone.filter(function(item) {
          if (vue.conditionsToFilter(item, vue.search)) {
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
      if (flag) {
        this.showLoading();
      } else {
        this.bus.$emit("start-loader");
      }
      var url = this.$store.getters["routes/getRoute"]("orders", {
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
    initLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

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
      var url = this.$store.getters["routes/getRoute"]("send.ws");
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
