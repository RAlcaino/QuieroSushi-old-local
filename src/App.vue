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
    import(`quasar/lang/es`).then(language => {
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
  mounted() {
    console.log("app mounted");
    //SERVER TIME
    setInterval(() => {
      if (this.$store.getters["auth/getServerTime"] !== null) {
        let date = new Date(this.$store.getters["auth/getServerTime"]);
        date.setSeconds(date.getSeconds() + 1);
        this.$store.commit("auth/setServerTime", date.toString());
      }
    }, 1000);
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
      getServerTime: this.serverTime,
      scrollTop: this.scrollTop
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
        user.availableMenuOptions = data.availableMenuOptions;
        this.$store.commit("auth/setDataUserSesion", user);
      }
    },
    logout() {
      this.$store.commit("auth/resetDataUserSesion");
      localStorage.clear();
      window.location.reload();
    },
    formatNumber(num) {
      if (!num || num == "NaN") return "0";
      if (num == "Infinity") return "&#x221e;";
      num = num.toString().replace(/\$|\,/g, "");
      if (isNaN(num)) num = "0";
      let sign = num == (num = Math.abs(num));
      num = Math.floor(num * 100 + 0.50000000001);
      num = Math.floor(num / 100).toString();
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num =
          num.substring(0, num.length - (4 * i + 3)) +
          "." +
          num.substring(num.length - (4 * i + 3));
      return (sign ? "" : "-") + num;
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
              //error.response.data.message,
              "Ha ocurrido un error con el servidor",
              "negative",
              "error"
            );
          }
        } else if (error.response.status == 401) {
          this.showNotification(
            //error.response.data.message,
            "Ha ocurrido un error con el servidor",
            "negative",
            "error"
          );
          this.bus.$emit("logout");
        }
      } else {
        this.showNotification(
          /*error.message*/ "Ha ocurrido un error con el servidor",
          "negative",
          "error"
        );
      }
    },
    serverTime() {
      let date = new Date(this.$store.getters["auth/getServerTime"]);
      let time = "";
      let serverTime = "";

      time += date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      time +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes
      time +=
        date.getSeconds() < 10
          ? ":0" + date.getSeconds()
          : ":" + date.getSeconds(); // get seconds

      serverTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;

      return serverTime;
    },
    scrollTop() {
      $(document).ready(function() {
        $("html").animate(
          { scrollTop: 0 },
          1000
        );
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
