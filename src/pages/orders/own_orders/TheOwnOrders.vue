<template>
  <base-page
    title="Pedidos Propios"
    icon="inventory_2"
    :sync="sync"
    :toolbar="true"
  >
    <div
      class="row wrap justify-between items-center content-center mobile-styles-o"
      style="margin: 20px auto 0 auto; width: 90%"
    >
      <div class="input-style-o">
        <q-input
          dense
          rounded
          outlined
          label="Buscar"
          v-model="search"
          @focus="resetPage()"
          style="margin-bottom: 5px; margin-top: 10px"
        />
      </div>
      <div>
        <q-btn
          class="gt-sm"
          color="green"
          rounded
          size="sm"
          style="position: relative; bottom: 5px"
        >
          <q-icon style="margin-right:5px" size="20px" name="add" />
          <div style="font-size:12px">Crear</div>
        </q-btn>
      </div>
    </div>
    <div class="orders-tab" style="margin-top:5px">
      <div style="width: 90%;height: 100%;">
        <the-item
          :ordersNotConfirmed="getOrdersNotConfirmed"
          :refresh="refresh"
          :sendWs="sendWs"
        ></the-item>
      </div>
    </div>
  </base-page>
</template>

<script>
import TheItem from "../own_orders/status_tables/TheItem.vue";
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
    TheItem,
    BasePage
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    if (this.toAll) {
      this.allOrders();
    }
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
      ordersNotConfirmed: [],
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
      var newArray = [];
      this.data.map(item => {
        item.name = item.payDetail.user;
        item.userPhone = item.payDetail.userPhone;
        item.userAddress = item.payDetail.address;
        newArray.push(item);
      });

      this.data = newArray;
      this.ordersNotConfirmed = this.data.filter(
        item => item.status === "not-confirmed"
      );
      this.ordersNotConfirmedOriginal = this.ordersNotConfirmed;
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
