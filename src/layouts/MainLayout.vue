<template>
  <q-layout view="lHh Lpr lFf">
    <!--Modals-->
    <modal-new-order></modal-new-order>
    <modal-setting></modal-setting>
    <modal-block></modal-block>
    <modal-sync-page></modal-sync-page>
    <modal-debt :open="$store.getters['auth/getDataUser'].debt"></modal-debt>
    <modal-status-order></modal-status-order>
    <modal-order-canceled :refresh="refreshToken"></modal-order-canceled>
    <!---->
    <q-header class="bg-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          <img
            v-if="!this.responsiveMobile"
            src="~/assets/brand/logo-qs-400x72-white.png"
            alt="QuieroSushi.cl Panel"
            :style="{ width: '50%', paddingTop: '5px' }"
          />
          <img
            v-else
            src="~/assets/brand/Q.png"
            alt="QuieroSushi.cl Panel"
            :style="{ width: '50%', paddingTop: '10px' }"
          />
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <!--<div>
            <p style="margin:0">
              {{ currentHour }}:{{ currentMinute }}:{{ currentSecond }}
            </p>
          </div>-->
          <q-btn
            v-if="$store.getters['auth/getInstallPromptEvent'] !== null"
            round
            dense
            flat
            color="white"
            icon="download"
            @click="install()"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="white"
            icon="settings"
            @click="openSettings()"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge
              color="red"
              text-color="white"
              floating
              v-if="
                getCount() !== 0
              "
            >
              {{ getCount() }}
            </q-badge>
            <q-menu>
              <q-list style="width: auto !important;">
                <messages></messages>
                <q-card
                  class="text-center no-shadow no-border"
                  v-if="
                    this.$store.getters['auth/getUserNotifications'].length ===
                      0
                  "
                >
                  <q-btn
                    label="Sin Notificaciones"
                    style="max-width: 200px !important;"
                    flat
                    dense
                    class="text-primary"
                    no-caps
                  ></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn round dense flat color="white" icon="logout" @click="logout()">
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-sidebar text-white"
      :width="230"
    >
      <q-list>
        <div class="user-sidebar">
          <div class="user-sidebar-border">
            <q-avatar size="90px">
              <img :src="$store.getters['auth/getDataLocal'].image" />
            </q-avatar>
            <q-chip
              :color="
                $store.getters['auth/getDataUser'].role === 'God'
                  ? 'green'
                  : 'primary'
              "
              text-color="white"
            >
              {{
                $store.getters["auth/getDataUser"].role === "God"
                  ? "Acceso Total"
                  : $store.getters["auth/getDataUser"].role
              }}
            </q-chip>
            <q-chip
              v-if="$store.getters['auth/getDataUser'].role !== 'God'"
              color="green"
              text-color="white"
              icon="store"
            >
              {{ $store.getters["auth/getDataLocal"].name }}
            </q-chip>
          </div>
        </div>
        <div>
          <q-item to="/bienvenido" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator color="grey-11" inset />
        </div>
        <div v-for="option in optionsAvailable" :key="option.label">
          <q-item :to="option.link" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon :name="option.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ option.label }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator color="grey-11" inset />
        </div>
        <!--
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Opcion 1</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator color="grey-11" inset/>
        <q-item to="/to" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Opcion 2</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator color="grey-11" inset/>

        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator color="grey-11" inset/>
        <q-item to="/Dashboard2" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>CRM Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator color="grey-11" inset/>
        <q-expansion-item
          icon="pages"
          label="Pages"
          expand-icon-class="text-white"
        >
          <q-list class="q-pl-lg">
            <q-item to="/Login-1" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="email"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Login-1</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Lock" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="lock"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Lock Screen</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Lock-2" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="lock"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Lock Screen - 2</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Pricing" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Pricing</q-item-label>
              </q-item-section>
            </q-item>
            <q-item-label header class="text-weight-bolder text-white">Generic</q-item-label>
            <q-item to="/Profile" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="person"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>User Profile</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Maintenance" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="settings"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Maintenance</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-expansion-item
          icon="map"
          label="Maps"
          expand-icon-class="text-white"
        >
          <q-list class="q-pl-lg">
            <q-item to="/Map" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="map"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Map</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/MapMarker" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="location_on"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Map Marker</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/StreetView" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="streetview"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Street View</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-item to="/Mail" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="email"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Mail</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/TreeTable" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="list"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>TreeTable</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Charts" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="insert_chart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Charts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Cards" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="card_giftcard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cards</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Tables" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="table_chart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Tables</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Contact" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Contact</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Checkout" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="check_circle_outline"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Checkout</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Calendar" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="date_range"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Taskboard" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="done"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Taskboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Pagination" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="date_range"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Pagination</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Ecommerce" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="shopping_cart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Product Catalogues</q-item-label>
          </q-item-section>
        </q-item>
      -->
      </q-list>
    </q-drawer>

    <q-drawer
      :width="250"
      v-model="rightDrawerOpen"
      side="right"
      bordered
      content-class="bg-sidebar"
    >
      <div class="fit row no-wrap justify-end items-start content-start">
        <q-btn
          round
          dense
          flat
          color="white"
          icon="cancel"
          style="font-size:12px; padding: 5px;"
          @click="rightDrawerOpen = !rightDrawerOpen"
        >
        </q-btn>
      </div>
    </q-drawer>
    <q-page-container class="bg-white">
      <template
        v-if="
          getStoreLocals('ACTIVE').length > 1 &&
            $store.getters['auth/getDataUser'].role !== 'God'
        "
      >
        <!--
        <q-banner
          v-if="flag === null"
          dense
          inline-actions
          class="text-white bg-deep-orange"
        >
          Algunos locales están <strong>cerrados</strong>
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              @click="change(-1, 1)"
              :label="'apagar restantes'"
            />
            <q-btn
              flat
              color="white"
              @click="change(-1, 0)"
              :label="'encender restantes'"
            />
          </template>
        </q-banner>
        <q-banner
          v-if="flag === 1"
          else
          dense
          inline-actions
          class="text-white bg-green"
        >
          Todos los locales están <strong>abiertos</strong>
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              @click="change(-1, 1)"
              :label="'apagar todos'"
            />
          </template>
        </q-banner>
        <q-banner
          v-if="flag === 0"
          else
          dense
          inline-actions
          class="text-white bg-primary"
        >
          Todos los locales están <strong>cerrados</strong>
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              @click="change(-1, 0)"
              :label="'encender todos'"
            />
          </template>
        </q-banner>
      </template>
      <template
        v-if="
          $store.getters['auth/getDataLocals'].length == 1 &&
            $store.getters['auth/getDataUser'].role !== 'God'
        "
      >
        <q-banner
          dense
          inline-actions
          :class="
            $store.getters['auth/getDataLocal'].cartStatus == 0
              ? 'text-white bg-primary'
              : 'text-white bg-green'
          "
        >
          El local {{ $store.getters["auth/getDataLocal"].name }} está
          <strong v-if="$store.getters['auth/getDataLocal'].cartStatus == 0">
            cerrado
          </strong>
          <strong v-else>
            abierto
          </strong>
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              @click="
                change(
                  $store.getters['auth/getDataLocal'].id,
                  $store.getters['auth/getDataLocal'].cartStatus
                )
              "
              :label="
                $store.getters['auth/getDataLocal'].cartStatus == 0
                  ? 'encender'
                  : 'apagar'
              "
            />
          </template>
        </q-banner>-->
      </template>
      <router-view />
    </q-page-container>

    <div style="position: fixed; right: 10px; bottom:0;">
      <q-toolbar>
        <div class="fit row no-wrap justify-end items-start content-start">
          <q-btn
            round
            dense
            flat
            style="font-size:15px; padding: 5px; margin-bottom:10px; background:#25D366;"
            @click="whatsapp()"
          >
            <i
              class="fab fa-whatsapp"
              style="color: white; font-size: 25px;"
            ></i>
          </q-btn>
        </div>
      </q-toolbar>
    </div>
    <div
      style="position: fixed; bottom:0;"
      :style="leftDrawerOpen ? 'left: 250px' : 'left: 10px'"
    >
      <p>v{{ this.$store.getters["mode/getVersion"] }}</p>
    </div>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";
