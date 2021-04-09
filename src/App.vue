<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import SecureLS from "secure-ls";

export default {
  name: "App",
  mounted() {
    console.log("app mounted");
    this.init();
  },
  provide() {
    return {
      formatNumber: this.formatNumber,
      capitalize: this.capitalize,
      showNotification: this.showNotification,
      showLoading: this.showLoading,
      hideLoading: this.hideLoading,
      errorHandling: this.errorHandling
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
        data.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        user.locals = data;
        this.$store.commit("auth/setDataUserSesion", user);
      }
    },
    logout() {
      this.$store.commit("auth/resetDataUserSesion");
      localStorage.clear();
      this.$router.push({ path: "/login" });
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
        this.showNotification(error.message, "negative", "error");
      }
    }
  }
};
</script>
