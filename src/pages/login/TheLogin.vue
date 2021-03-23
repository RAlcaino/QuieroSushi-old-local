<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
          style="border-radius:20px"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Iniciar Sesión
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md form-login">
              <q-input
                filled
                v-model.lazy="user.email"
                label="Correo electronico"
                lazy-rules
                style="width: 80%"
              />

              <q-input
                type="password"
                filled
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
  </q-layout>
</template>

<script>
import SecureLS from "secure-ls";
export default {
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      prod: null
    };
  },
  methods: {
    login() {
      if (this.validate(this.user)) {
        return;
      }
      var ls = new SecureLS({ isCompression: false });
      
      if (!this.prod) {
        //Without backend
        this.$q.loadingBar.start();
        setTimeout(() => {
          if(this.user.email==='cajero@cajero.com'){
              ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJDYWplcm8iLCJndWFyZF9uYW1lIjoiYXBpIiwiY3JlYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoifSwibG9jYWxzIjpbeyJpZCI6MTI5LCJuYW1lIjoiU3VzaGkgVmVuZXp1ZWxhIn0seyJpZCI6MTMwLCJuYW1lIjoiU3VzaGkgQ2hpbGUifSx7ImlkIjoxMzEsIm5hbWUiOiJTdXNoaSBDb2xvbWJpYSJ9LHsiaWQiOjEzMiwibmFtZSI6IlN1c2hpIEVFVVUifSx7ImlkIjoxMzMsIm5hbWUiOiJTdXNoaSBVSyJ9XSwiaWF0IjoxNjE2NTI4Mzg4LCJleHAiOjE2MTcxMzMxODh9.rLU7paoejNWs-ybvUGAF9qFD9h7Aqiht_rWUUT-_TJc"
              );
          }
          else if(this.user.email==='gerente@gerente.com'){
              ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJHZXJlbnRlIiwiZ3VhcmRfbmFtZSI6ImFwaSIsImNyZWF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIn0sImxvY2FscyI6W3siaWQiOjEyOSwibmFtZSI6IlN1c2hpIFZlbmV6dWVsYSJ9LHsiaWQiOjEzMCwibmFtZSI6IlN1c2hpIENoaWxlIn0seyJpZCI6MTMxLCJuYW1lIjoiU3VzaGkgQ29sb21iaWEifSx7ImlkIjoxMzIsIm5hbWUiOiJTdXNoaSBFRVVVIn0seyJpZCI6MTMzLCJuYW1lIjoiU3VzaGkgVUsifV0sImlhdCI6MTYxNjUyODM4OCwiZXhwIjoxNjE3MTMzMTg4fQ.d_XCTpRXtovQDneWeP_20O_gUm3vC1NUnaXSPUEHfYo"
              );
          }
          else if(this.user.email==='sudo@sudo.com'){
              ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJTdXBlciBBZG1pbiIsImd1YXJkX25hbWUiOiJhcGkiLCJjcmVhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIiwidXBkYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiJ9LCJsb2NhbHMiOlt7ImlkIjoxMjksIm5hbWUiOiJTdXNoaSBWZW5lenVlbGEifSx7ImlkIjoxMzAsIm5hbWUiOiJTdXNoaSBDaGlsZSJ9LHsiaWQiOjEzMSwibmFtZSI6IlN1c2hpIENvbG9tYmlhIn0seyJpZCI6MTMyLCJuYW1lIjoiU3VzaGkgRUVVVSJ9LHsiaWQiOjEzMywibmFtZSI6IlN1c2hpIFVLIn1dLCJpYXQiOjE2MTY1MjgzODgsImV4cCI6MTYxNzEzMzE4OH0.9MxN8s0tIb7KhyS-oKWM3BYVdGynn1YGvYp1_OEwMYA"
              );
          }
          else if(this.user.email==='admin@admin.com'){
              ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbmlzdHJhZG9yIiwiZ3VhcmRfbmFtZSI6ImFwaSIsImNyZWF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wMi0wOFQyMTo0MToyNC4wMDAwMDBaIn0sImxvY2FscyI6W3siaWQiOjEyOSwibmFtZSI6IlN1c2hpIFZlbmV6dWVsYSJ9LHsiaWQiOjEzMCwibmFtZSI6IlN1c2hpIENoaWxlIn0seyJpZCI6MTMxLCJuYW1lIjoiU3VzaGkgQ29sb21iaWEifSx7ImlkIjoxMzIsIm5hbWUiOiJTdXNoaSBFRVVVIn0seyJpZCI6MTMzLCJuYW1lIjoiU3VzaGkgVUsifV0sImlhdCI6MTYxNjUyODM4OCwiZXhwIjoxNjE3MTMzMTg4fQ._5kuSKmXkxaaExhHqi2nTSXm86ygOpAxm3vfPgppWms"
              );
          }
          else if(this.user.email==='god@god.com'){
              ls.set(
              "token",
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjU3LCJlbWFpbCI6ImRhbmllbCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJHb2QiLCJndWFyZF9uYW1lIjoiYXBpIiwiY3JlYXRlZF9hdCI6IjIwMjEtMDItMDhUMjE6NDE6MjQuMDAwMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIxLTAyLTA4VDIxOjQxOjI0LjAwMDAwMFoifSwibG9jYWxzIjpbeyJpZCI6MTI5LCJuYW1lIjoiU3VzaGkgVmVuZXp1ZWxhIn0seyJpZCI6MTMwLCJuYW1lIjoiU3VzaGkgQ2hpbGUifSx7ImlkIjoxMzEsIm5hbWUiOiJTdXNoaSBDb2xvbWJpYSJ9LHsiaWQiOjEzMiwibmFtZSI6IlN1c2hpIEVFVVUifSx7ImlkIjoxMzMsIm5hbWUiOiJTdXNoaSBVSyJ9XSwiaWF0IjoxNjE2NTI4Mzg4LCJleHAiOjE2MTcxMzMxODh9.3LvxGQ6ObOTtx-k6Nu9Zx3-WH0TFbZl-m1BGytqZbzM"
              );
          }
          else{
            this.showNotification(
              "Credenciales Incorrectas",
              "negative",
              "error"
            );
            this.$q.loadingBar.stop();
            return;
          }

          this.showNotification(
            "Inicio de sesión exitoso",
            "positive",
            "check_circle"
          );
          this.bus.$emit("login");
          this.$q.loadingBar.stop();
          /*console.log(this.$store.getters['auth/getDataUser']);
            console.log(this.$store.getters['auth/getAvailableMenuOptions']);
            console.log(this.$store.getters['auth/getAllMenuOptions']);
            console.log(this.$store.getters['auth/getAuthenticated']);*/
          this.$router.push({ path: "/home" });
        }, 3000);
      } else {
        //With backend
        var url = this.$store.getters["routes/getRoute"]("login");
        this.$axios
          .post(url, this.user)
          .then(response => {
            if (response.data.status === "success") {
              ls.set("token", response.data.result);
              this.showNotification(
                response.data.message,
                "positive",
                "check_circle"
              );
              this.bus.$emit("login");
              /*console.log(this.$store.getters["auth/getDataUser"]);
              console.log(this.$store.getters["auth/getAvailableMenuOptions"]);
              console.log(this.$store.getters["auth/getAllMenuOptions"]);
              console.log(this.$store.getters["auth/getAuthenticated"]);*/
              this.$router.push({ path: "/home" });
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
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
              }
            } else {
              this.showNotification(error.message, "negative", "error");
            }
          });
      }
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
    }
  }
};
</script>

<style>
.bg-image {
  background: #333;
}

.form-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
