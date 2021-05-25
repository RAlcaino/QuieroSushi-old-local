<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="width: 350px; height:270px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="error"
          text-color="primary"
        />
        <span class="q-ml-sm" style="font-size:18px; text-align:center"
          >¡{{ message }}!</span
        >
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
          @click="update()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("modal-block", data => {
      console.log(data);
      this.open = true;
      this.message = data.mensaje;
      this.blockType = data.tipoBloqueo;
    });
  },
  data() {
    return {
      open: false,
      message: "",
      blockType: "",
      prod:""
    };
  },
  methods: {
    update() {
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          let locals = [
            {
              id: 129,
              name: "Sushi Venezuela",
              image: "http://quierosushi.cl/locales/giro-sushi322.jpg",
              commune: "Los Santos",
              cartStatus: 1,
              deliveryTime: 27,
              preparationTime: 27
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
            }
          ];
          this.$store.commit("auth/setLocals", locals);
          this.bus.$emit("refresh-cartstatus");
          this.bus.$emit("sync-locals-settings");
        }, 3000);
      } else {
        var vue = this;
        var url = this.$store.getters["routes/getRoute"]("locals.get");
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.hideLoading();
            if (response.data.status === "success") {
              var locals = response.data.result.sort(function(a, b) {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });
              this.$store.commit("auth/setLocals", locals);
              this.bus.$emit("sync-locals-settings");
              this.bus.$emit("refresh-cartstatus");
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })

          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    }
  }
};
</script>

<style lang="scss"></style>
