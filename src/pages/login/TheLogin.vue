<template>
  <q-layout style="position: relative; overflow:hidden">
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card class="card-styles-login" style="border-radius:20px">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="icons/favicon-128.png" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Bienvenido
              </div>
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
                  style="border-radius:20px"
                  label="Iniciar Sesión"
                  @click="login()"
                  type="button"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
    <div
      v-if="$store.getters['auth/getInstallPromptEvent'] !== null"
      style="position: absolute; bottom:20px;right:20px;"
      lass="fit row no-wrap justify-end items-start content-start"
    >
      <q-btn
        round
        dense
        flat
        color="white"
        icon="download"
        style="font-size:15px; padding: 5px; margin-bottom:10px; background:#ff2d2d;"
        @click="install()"
      >
      </q-btn>
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
  },
  mounted() {
    var vue = this;
    window.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        vue.login();
      }
    });
  },
  data() {
    return {
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
      var availableMenuOptions = [
        {
          label: "Mi perfil",
          link: "/perfil",
          icon: "person"
        },
        {
          label: "Home",
          link: "/home",
          icon: "dashboard"
        },
        {
          label: "Pedidos",
          link: "/pedidos",
          icon: "delivery_dining"
        },
        {
          label: "Cupones",
          link: "/cupones",
          icon: "confirmation_number"
        },
        {
          label: "Usuarios",
          link: "/administrar-usuarios",
          icon: "group"
        },
      ];
      if (this.validate(this.user)) {
        return;
      }
      var ls = new SecureLS({ isCompression: false });
      this.showLoading();
      if (!this.prod) {
        //Without backend
        this.$q.loadingBar.start();
        setTimeout(() => {
          if (this.user.email === "cajero@cajero.com") {
            ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJDYWplcm8iLCJndWFyZF9uYW1lIjoiYXBpIiwiY3JlYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoifSwiaWF0IjoxNjE2NTI4Mzg4LCJleHAiOjE2MTcxMzMxODh9.cADPBjQxGBIqab2zyqf3XvNyb70p_godxTT3HHSvDqM"
            );
          } else if (this.user.email === "gerente@gerente.com") {
            ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJHZXJlbnRlIiwiZ3VhcmRfbmFtZSI6ImFwaSIsImNyZWF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIn0sImlhdCI6MTYxNjUyODM4OCwiZXhwIjoxNjE3MTMzMTg4fQ.4f4WgpFJA_veiJj6hpnMFXSYdvxAHgDrvgGhfLPQVv4"
            );
          } else if (this.user.email === "sudo@sudo.com") {
            ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJTdXBlciBBZG1pbiIsImd1YXJkX25hbWUiOiJhcGkiLCJjcmVhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIiwidXBkYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiJ9LCJpYXQiOjE2MTY1MjgzODgsImV4cCI6MTYxNzEzMzE4OH0.F4ldHxzfuGISfFTkTqMrjGyFIU_L36ufYSWckZ8YFvs"
            );
          } else if (this.user.email === "admin@admin.com") {
            ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbmlzdHJhZG9yIiwiZ3VhcmRfbmFtZSI6ImFwaSIsImNyZWF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIn0sImlhdCI6MTYxNjUyODM4OCwiZXhwIjoxNjE3MTMzMTg4fQ.HdvKZItN90loQ7GUwFNZrmhrD20LAnueCAYi8Fi2TCY"
            );
          } else if (this.user.email === "god@god.com") {
            ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6LTEsImVtYWlsIjoiZGFuaWVsIiwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkdvZCIsImd1YXJkX25hbWUiOiJhcGkiLCJjcmVhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIiwidXBkYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiJ9LCJpYXQiOjE2MTY1MjgzODgsImV4cCI6MTYxNzEzMzE4OH0.ikYg6IeS9yOXbvZTYAFu2dqBS6zmVfFJfHWn-hgviAo"
            );
          } else {
            this.$q.loadingBar.stop();
            this.hideLoading();
            this.showNotification(
              "Credenciales Incorrectas",
              "negative",
              "error"
            );
            return;
          }
          let locals = [
            /*{
              id: 129,
              name: "Sushi Venezuela",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "Los Santos",
              cartStatus: 0,
              deliveryTime: 10,
              preparationTime: 30
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
            }*/
          ];
          let data = {
            locals: locals,
            availableMenuOptions: availableMenuOptions
          };
          this.bus.$emit("login", data);
          this.$q.loadingBar.stop();
          this.hideLoading();
          this.$router.push({ path: "/pedidos" });
        }, 3000);
      } else {
        //With backend
        var url = this.$store.getters["routes/getRoute"]("login");
        this.$axios
          .post(url, this.user)
          .then(response => {
            if (response.data.status === "success") {
              console.log(response.data.result);
              ls.set("token", response.data.result.token);
              let data = {
                locals: response.data.result.locals,
                availableMenuOptions: response.data.result.availableMenuOptions
                //availableMenuOptions: availableMenuOptions
              };
              this.bus.$emit("login", data);
              this.hideLoading();
              this.$router.push({ path: "/pedidos" });
            } else {
              this.hideLoading();
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    validate(user) {
      let flag = false;

      if (user.email === "" && user.password === "") {
        this.showNotification("El correo es obligatorio", "negative", "error");
        this.showNotification(
          "La contraseña es obligatoria",
          "negative",
          "error"
        );
        flag = true;
      } else if (user.email == "" && user.password !== "") {
        this.showNotification("El correo es obligatorio", "negative", "error");
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
@media screen and (max-width: 768px) {
  .card-styles-login {
    width: 40% !important;
  }
}
@media screen and (max-width: 500px) {
  .card-styles-login {
    width: 80% !important;
  }
}
</style>
