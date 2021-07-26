<template>
  <q-dialog v-model="card" persistent>
    <q-card
      class="card-bg"
      style="margin-top: 15px; border-radius: 15px; width: 400px;"
    >
      <q-card-section class="text-h6 ">
        <div class="text-h6 ">
          <q-icon style="padding-bottom:4px" name="vpn_key"></q-icon>
          Cambiar contraseña
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm row">
        <!--<q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :error-message="''"
              :error="false"
              type="password"
              dense
              outlined
              rounded
              v-model="password_dict.current_password"
              label="Contraseña actual"
            />
          </q-item-section>
        </q-item>-->
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :error-message="
                alertDifferentPassword === true
                  ? 'Las contraseñas no son iguales'
                  : ''
              "
              :error="alertDifferentPassword"
              type="password"
              dense
              outlined
              rounded
              v-model="password_dict.new_password"
              label="Contraseña nueva"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :error-message="
                alertDifferentPassword === true
                  ? 'Las contraseñas no son iguales'
                  : ''
              "
              :error="alertDifferentPassword"
              type="password"
              dense
              outlined
              rounded
              v-model="password_dict.confirm_new_password"
              label="Confirmar contraseña"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :disable="validationPassword"
          style="margin-bottom:10px; margin-top:8px"
          rounded
          dense
          @click="setPassword()"
          class="text-capitalize bg-green text-white"
          >Guardar
        </q-btn>
        <q-btn
          @click="close()"
          style="margin-bottom:10px; margin-top:8px"
          rounded
          dense
          class="text-capitalize bg-primary text-white"
          >Cerrar
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];

    this.bus.$on("open-new-password", data => {
      this.card = true;
      this.user = data;
    });
  },
  mounted() {},
  data() {
    return {
      card: false,
      prod: null,
      password_dict: {},
      user: null
    };
  },
  computed: {
    validationPassword() {
      let condition2 = false;

      let condition1 =
        this.password_dict.new_password === undefined ||
        this.password_dict.new_password === "" ||
        this.password_dict.confirm_new_password === undefined ||
        this.password_dict.confirm_new_password === "";

      if (
        this.password_dict.new_password !== undefined &&
        this.password_dict.new_password !== "" &&
        this.password_dict.confirm_new_password !== undefined &&
        this.password_dict.confirm_new_password !== ""
      ) {
        if (
          this.password_dict.new_password ===
          this.password_dict.confirm_new_password
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
    alertDifferentPassword() {
      if (
        this.password_dict.new_password !== undefined &&
        this.password_dict.new_password !== "" &&
        this.password_dict.confirm_new_password !== undefined &&
        this.password_dict.confirm_new_password !== ""
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
    close() {
      this.card = false;
      this.password_dict = {};
    },
    setPassword() {
      this.showLoading();
      var data = {
        contrasena_nueva: this.password_dict.new_password
      };
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("resource.users", {
          localId: this.user.id
        });
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.card=false;
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
            this.hideLoading();
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    }
    /*setPassword() {
      let data = {
        //contrasena_actual: this.password_dict.current_password,
        contrasena_nueva: this.password_dict.new_password
      };
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("change.password", {
          userId: this.user.id
        });
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.password_dict = {};
              this.hideLoading();
              this.close();
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
    }*/
  }
};
</script>

<style lang="scss"></style>
