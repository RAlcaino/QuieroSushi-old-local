<template>
  <q-layout view="lHh Lpr lFf" class="absolute-full">
    <modal-new-order></modal-new-order>
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
              <img :src="this.$store.getters['auth/getDataLocal'].image" />
            </q-avatar>
            <q-chip
              :color="
                this.$store.getters['auth/getDataUser'].role === 'God'
                  ? 'green'
                  : 'primary'
              "
              text-color="white"
            >
              {{
                this.$store.getters["auth/getDataUser"].role === "God"
                  ? "Acceso Total"
                  : this.$store.getters["auth/getDataUser"].role
              }}
            </q-chip>
            <q-chip
              v-if="this.$store.getters['auth/getDataUser'].role !== 'God'"
              color="green"
              text-color="white"
              icon="store"
            >
              {{ this.$store.getters["auth/getDataLocal"].name }}
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

export default {
  name: "MainLayout",

  components: {
    Messages,
    EssentialLink,
    ModalNewOrder
  },
  created() {
    this.bus.$on("stop-bell", () => {
      this.modalOpen = false;
      this.bell.loop(false);
    });
    this.prod = this.$store.getters["mode/getMode"];
    this.channelName = "Private-";

    if (this.$store.getters["auth/getGodMode"]) {
      this.channelName += "-1";
    } else {
      this.channelName += this.$store.getters["auth/getDataUser"].id;
    }
    this.privateChannel = this.Echo.channel(this.channelName);
    this.listenEvent();
  },
  mounted() {
    console.log("main layout mounted");
    console.log(this.$store.getters["auth/getAvailableMenuOptions"]);
    this.optionsAvailable = this.$store.getters["auth/getAvailableMenuOptions"];
    this.modeResponsive();
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
      channelName: "",
      modalOpen: false
    };
  },
  methods: {
    logout() {
      this.optionsAvailable = [];
      this.privateChannel = this.Echo.leaveChannel(this.channelName);
      this.channelName = "";
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
