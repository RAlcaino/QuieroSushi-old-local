<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="border-radius:10px;width: 500px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="settings"
          />
          Configuración
        </div>
      </q-card-section>
      <q-card-section class="card-section-modal-new-o">
        <q-select
          v-if="localsFilter.length > 1"
          ref="select"
          rounded
          outlined
          dense
          :options="localsFilter"
          :options-dense="true"
          hide-hint
          v-model="localSelected"
          @input="change"
          @popup-hide="allLocals()"
          class="q-select-s"
          style="margin-bottom: 15px;"
          :virtual-scroll-sticky-size-start="80"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
          <template v-slot:before-options>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item dense clickable @click="allOrders()">
              <q-item-section>Todos</q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey">
                Sin Resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div v-if="localsFilter.length === 1" style="margin-bottom:15px">
          <q-icon
            style="margin-right:5px;padding-bottom:5px;"
            size="20px"
            name="store"
            color="blacklight"
          />
          <strong>{{ localSelected.label }}</strong>
        </div>
        <div v-if="localSelected.value !== -1" style="margin-left: 15px">
          <strong>Carrito:</strong>
          <q-toggle
            :false-value="0"
            :true-value="1"
            icon="shopping_cart"
            v-model="cartStatus"
            color="green"
            @input="changeStatus()"
          />
        </div>
        <div
          v-if="localSelected.value === -1 && localsFilter.length > 1"
          style="display:flex;flex-direction:column; justify-content:center; align-items:center"
        >
          <div style="margin-bottom:8px">
            <strong> Carrito </strong>
          </div>
          <div style="display:flex;justify-content:center; align-items:center">
            <q-btn
              rounded
              color="primary"
              label="Apagar todos"
              style="font-size: 11px !important"
              @click="save(0)"
            />
            <q-btn
              rounded
              color="green"
              label="Encender todos"
              style="font-size: 11px !important; margin-left: 5px;"
              @click="save(1)"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="fit row no-wrap justify-around items-start content-start responsive-setting"
      >
        <div
          class="responsive-inputs-s"
          style="display: flex;
    flex-direction: column;
    align-items: center;"
        >
          <strong>Tiempo de preparación</strong>
          <q-input
            :min="0"
            v-model="preparationTime"
            color="primary"
            style="width: 80px; margin-left: 10px"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon name="query_builder" />
            </template>
          </q-input>
        </div>
        <div
          class="responsive-inputs-s"
          style="display: flex;
    flex-direction: column;
    align-items: center;"
        >
          <strong>Tiempo espera delivery</strong>
          <q-input
            v-model="deliveryTime"
            color="primary"
            style="width: 80px;margin-left: 10px"
            type="number"
            :min="0"
          >
            <template v-slot:prepend>
              <q-icon name="query_builder" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="green"
          label="Guardar"
          style="font-size: 11px !important"
          @click="save(2)"
        />
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
          @click="reset()"
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
    this.initLocals();
    this.localsFilter = this.locals;

    this.bus.$on("sync-locals-settings", () => {
      this.initLocals();
      this.localsFilter = this.locals;
    });

    this.bus.$on("open-settings", () => {
      this.open = true;
    });
  },
  data() {
    return {
      open: false,
      locals: [],
      localsFilter: [],
      localSelected: {
        label: "Todos",
        value: -1,
        image: null,
        commune: null,
        name: null,
        preparationTime: 0,
        deliveryTime: 0,
        cart: null
      },
      localFilter: "",
      prod: null,
      deliveryTime: 0,
      preparationTime: 0,
      cartStatus: null
    };
  },
  methods: {
    filterFn(val) {
      if (val === "") {
        this.localsFilter = this.locals;
        return;
      }

      const needle = val.toLowerCase();
      this.localsFilter = this.locals.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    change(val) {
      if (val !== null) {
        this.deliveryTime = +val.deliveryTime;
        this.cartStatus = val.cart;
        this.preparationTime = +val.preparationTime;
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    reset() {
      if (this.$store.getters["auth/getDataLocals"].length !== 1) {
        this.preparationTime = 0;
        this.cartStatus = null;
        this.deliveryTime = 0;
        this.localSelected = {
          label: "Todos",
          value: -1,
          image: null,
          commune: null,
          name: null,
          preparationTime: 0,
          deliveryTime: 0,
          cart: null
        };
      } else {
        this.bus.$emit("sync-locals-settings");
      }
    },
    allOrders() {
      if (this.$refs.select !== undefined) {
        this.$refs.select.hidePopup();
      }
      this.reset();
    },
    save(flag) {
      if (flag === 1) {
        this.cartStatus = 1;
      } else if (flag === 0) {
        this.cartStatus = 0;
      }
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.getLocals();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("locals.update", {
          localId: this.localSelected.value
        });
        if (flag === 1 || flag === 0) {
          var object = {
            status: this.cartStatus
          };
        } else {
          var object = {
            status: this.cartStatus,
            deliveryTime: +this.deliveryTime,
            preparationTime: +this.preparationTime
          };
        }
        this.$axios
          .put(url, object, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              console.log(response.data);
              this.getLocals();
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.localsFilter = this.locals;
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    changeStatus() {
      /*console.log(this.localSelected.value);
      console.log(this.cartStatus);*/
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
          this.getLocals();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("locals.update", {
          localId: this.localSelected.value
        });
        console.log(url);
        this.$axios
          .put(
            url,
            {
              status: this.cartStatus
            },
            {
              headers: {
                Authorization: this.$store.getters["auth/getToken"]
              }
            }
          )
          .then(response => {
            if (response.data.status === "success") {
              this.getLocals();
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.localsFilter = this.locals;
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    getLocals() {
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
              //console.log(locals);
              this.$store.commit("auth/setLocals", locals);
              this.bus.$emit("sync-locals-settings");
              this.bus.$emit("refresh-cartstatus");
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })

          .catch(error => {
            this.localsFilter = this.locals;
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    initLocals() {
      var vue = this;
      vue.locals = [];
      var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          deliveryTime: item.deliveryTime,
          preparationTime: item.preparationTime,
          cart: item.cartStatus
        };
        vue.locals.push(row);
        vue.locals.sort(function(a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
      if (this.$store.getters["auth/getDataLocals"].length === 1) {
        this.localSelected.value = this.$store.getters["auth/getDataLocal"].id;
        this.localSelected.image = this.$store.getters[
          "auth/getDataLocal"
        ].image;
        this.localSelected.commune = this.$store.getters[
          "auth/getDataLocal"
        ].commune;
        this.localSelected.name = this.$store.getters["auth/getDataLocal"].name;
        this.localSelected.cartStatus = this.$store.getters[
          "auth/getDataLocal"
        ].cartStatus;

        if (this.localSelected.value !== -1) {
          this.localSelected.label =
            this.localSelected.name + ", " + this.localSelected.commune;
        } else {
          this.localSelected.label = this.localSelected.name;
        }

        this.cartStatus = this.$store.getters[
          "auth/getDataLocals"
        ][0].cartStatus;
        this.deliveryTime = this.$store.getters[
          "auth/getDataLocals"
        ][0].deliveryTime;
        this.preparationTime = this.$store.getters[
          "auth/getDataLocals"
        ][0].preparationTime;
      }
    }
  }
};
</script>

<style lang="scss">
.q-select-s {
  margin-left: 0px;
}
@media screen and (max-width: 500px) {
  .q-select-s {
    margin-left: 0;
  }
  .responsive-setting {
    flex-direction: column !important;
    align-items: center !important;
  }
  .responsive-inputs-s {
    margin-bottom: 20px !important;
  }
}
</style>
