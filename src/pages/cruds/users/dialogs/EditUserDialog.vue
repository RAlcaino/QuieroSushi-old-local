<template>
  <q-dialog v-model="card" persistent>
    <q-card
      style="border-radius:10px;width: 550px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="edit"
          />
          Editar Usuario
        </div>
        <q-space />
        <q-btn
          icon="close"
          color="white"
          flat
          round
          dense
          @click="closeDialog()"
        />
      </q-card-section>
      <q-card-section
        class="row items-center justify-center"
        style="height:auto !important;"
      >
        <div class="row q-col-gutter-sm justify-center">
          <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
            <div
              class="text-h6"
              style="text-align:center; margin-bottom: 10px;"
            >
              <q-icon style="padding-bottom:4px" name="person"></q-icon>
              Datos del usuario
            </div>
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <form autocomplete="off">
                    <q-input
                      v-model="form.email"
                      color
                      outlined
                      rounded
                      dense
                      label="Correo electronico"
                    />
                  </form>
                </q-item-section>
              </q-item>
              <!--<q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="form.password"
                    outlined
                    rounded
                    dense
                    label="Contraseña"
                    type="password"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="form.confirmPassword"
                    outlined
                    rounded
                    dense
                    label="Confirmar contraseña"
                    type="password"
                  />
                </q-item-section>
              </q-item>-->
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    outlined
                    rounded
                    dense
                    v-model="form.roleSelected"
                    :options="roles"
                    label="Rol"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    v-if="$store.getters['auth/getDataLocals'].length > 1"
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
                    class="q-select-coupon q-select-s"
                    style="margin-bottom: 15px;"
                    :virtual-scroll-sticky-size-start="80"
                  >
                    <template v-slot:prepend>
                      <q-icon name="store" />
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section>
                          <q-item-label v-html="'<strong>'+scope.opt.value+'</strong> - '+scope.opt.label" />
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected-item="scope">
                     <div><strong v-if="scope.opt.value!==-1">{{scope.opt.value}} -</strong> {{scope.opt.label.length>18?scope.opt.label.substring(0,18)+'...':scope.opt.label}}</div>
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
                </q-item-section>
                <q-btn
                  color="green"
                  round
                  style="margin-left:10px; height:30px; margin-top: 5px"
                  size="sm"
                  @click="addLocal()"
                >
                  <q-icon size="20px" name="add" />
                </q-btn>
              </q-item>
              <q-item
                v-if="form.storesSelected.length !== 0"
                class="col-lg-10 col-md-10 col-sm-12 col-xs-12"
                style="margin-top:10px"
              >
                <q-item-section>
                  <q-item-label style="font-weight:bold;margin-bottom:10px"
                    >Locales agregados:</q-item-label
                  >
                  <q-chip
                    v-for="store of form.storesSelected"
                    :key="store.value"
                    v-model="store.flag"
                    removable
                    color="green"
                    text-color="white"
                    icon="store"
                    @remove="deleteStore(store.value)"
                  >
                    {{ store.label }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="edit()"
          size="sm"
          style="font-size:12px;padding: 0px 15px !important; "
          rounded
          color="blue"
          >Guardar</q-btn
        >
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

    this.bus.$on("open-edit-user", data => {
      this.card = true;
      this.user = data;
      this.form.email = this.user.email;
      this.form.roleSelected = {
        value: data.roleObject.id,
        label: data.roleObject.name
      };
      this.form.storesSelected = [];
      var vue = this;
      if (this.user.locals.length !== 0) {
        this.user.locals.map(function(item) {
          let result = vue.$store.getters["auth/getDataLocals"].find(
            item2 => item2.id === item.id_local
          );
          let row = {
            value: result.id,
            label: result.name + ", " + result.commune,
            image: result.image,
            commune: result.commune,
            name: result.name,
            deliveryTime: result.deliveryTime,
            preparationTime: result.preparationTime,
            cart: result.cartStatus
          };
          vue.form.storesSelected.push(row);
        });
      } else {
        vue.form.storesSelected.push({
          label: "Todos",
          value: -1,
          image: null,
          commune: null,
          name: null,
          preparationTime: 0,
          deliveryTime: 0,
          cart: null
        });
      }
    });
  },
  mounted() {},
  data() {
    return {
      card: false,
      prod: null,
      user: null,
      roles: this.$store.getters["auth/getRoles"],
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
      locals: [],
      localsFilter: [],
      localFilter: "",
      form: {
        email: "",
        password: "",
        confirmPassword: "",
        roleSelected: {
          value: null,
          label: ""
        },
        storesSelected: []
      }
    };
  },
  methods: {
    closeDialog() {
      this.card = false;
      this.form.email = "";
      this.form.password = "";
      this.form.confirmPassword = "";
      this.form.roleSelected = {
        value: null,
        label: ""
      };
      this.form.storesSelected = [];
      this.reset();
    },
    edit() {
      this.showLoading();
      let selectedLocals = [];
      let selectedLocalsString = "";
      this.form.storesSelected.map(function(item) {
        selectedLocals.push(item.value);
        selectedLocalsString += item.value + ",";
      });
      var data = {
        id_rol: this.form.roleSelected.value,
        email: this.form.email,
        locales: {
          string: selectedLocalsString.substring(
            0,
            selectedLocalsString.length - 1
          ),
          array: selectedLocals
        }
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
              this.hideLoading();
              this.card = false;
              this.filter = "";
              this.bus.$emit("sync-users");
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
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
    },
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
        this.localSelected = val;
      }
    },
    addLocal() {
      if (
        this.form.storesSelected.some(
          item => item.value === this.localSelected.value
        )
      ) {
        if (this.localSelected.value === -1) {
          this.showNotification(
            "Ya ha seleccionado todos los locales a su lista",
            "negative",
            "error"
          );
        } else {
          this.showNotification(
            "El local ya encuentra en su lista",
            "negative",
            "error"
          );
        }
      } else if (this.form.storesSelected.some(item => item.value === -1)) {
        this.showNotification(
          "Ya ha seleccionado todos los locales a su lista",
          "negative",
          "error"
        );
      } else {
        if (this.localSelected.value === -1) {
          this.form.storesSelected = [];
        }
        this.form.storesSelected.push({
          value: this.localSelected.value,
          label: this.localSelected.label,
          flag: true
        });
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    reset() {
      if (this.$store.getters["auth/getDataLocals"].length !== 1) {
        this.storesSelected = [];
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
      }
    },
    deleteStore(storeId) {
      this.form.storesSelected = this.form.storesSelected.filter(
        item => item.value !== storeId
      );
    },
    allOrders() {
      if (this.$refs.select !== undefined) {
        this.$refs.select.hidePopup();
      }
      this.reset();
    }
  }
};
</script>

<style lang="scss"></style>
