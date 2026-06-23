<template>
  <q-layout style="position: relative; overflow: hidden">
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          class="card-styles-login"
          style="border-radius: 20px; position:relative;"
        >
          <div class="back__login" @click="changeView(false)" v-if="recovery">
            <q-icon name="arrow_back" size="sm"></q-icon>
          </div>
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="icons/favicon-128.png" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                {{ recovery ? "Indique su correo electrónico" : "Bienvenido" }}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md form-login" @keypress.enter.prevent>
              <q-input
                v-model.lazy="user.email"
                label="Correo electrónico"
                lazy-rules
                style="width: 80%"
              />

              <q-input
                v-if="!recovery"
                type="password"
                v-model.lazy="user.password"
                label="Contraseña"
                style="width: 80%"
              />

              <div>
                <q-btn
                  style="border-radius: 20px; margin-left: 25px;"
                  :label="recovery ? 'Enviar' : 'Iniciar Sesión'"
                  @click="recovery ? passwordRecovery() : login()"
                  type="button"
                  color="primary"
                />
                <q-spinner-hourglass
                  :color="loading ? 'primary' : 'white'"
                  size="sm"
                  style="position: relative; left: 10px"
                />
              </div>

              <div v-if="!recovery">
                <a @click="changeView(true)" class="password__recovery"
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
import { LoginServices } from "../../services/LoginServices/LoginServices";

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
        if (this.recovery) {
          this.passwordRecovery();
        } else {
          this.login();
        }
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
      dialog: null,
      recovery: false,
      loading: false
    };
  },
  methods: {
    async login() {
      if (this.validate(this.user, 1)) {
        return;
      }
      this.loading = true;
      var ls = new SecureLS({ isCompression: false });

      const service = new LoginServices();

      try {
        let response = await service.login(this.user.email, this.user.password);
        if (response.data.status === "success") {
          ls.set("token", response.data.result.token);
          let data = {
            locals: response.data.result.locals,
            qdLocals: response.data.result.qdLocals,
            availableMenuOptions: response.data.result.availableMenuOptions
          };
          this.bus.$emit("login", data);
          sessionStorage.setItem("panel-migration-pending", "1");
          this.hideLoading();

          if (response.data.result.locals.length === 0) {
            this.$router.push({ path: "/pedidos-propios" });
            return;
          }
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
          this.loading = false;
        } else {
          this.hideLoading();
          this.loading = false;
          this.showNotification(response.data.message, "negative", "error");
        }
      } catch (error) {
        this.hideLoading();
        this.loading = false;
        this.errorHandling(error);
      }
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
    changeView(flag) {
      this.recovery = flag;
    },
    passwordRecovery() {
      if (this.validate(this.user, 2)) {
        return;
      }
      this.loading = true;
      var url = this.$store.getters["routes/getRoute"]("password.recovery");
      this.$axios
        .post(url, { email: this.user.email.trim() })
        .then(response => {
          if (response.data.status === "success") {
            this.Swal.fire({
              title: "¡Te hemos enviado un correo!",
              text: `Verifica tu correo electrónico para continuar con los siguientes pasos.`,
              icon: "success",
              allowOutsideClick: true,
              allowEscapeKey: false,
              allowEnterKey: false,
              showConfirmButton: false,
              timer: 6000,
              timerProgressBar: true
            }).then(() => {
              this.recovery = false;
              this.loading = false;
            });
          } else {
            this.showNotification(response.data.message, "negative", "error");
            this.loading = false;
          }
        })
        .catch(error => {
          this.errorHandling(error);
          this.loading = false;
        });
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

.back__login {
  margin-top: 15px;
  margin-left: 15px;
}

.back__login:hover {
  cursor: pointer !important;
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
