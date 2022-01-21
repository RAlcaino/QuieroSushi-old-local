<template>
  <q-layout style="position: relative; overflow: hidden">
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card class="card-styles-login" style="border-radius: 20px">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="icons/favicon-128.png" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Bienvenido</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md form-login">
              <q-input
                v-model.lazy="user.email"
                label="Correo electronico"
                lazy-rules
                style="width: 80%"
              />

              <q-input
                type="password"
                v-model.lazy="user.password"
                label="Contraseña"
                style="width: 80%"
              />

              <div>
                <q-btn
                  style="border-radius: 20px"
                  label="Iniciar Sesión"
                  @click="login()"
                  type="button"
                  color="primary"
                />
              </div>

              <div>
                <a @click="passwordRecovery()" class="password__recovery"
                  >¿Has olvidado la contraseña?</a
                >
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
    <div
      v-if="$store.getters['auth/getInstallPromptEvent'] !== null"
      style="position: absolute; bottom: 20px; right: 20px"
    >
      <q-btn
        round
        dense
        flat
        color="white"
        icon="download"
        style="
          font-size: 15px;
          padding: 5px;
          margin-bottom: 10px;
          background: #ff2d2d;
        "
        @click="install()"
      >
      </q-btn>
    </div>
    <div style="position: absolute; bottom: 20px; left: 20px">
      <p style="color: white">v{{ this.$store.getters["mode/getVersion"] }}</p>
    </div>
  </q-layout>
</template>

<script>
import SecureLS from "secure-ls";
import { QSpinnerGears } from "quasar";

export default {
  inject: ["showNotification", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.$store.commit("auth/resetDataUserSesion");
    this.html = document.getElementsByTagName("html");
    this.html[0].style.overflow = "hidden";
    localStorage.clear();
  },
  mounted() {
    window.addEventListener("keyup", event => {
      if (
        event.keyCode === 13 &&
        this.$router.currentRoute.fullPath === "/login"
      ) {
        this.login();
      }
    });
  },
  data() {
    return {
      html: null,
      user: {
        email: "",
        password: ""
      },
      prod: null,
      dialog: null
    };
  },
  methods: {
    login() {
      if (this.validate(this.user, 1)) {
        return;
      }
      var ls = new SecureLS({ isCompression: false });
      this.showLoading();

      var url = this.$store.getters["routes/getRoute"]("login");
      this.$axios
        .post(url, this.user)
        .then(response => {
          if (response.data.status === "success") {
            ls.set("token", response.data.result.token);
            let data = {
              locals: response.data.result.locals,
              availableMenuOptions: response.data.result.availableMenuOptions
            };
            this.bus.$emit("login", data);
            this.hideLoading();

            if (data.availableMenuOptions.length == 2) {
              data.availableMenuOptions.some(
                item => item.link === "/historico-cobro-semanal"
              )
                ? this.$router.push({ path: "/historico-cobro-semanal" })
                : this.$router.push({ path: "/bienvenido" });
            } else {
              data.availableMenuOptions.some(item => item.link === "/pedidos")
                ? this.$router.push({ path: "/pedidos" })
                : this.$router.push({ path: "/bienvenido" });
            }
            this.html[0].style.overflow = "auto";
          } else {
            this.hideLoading();
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },
    validate(user, mode) {
      let flag = false;

      if (mode === 1) {
        if (user.email === "" && user.password === "") {
          this.showNotification(
            "El correo es obligatorio",
            "negative",
            "error"
          );
          this.showNotification(
            "La contraseña es obligatoria",
            "negative",
            "error"
          );
          flag = true;
        } else if (user.email == "" && user.password !== "") {
          this.showNotification(
            "El correo es obligatorio",
            "negative",
            "error"
          );
          flag = true;
        } else if (user.email !== "" && user.password == "") {
          this.showNotification(
            "La contraseña es obligatoria",
            "negative",
            "error"
          );
          flag = true;
        } else if (!user.email.includes("@")) {
          this.showNotification(
            "Debe ingresar un correo valido",
            "negative",
            "error"
          );
          flag = true;
        }
      } else {
        if (user.email == "") {
          this.showNotification("Debe indicar su correo", "negative", "error");
          flag = true;
        } else if (!user.email.includes("@")) {
          this.showNotification(
            "Debe ingresar un correo valido",
            "negative",
            "error"
          );
          flag = true;
        }
      }

      return flag;
    },
    showCustom() {
      this.dialog = this.$q.dialog({
        title: "Cargando...",
        style: { borderRadius: "20px" },
        progress: {
          spinner: QSpinnerGears,
          color: "primary"
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      });
    },
    hideCustom() {
      this.dialog.hide();
    },
    showLoading() {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: "white",
        message: "Cargando..."
      });
    },
    hideLoading() {
      this.$q.loading.hide();
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
    passwordRecovery() {
      if (this.validate(this.user, 2)) {
        return;
      }

      setTimeout(() => {
        this.Swal.fire({
          title: "¡Te hemos enviado un correo!",
          text: `Verifica tu correo electronico para continuar con los siguientes pasos`,
          icon: "success",
          allowOutsideClick: true,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true
        }).then(result => {
          /* Read more about isConfirmed, isDenied below */
          this.redirectTo();
        });
      }, 2000);
    }
  }
};
</script>

<style>
.bg-image {
  background-image: url("../../../src/assets/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  /*background-position-x: -50px;*/
}

.form-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card-styles-login {
  width: 30% !important;
}

.password__recovery {
  cursor: pointer;
}
.password__recovery:hover {
  color: #ff2d2d;
}
@media screen and (max-width: 850px) {
  .card-styles-login {
    width: 50% !important;
  }
}
@media screen and (max-width: 600px) {
  .card-styles-login {
    width: 80% !important;
  }
}
</style>
