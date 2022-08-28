<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import SecureLS from "secure-ls";
import $ from "jquery";

export default {
  name: "App",
  created() {
    import(`src/utils/lang/es`).then(language => {
      this.$q.lang.set(language.default);
    });
    this.$store.commit("routes/setLinks");
    this.$store.commit("mode/setVersion");
    var vue = this;
    this.bus.$on("scroll-up", () => {
      $("html, body").animate({ scrollTop: 0 }, "slow");
    });
    window.addEventListener("beforeinstallprompt", event => {
      // Prevent Chrome <= 67 from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      vue.installPromptEvent = event;
      vue.$store.commit("auth/setInstallPromptEvent", event);
    });
    window.addEventListener("appinstalled", () => {
      vue.$store.commit("auth/setInstallPromptEvent", null);
      vue.showNotification(
        "¡El acceso directo está en su escritorio!",
        "positive",
        "check_circle"
      );
      console.log("PWA was installed");
    });
  },
  async mounted() {
    console.log("app mounted");
    this.init();
  },
  data() {
    return {
      installPromptEvent: null
    };
  },
  provide() {
    return {
      formatNumber: this.formatNumber,
      capitalize: this.capitalize,
      showNotification: this.showNotification,
      showLoading: this.showLoading,
      hideLoading: this.hideLoading,
      errorHandling: this.errorHandling,
      installPromptEvent: this.installPromptEvent,
      scrollTop: this.scrollTop,
      getStoreLocals: this.getStoreLocals,
      getStoreQDLocals: this.getStoreQDLocals,
      setCurrentLocal: this.setCurrentLocal
    };
  },
  methods: {
    init() {
      this.bus.$on("login", data => {
        this.login(data);
      });
      this.bus.$on("logout", () => {
        this.logout();
      });
    },
    login(data) {
      var ls = new SecureLS({ isCompression: false });
      var token = ls.get("token");
      if (token !== "") {
        let user = jwt_decode(token);
        user.token = token;
        data.locals.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        user.locals = data.locals;
        user.qdLocals = data.qdLocals;
        user.availableMenuOptions = data.availableMenuOptions;
        this.$store.commit("auth/setDataUserSesion", user);
      }
    },
    logout() {
      this.$store.commit("auth/resetDataUserSesion");
      localStorage.clear();
      window.location.reload();
    },
    formatNumber(data) {
      data = parseFloat(data);
      return `${data.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 2
      })}`;
    },
    capitalize(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    showNotification: function(message, color, icon) {
      this.$q.notify({
        progress: true,
        position: "top",
        message: message,
        color: color,
        icon: icon
      });
    },
    showLoading() {
      this.$q.loading.show({
        message: "Espere un momento, por favor..."
      });
    },
    hideLoading() {
      this.$q.loading.hide();
    },
    errorHandling(error) {
      if (error.response) {
        if (error.response.status == 500) {
          this.showNotification(
            "Ha ocurrido un error con el servidor",
            "negative",
            "error"
          );
        } else if (error.response.status == 404) {
          this.showNotification(
            "Ha ocurrido un error de rutas",
            "negative",
            "error"
          );
        } else if (error.response.status == 400) {
          if (typeof error.response.data.message === "object") {
            for (var field in error.response.data.message) {
              this.showNotification(
                error.response.data.message[field],
                "negative",
                "error"
              );
            }
          } else {
            this.showNotification(
              error.response.data.message,
              "negative",
              "error"
            );
          }
        } else if (error.response.status == 401) {
          this.showNotification(
            error.response.data.message,
            "negative",
            "error"
          );
          this.bus.$emit("logout");
        }
      } else {
        let msg = "";
        if (error.message === "Network Error") {
          msg = "Revise su conexión a Internet";
        } else {
          msg = error.message;
        }
        this.showNotification(
          msg, //"Ha ocurrido un error con el servidor",
          "negative",
          "error"
        );
        this.hideLoading();
      }
    },
    getStoreLocals(option) {
      var locals = [];
      if (this.$store.getters["auth/getDataLocals"] !== undefined) {
        var each = this.$store.getters["auth/getDataLocals"].map(item => {
          let row = {
            value: item.id,
            label: item.name + ", " + item.commune,
            image: item.image,
            commune: item.commune,
            name: item.name,
            cartStatus: item.cartStatus,
            localStatus: item.localStatus,
            preparationTime: item.preparationTime,
            deliveryTime: item.deliveryTime
          };
          locals.push(row);
        });
      }

      if (option === "ALL") {
        return locals;
      } else if (option === "ACTIVE") {
        return locals.filter(item => item.localStatus === "normal");
      }
    },
    getStoreQDLocals(option) {
      var locals = [];
      if (this.$store.getters["auth/getDataQDLocals"] !== undefined) {
        var each = this.$store.getters["auth/getDataQDLocals"].map(item => {
          let row = {
            value: item.id,
            label: item.name + ", " + item.commune,
            image: item.image,
            commune: item.commune,
            name: item.name,
            cartStatus: item.cartStatus,
            localStatus: item.localStatus,
            preparationTime: item.preparationTime,
            deliveryTime: item.deliveryTime,
            direccion: item.direccion
          };
          locals.push(row);
        });
      }

      if (option === "ALL") {
        return locals;
      } else if (option === "ACTIVE") {
        return locals.filter(item => item.localStatus === "normal");
      }
    },
    scrollTop() {
      $(document).ready(function() {
        if ($("html").scrollTop() !== 0) {
          $("html").animate({ scrollTop: 0 }, 1000);
        }
      });
    },
    setCurrentLocal(val) {
      this.$store.commit("auth/setCurrentLocal", {
        id: val.value,
        name: val.name,
        image: val.image,
        commune: val.commune,
        cartStatus: val.cartStatus
      });
    }
  }
};
</script>

<style>
.q-field--outlined .q-field__control:before {
  border: 1px solid rgba(0, 0, 0, 0.45);
}

.q-field__counter {
  color: #000;
}
</style>
