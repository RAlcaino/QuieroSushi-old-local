<template>
  <q-layout view="lHh Lpr lFf">
    <modal-new-order></modal-new-order>
    <modal-setting></modal-setting>
    <modal-block></modal-block>
    <modal-sync-page></modal-sync-page>
    <modal-debt :open="$store.getters['auth/getDataUser'].debt"></modal-debt>
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
            src="../assets/brand/logo-qs-400x72-white.png"
            alt="QuieroSushi.cl Panel"
            :style="responsiveMode"
          />
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <div>
            <p style="margin:0">
              {{ currentHour }}:{{ currentMinute }}:{{ currentSecond }}
            </p>
          </div>
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
          <!--<q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important;"
                    flat
                    dense
                    class="text-indigo-8"
                  ></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>-->

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
        <div style="position: absolute; bottom:0px;left:15px;">
          <p>v{{ this.$store.getters["mode/getVersion"] }}</p>
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
          $store.getters['auth/getDataLocals'].length > 1 &&
            $store.getters['auth/getDataUser'].role !== 'God'
        "
      >
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
        </q-banner>
      </template>
      <router-view />
    </q-page-container>

    <div style="position: fixed; right: 0; bottom:0;">
      <q-toolbar>
        <div class="fit row no-wrap justify-end items-start content-start">
          <q-btn
            round
            dense
            flat
            color="white"
            icon="chat"
            style="font-size:15px; padding: 5px; margin-bottom:10px; background:#333;"
            @click="rightDrawerOpen = !rightDrawerOpen"
          >
          </q-btn>
        </div>
      </q-toolbar>
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
import SecureLS from "secure-ls";

export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  name: "MainLayout",

  components: {
    Messages,
    EssentialLink,
    ModalNewOrder,
    ModalSetting,
    ModalDebt,
    ModalBlock,
    ModalSyncPage
  },
  created() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    this.flag = this.$store.getters["auth/getCartsStatus"];
    this.bus.$on("refresh-cartstatus", () => {
      if (this.$store.getters["auth/getDataLocals"].length > 1) {
        this.flag = this.$store.getters["auth/getCartsStatus"];
      } else if (this.$store.getters["auth/getDataLocals"].length === 1) {
        this.$store.commit(
          "auth/setCurrentLocal",
          this.$store.getters["auth/getDataLocals"][0]
        );
      }
    });
    this.bus.$on("stop-bell", () => {
      this.modalOpen = false;
      this.bell.loop(false);
    });
    this.prod = this.$store.getters["mode/getMode"];
    this.channelName = "Private-qs-venta-";
    this.channelNameBlock = "Private-notificacion-";

    if (this.$store.getters["auth/getGodMode"]) {
      this.channelName += "-1";
      this.channelNameBlock += "-1";
    } else {
      this.channelName += this.$store.getters["auth/getDataUser"].id;
      this.channelNameBlock += this.$store.getters["auth/getDataUser"].id;
    }
    this.privateChannel = this.Echo.channel(this.channelName);
    this.privateChannelBlock = this.Echo2.channel(this.channelNameBlock);
    this.listenEvent();
  },
  mounted() {
    console.log("main layout mounted");
    //console.log(this.$store.getters["auth/getAvailableMenuOptions"]);
    this.optionsAvailable = this.$store.getters["auth/getAvailableMenuOptions"];
    this.modeResponsive();
    this.getZones();
    this.getTitles();
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
      privateChannelBlock: null,
      channelName: "",
      channelNameBlock: "",
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
      refreshToken: this.refreshToken
    };
  },
  methods: {
    updateTime() {
      let date = new Date();
      this.currentHour = date.getHours();
      this.currentMinute = date.getMinutes();
      this.currentSecond = date.getSeconds();
      if (
        this.currentHour === 5 &&
        this.currentMinute === 0 &&
        this.currentSecond === 0
      ) {
        console.log("Son las 5:00am");
        this.refreshToken();
      }
    },
    logout() {
      this.optionsAvailable = [];
      this.privateChannel = this.Echo.leaveChannel(this.channelName);
      this.privateChannelBlock = this.Echo2.leaveChannel(this.channelNameBlock);
      this.channelName = "";
      this.channelNameBlock = "";
      this.bus.$emit("logout");
    },
    modeResponsive() {
      var responsive = window.matchMedia("(max-width: 500px)");
      var vue = this;

      if (screen.width < 500) {
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
    listenEvent() {
      var vue = this;
      this.privateChannel.listen(".PedidoNuevo", function(data) {
        if (vue.modalOpen) {
          vue.bus.$emit("sync-new-order", data);
        } else {
          vue.modalOpen = true;
          vue.bell.loop(true);
          vue.bell.play();
          vue.bus.$emit("new-order", data);
        }
      });
      this.privateChannelBlock.listen(".Notificacion", function(data) {
        if (data.tipo === "Bloqueo") {
          vue.bus.$emit("modal-block", data);
        } else if (data.tipo === "Actualizacion") {
          vue.bus.$emit("modal-sync-page", data);
        }
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
          this.getLocals(false);
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
              this.getLocals(false);
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
    getLocals(flag) {
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
            var vue = this;
            this.hideLoading();
            if (response.data.status === "success") {
              var locals = response.data.result.sort(function(a, b) {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });
              this.$store.commit("auth/setLocals", locals);
              this.bus.$emit("sync-locals-settings");
              this.flag = this.$store.getters["auth/getCartsStatus"];

              if (this.$store.getters["auth/getDataLocals"].length === 1) {
                /*let test={
                  cartStatus: 0,
                  commune: "San Miguel",
                  deliveryTime: 5,
                  id: 1913,
                  image: "http://quierosushi.cl/locales/umeshu-sushi478.jpg",
                  name: "Umeshu Sushi",
                  preparationTime: 20
                }*/
                this.$store.commit("auth/setCurrentLocal", locals[0]);
              } else {
                if (vue.$store.getters["auth/getDataLocal"].id !== -1) {
                  let currentLocal = locals.find(
                    item =>
                      item.id === vue.$store.getters["auth/getDataLocal"].id
                  );
                  this.$store.commit("auth/setCurrentLocal", currentLocal);
                }
              }

              if (flag) {
                window.location.reload();
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
    refreshToken() {
      var ls = new SecureLS({ isCompression: false });
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.getLocals(true);
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
              this.getLocals(true);
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
