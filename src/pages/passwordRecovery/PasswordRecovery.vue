<template>
  <q-layout style="position: relative; overflow: hidden">
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card class="card-styles-recovery" style="border-radius: 20px">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="icons/favicon-128.png" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Cambiar Contraseña</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md form-recovery">
              <q-input
                :error-message="errorMessages"
                :error="alertDifferentPassword || alertMinPassword"
                type="password"
                v-model="password_dict.new_password"
                lazy-rules
                label="Contraseña nueva"
                style="width: 80%;"
              />
              <q-input
                :error-message="errorMessages"
                :error="alertDifferentPassword || alertMinPassword"
                type="password"
                lazy-rules
                v-model="password_dict.confirm_new_password"
                label="Confirmar contraseña nueva"
                style="width: 80%;"
              />

              <div style="width: 80%;">
                <q-btn
                  :disable="validationForm"
                  style="margin-bottom:10px; margin-top:8px; border-radius: 20px; width: 100%;"
                  @click="setPassword()"
                  class="text-capitalize bg-green text-white"
                  ><p style="margin:0; margin-left: 15px;">GUARDAR</p>
                  <q-spinner-hourglass
                    :color="!loading ? 'green' : 'white'"
                    size="sm"
                    style="margin-left: 10px;"
                  />
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
    <div style="position: absolute; bottom: 20px; left: 20px">
      <p style="color: white">v{{ this.$store.getters["mode/getVersion"] }}</p>
    </div>
  </q-layout>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  inject: ["showNotification", "errorHandling", "showLoading", "hideLoading"],
  data() {
    return {
      password_dict: {
        confirm_new_password: "",
        new_password: ""
      },
      user: null,
      token: "",
      tokenDecode: {},
      loading: false
    };
  },
  mounted() {
    this.password_dict = {
      confirm_new_password: "",
      new_password: ""
    };
    this.token = this.$route.params.token.replaceAll("*", ".");
    let tokenSplit = this.token.split(".");

    if (this.token.length < 135 || tokenSplit.length < 3) {
      this.redirect("El link de cambio de contraseña no es válido");
    } else {
      this.tokenDecode = jwt_decode(this.token);

      if (this.unix(new Date()) > this.tokenDecode.exp) {
        this.redirect("El link de cambio de contraseña ha expirado");
      }
    }
  },
  computed: {
    errorMessages() {
      if (this.alertDifferentPassword === true) {
        return "Las contraseñas no son iguales.";
      }

      if (this.password_dict.new_password.length < 6) {
        return "Las contraseña debe tener al menos 6 caracteres.";
      }
    },
    validationForm() {
      let condition2 = false;

      let condition1 =
        this.password_dict.confirm_new_password === undefined ||
        this.password_dict.confirm_new_password.trim() === "" ||
        this.password_dict.new_password === undefined ||
        this.password_dict.new_password.trim() === "";

      if (
        this.password_dict.confirm_new_password !== undefined &&
        this.password_dict.confirm_new_password.trim() !== "" &&
        this.password_dict.new_password !== undefined &&
        this.password_dict.new_password.trim() !== ""
      ) {
        if (
          this.password_dict.confirm_new_password ===
            this.password_dict.new_password &&
          this.password_dict.new_password.length >= 6
        ) {
          condition2 = false;
        } else {
          condition2 = true;
        }
      } else {
        condition2 = false;
      }

      if (condition1 || condition2) {
        return true;
      } else {
        return false;
      }
    },
    alertMinPassword() {
      if (
        this.password_dict.confirm_new_password !== undefined &&
        this.password_dict.confirm_new_password.trim() !== "" &&
        this.password_dict.new_password !== undefined &&
        this.password_dict.new_password.trim() !== ""
      ) {
        if (this.password_dict.new_password.length < 6) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    alertDifferentPassword() {
      if (
        this.password_dict.new_password !== undefined &&
        this.password_dict.new_password.trim() !== "" &&
        this.password_dict.confirm_new_password !== undefined &&
        this.password_dict.confirm_new_password.trim() !== ""
      ) {
        if (
          this.password_dict.new_password !==
          this.password_dict.confirm_new_password
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  methods: {
    setPassword() {
      this.loading = true;

      var data = {
        password: this.password_dict.new_password.trim(),
        password_confirmation: this.password_dict.confirm_new_password.trim()
      };
      var url = this.$store.getters["routes/getRoute"]("change.password", {
        idUser: this.tokenDecode.id
      });
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.loading = false;
            this.showNotification(
              "Su contraseña ha sido cambiada",
              "positive",
              "check"
            );

            this.$router.push("/login");
          } else {
            this.loading = false;
            this.showNotification(response.data.message, "negative", "error");
          }

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.errorHandling(error);
        });
    },
    redirect(msg) {
      this.$router.push("/login");
      this.showNotification(msg, "negative", "error");
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

.form-recovery {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card-styles-recovery {
  width: 30% !important;
}

.password__recovery {
  cursor: pointer;
}
.password__recovery:hover {
  color: #ff2d2d;
}
@media screen and (max-width: 850px) {
  .card-styles-recovery {
    width: 50% !important;
  }
}
@media screen and (max-width: 600px) {
  .card-styles-recovery {
    width: 80% !important;
  }
}
</style>