import Messages from "./Messages";
import ModalNewOrder from "../components/modals/ModalNewOrder.vue";
import ModalSetting from "../components/modals/ModalSetting.vue";
import ModalDebt from "../components/modals/ModalDebt.vue";
import ModalBlock from "../components/modals/ModalBlock.vue";
import ModalSyncPage from "../components/modals/ModalSyncPage.vue";
import ModalStatusOrder from "../components/modals/ModalStatusOrder.vue";
import SecureLS from "secure-ls";
import ModalOrderCanceled from "src/components/modals/ModalOrderCanceled.vue";

export default {
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals"
  ],
  name: "MainLayout",

  components: {
    Messages,
    EssentialLink,
    ModalNewOrder,
    ModalSetting,
    ModalDebt,
    ModalBlock,
    ModalSyncPage,
    ModalStatusOrder,
    ModalOrderCanceled
  },
  created() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    this.flag = this.$store.getters["auth/getCartsStatus"];
    this.bus.$on("refresh-cartstatus", () => {
      var locals = [...this.getStoreLocals("ACTIVE")];
      if (this.getStoreLocals("ACTIVE").length > 1) {
        this.flag = this.$store.getters["auth/getCartsStatus"];
        let currentLocalIndex = locals.findIndex(
          item => item.value === this.$store.getters["auth/getDataLocal"].id
        );
        if (currentLocalIndex !== -1) {
          this.$store.commit("auth/setCurrentLocal", {
            id: locals[currentLocalIndex].value,
            ...locals[currentLocalIndex]
          });
        }
      } else if (this.getStoreLocals("ACTIVE").length === 1) {
        this.$store.commit("auth/setCurrentLocal", {
          id: locals[0].value,
          ...locals[0]
        });
      }
    });
    this.bus.$on("stop-bell", () => {
      this.modalOpen = false;
      this.bell.loop(false);
    });
    this.prod = this.$store.getters["mode/getMode"];
    this.channelName = "Private-qs-venta-";
    this.channelNameAlt = "Private-notificacion-";

    if (this.$store.getters["auth/getGodMode"]) {
      this.channelName += "-1";
      this.channelNameAlt += "-1";
    } else {
      this.channelName += this.$store.getters["auth/getDataUser"].id;
      this.channelNameAlt += this.$store.getters["auth/getDataUser"].id;
    }
    this.privateChannel = this.Echo.channel(this.channelName);
    this.privateChannelAlt = this.Echo2.channel(this.channelNameAlt);
    this.privateChannelSync = this.Echo2.channel("Private-Notificacion");

    this.listenEvent();

    if (this.$store.getters["auth/getAuthenticated"]) {
      this.refreshToken(true, false);
    }

    this.bus.$on("sync-locals", () => {
      this.getLocals(false, false);
    });
  },
  mounted() {
    console.log("main layout mounted");
    this.optionsAvailable = this.$store.getters["auth/getAvailableMenuOptions"];
    this.modeResponsive();
    this.getZones();
    this.getTitles();
    this.getRoles();
    this.getServerTime();
    this.getNotifications(false);
  },
  computed: {
    responsiveMode() {
      if (this.responsiveMobile) {
        return { width: "100%", paddingTop: "10px" };
      } else {
        return { width: "50%", paddingTop: "5px" };
      }
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      optionsAvailable: [],
      responsiveMobile: false,
      prod: null,
      privateChannel: null,
      privateChannelAlt: null,
      privateChannelSync: null,
      channelName: "",
      channelNameAlt: "",
      modalOpen: false,
      flag: 1,
      currentHour: null,
      currentMinute: null,
      currentSecond: null,
      fiveAm: false
    };
  },
  provide() {
    return {
      logout: this.logout,
      refreshToken: this.refreshToken,
      refreshServerTime: this.getServerTime
    };
  },
  methods: {
    updateTime() {
      let date = new Date();
      this.currentHour = date.getHours();
      this.currentMinute = date.getMinutes();
      this.currentSecond = date.getSeconds();
      if (
        this.currentHour ===
          this.$store.getters["auth/getNextUpdateTime"].currentHour &&
        this.currentMinute ===
          this.$store.getters["auth/getNextUpdateTime"].currentMinute &&
        this.currentSecond ===
          this.$store.getters["auth/getNextUpdateTime"].currentSecond
      ) {
        console.log("Han pasado 30min. Verificando cambios.");
        let dt = new Date();
        dt.setMinutes(dt.getMinutes() + 5);

        let payload = {
          currentHour: dt.getHours(),
          currentMinute: dt.getMinutes(),
          currentSecond: dt.getHours()
        };
        this.$store.commit("auth/setNextTimeUpdate", payload);
        this.refreshToken(true, false);
      }
    },
    logout() {
      this.leftDrawerOpen = false;
      this.optionsAvailable = [];
      this.privateChannel = this.Echo.leaveChannel(this.channelName);
      this.privateChannelAlt = this.Echo2.leaveChannel(this.channelNameAlt);
      this.privateChannelSync = this.Echo2.leaveChannel("Private-Notificacion");
      this.channelName = "";
      this.channelNameAlt = "";
      setTimeout(() => {
        this.bus.$emit("logout");
      }, 500);
    },
    modeResponsive() {
      var responsive = window.matchMedia("(max-width: 500px)");

      if (screen.width < 500) {
        this.responsiveMobile = true;
      }

      responsive.addListener(event => {
        if (event.matches) {
          this.responsiveMobile = true;
        } else {
          this.responsiveMobile = false;
        }
      });
    },
    listenEvent() {
      this.privateChannel.listen(".PedidoNuevo", data => {
        if (this.modalOpen) {
          this.bus.$emit("sync-new-order", data);
        } else {
          this.modalOpen = true;
          this.bell.loop(true);
          this.bell.play();
          this.bus.$emit("new-order", data);
        }
      });
      this.privateChannelAlt.listen(".Notificacion", data => {
        if (data.tipo === "Bloqueo") {
          this.bus.$emit("modal-block", data);
        } else if (data.tipo === "conversacion-local") {
          this.bus.$emit("modal-status-order", data);
        } else if (data.tipo === "Anulacion-Pedido") {
          this.bus.$emit("modal-order-canceled", data);
        } else if (data.tipo === "Notificacion-Usuario") {
          this.getNotifications(true);
        }
      });
      this.privateChannelSync.listen(".Notificacion", data => {
        this.bus.$emit("modal-sync-page", data);
      });
    },
    async install() {
      var dialog = this.$store.getters["auth/getInstallPromptEvent"];
      dialog.prompt();
      dialog.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
      });
    },
    openSettings() {
      this.bus.$emit("open-settings");
    },
    change(flag, currentStatus) {
      var newStatus = null;
      if (currentStatus === 1) {
        newStatus = 0;
      } else {
        newStatus = 1;
      }
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.getLocals(false, false);
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("locals.update", {
          localId: flag
        });
        this.$axios
          .put(
            url,
            {
              status: newStatus
            },
            {
              headers: {
                Authorization: this.$store.getters["auth/getToken"]
              }
            }
          )
          .then(response => {
            if (response.data.status === "success") {
              if (this.$router.currentRoute.name === "cupones") {
                this.bus.$emit("sync-coupons");
              }
              this.getLocals(false, false);
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    getLocals(flag, syncComponent) {
      var oldLocals = [...this.getStoreLocals("ACTIVE")];
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          let locals = [
            {
              id: 129,
              name: "Sushi Venezuela",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "Los Santos",
              cartStatus: 1,
              deliveryTime: 27,
              preparationTime: 27
            },
            {
              id: 130,
              name: "Sushi Chile",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "Vice City",
              cartStatus: 0,
              deliveryTime: 10,
              preparationTime: 30
            },
            {
              id: 131,
              name: "Sushi Colombia",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "San Andreas",
              cartStatus: 0,
              deliveryTime: 10,
              preparationTime: 30
            },
            {
              id: 132,
              name: "Sushi EEUU",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "Liberty City",
              cartStatus: 0,
              deliveryTime: 10,
              preparationTime: 30
            },
            {
              id: 133,
              name: "Sushi UK",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "La Paz",
              cartStatus: 0,
              deliveryTime: 10,
              preparationTime: 30
            }
          ];
          this.$store.commit("auth/setLocals", locals);
          this.flag = this.$store.getters["auth/getCartsStatus"];
          this.bus.$emit("sync-locals-settings");
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("locals.get");
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.hideLoading();
            if (response.data.status === "success") {
              var locals = response.data.result.sort((a, b) => {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                return 0;
              });

              this.$store.commit("auth/setLocals", locals);
              this.bus.$emit("sync-locals-settings");
              this.flag = this.$store.getters["auth/getCartsStatus"];

              if (this.getStoreLocals("ACTIVE").length === 1) {
                this.$store.commit(
                  "auth/setCurrentLocal",
                  this.sortAndFilter(locals)[0]
                );
              } else {
                if (this.$store.getters["auth/getDataLocal"].id !== -1) {
                  let currentLocal = locals.find(
                    item =>
                      item.id === this.$store.getters["auth/getDataLocal"].id
                  );
                  this.$store.commit("auth/setCurrentLocal", currentLocal);
                }
              }

              if (syncComponent) {
                window.location.reload();
                return;
              }

              if (flag) {
                if (this.verifyCartStatus(oldLocals, locals)) {
                  return;
                }
              } else {
                this.hideLoading();
              }
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    refreshToken(flag, syncComponent) {
      var ls = new SecureLS({ isCompression: false });
      if (syncComponent) {
        this.showLoading();
      }
      if (!this.prod) {
        setTimeout(() => {
          if (flag) {
            this.getLocals(true, syncComponent);
          } else {
            this.getLocals(false, false);
          }
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("refresh.token");
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              ls.set("token", response.data.result.token);
              this.$store.commit("auth/setToken", response.data.result.token);
              this.$store.commit(
                "auth/setAvailableMenuOptions",
                response.data.result.availableMenuOptions
              );

              this.optionsAvailable = this.$store.getters[
                "auth/getAvailableMenuOptions"
              ];
              if (flag) {
                this.getLocals(true, syncComponent);
              } else {
                this.getLocals(false, false);
              }
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    getZones() {
      var url = this.$store.getters["routes/getRoute"]("get.zones");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.$store.commit("auth/setZones", response.data.result);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    getTitles() {
      var url = this.$store.getters["routes/getRoute"]("get.titles");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.$store.commit("auth/setTitles", response.data.result);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    getRoles() {
      var url = this.$store.getters["routes/getRoute"]("get.roles");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            var locals = response.data.result.data.filter(
              item => item.name !== "God"
            );
            this.$store.commit("auth/setRoles", locals);
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    verifyCartStatus(oldLocals, currentLocals) {
      if (oldLocals.length !== currentLocals.length) {
        return true;
      }
      var flag = false;

      for (let index = 0; index < oldLocals.length; index++) {
        if (oldLocals[index].id !== currentLocals[index].id) {
          flag = true;
          break;
        }
        if (oldLocals[index].cartStatus !== currentLocals[index].cartStatus) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    getServerTime() {
      var url = this.$store.getters["routes/getRoute"]("get.serverTime");
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            let date = new Date(response.data.result);
            this.$store.commit("auth/setServerTime", date.toString());
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    sortAndFilter(locals) {
      let newLocals = [...locals];
      newLocals.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });

      return newLocals.filter(item => item.localStatus === "normal");
    },
    whatsapp() {
      window.open(
        "https://web.whatsapp.com/send/?phone=%2B56934909418&text&app_absent=0"
      );
    },
    getNotifications(notif) {
      var context = new AudioContext();
      var url = this.$store.getters["routes/getRoute"](
        "resources.notifications",
        {
          id: this.$store.getters["auth/getDataUser"].id
        }
      );
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.$store.commit("auth/setNotifications", {
              type: 1,
              items: response.data.result
            });

            if (notif) {
              this.notif.play();
              context.resume();
            }
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    getCount() {
      let count = 0;
      this.$store.getters["auth/getUserNotifications"].map(item => {
        if (item.visto === 0) {
          count++;
        }
      });
      return count;
    }
  }
};
</script>

<style lang="scss">
.bg-header {
  background: #333;
}

.bg-footer {
  background: transparent;
}
.bg-sidebar {
  background: #ff2d2d;
}

.user-sidebar {
  width: 100%;
  height: 200px;
  background-image: url("../assets/background.jpg");
  background-position-x: -20px;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

  .user-sidebar-border {
    width: 95%;
    height: 95%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid rgba($color: #fff, $alpha: 0.7);
  }
}
</style>
