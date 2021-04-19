<template>
  <q-page class="q-pa-sm" style="background:white; padding-bottom:125px">
    <the-aditionals :localName="local.label"></the-aditionals>
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="confirmation_number" />
      <q-toolbar-title :style="FontSize"> Cupones</q-toolbar-title>
      <q-btn flat round dense icon="sync" class="q-mr-xs" @click="sync(true)" />
    </q-toolbar>

    <div
      style="padding-top:25px; width: 90% !important; margin:0 auto;"
      class="fit row wrap justify-between items-start content-start"
    >
      <div class="labels-available">
        <p style="margin-bottom:0; text-align:left">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="20px"
            name="local_activity"
          />Destacados: <strong>{{ availableStandOut }}</strong> disponibles
        </p>
        <p style="text-align:left">
          <q-icon
            style="margin-right:3px;padding-bottom:4px"
            size="20px"
            name="arrow_upward"
          />Subir: <strong>{{ availableGoUp }}</strong> disponibles
        </p>
      </div>
      <q-btn-dropdown
        v-if="locals.length > 1"
        color="blacklight"
        rounded
        outline
        label="Sucursales"
        icon="store"
        class="dropdown-style"
      >
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                <input
                  v-model="localFilter"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="item in getLocals"
            :key="item.value"
            clickable
            v-close-popup
            @click="findLocal(item)"
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div class="fit column no-wrap justify-center items-center content-center">
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="data.length === 0"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron cupones
        </p>
      </div>
      <q-list
        v-if="data.length !== 0"
        bordered
        class="rounded-borders"
        style="width:90%; border-radius:20px"
      >
        <q-item-label
          header
          class="fit row no-wrap justify-between items-start content-center"
        >
          <div style="padding-top:8px">
            Mis cupones en: <strong>{{ local.label }}</strong>
          </div>
          <q-btn
            class="gt-sm"
            color="green"
            rounded
            size="sm"
            @click="dialogAditionals()"
          >
            <q-icon style="margin-right:5px" size="20px" name="shopping_cart" />
            <div style="font-size:12px">Adicionales</div>
          </q-btn>
          <q-btn
            class="lt-md"
            color="green"
            round
            size="sm"
            @click="dialogAditionals()"
          >
            <q-icon size="20px" name="shopping_cart" />
          </q-btn>
        </q-item-label>

        <div v-for="(item, index) of getData" :key="item.id">
          <q-item>
            <q-item-section avatar top>
              <q-toggle
                v-model="item.status"
                false-value="pendiente"
                true-value="activo"
                color="green"
                @input="changeStatus(item)"
              />
            </q-item-section>

            <q-item-section center class="col-2 gt-xs">
              <img
                :src="item.image"
                alt="img-sushi"
                width="50"
                height="50"
                style="align-self:center;border-radius:50px"
              />
            </q-item-section>

            <q-item-section center>
              <q-item-label>
                <span class="text-weight-medium">{{ item.title }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section center side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-sm"
                  color="amber-14"
                  rounded
                  size="sm"
                  @click="dialogStandOut()"
                >
                  <q-icon
                    style="margin-right:5px"
                    size="20px"
                    name="local_activity"
                  />
                  <div style="font-size:12px">Destacar</div>
                </q-btn>
                <q-btn
                  class="gt-sm"
                  color="primary"
                  rounded
                  size="sm"
                  @click="dialogGoUp()"
                >
                  <q-icon
                    style="margin-right:5px"
                    size="20px"
                    name="arrow_upward"
                  />
                  <div style="font-size:12px">Subir</div>
                </q-btn>
                <q-btn
                  class="gt-sm"
                  color="blue"
                  rounded
                  size="sm"
                  @click="dialogEdit(item)"
                >
                  <q-icon style="margin-right:5px" size="20px" name="edit" />
                  <div style="font-size:12px">Editar</div>
                </q-btn>
                <q-btn
                  class="lt-md"
                  size="12px"
                  flat
                  dense
                  round
                  icon="more_vert"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable @click="dialogStandOut()" v-close-popup>
                        <q-item-section>Destacar</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable @click="dialogGoUp()" v-close-popup>
                        <q-item-section>Subir</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable @click="dialogEdit(item)" v-close-popup>
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced v-if="data.length !== index + 1" />
        </div>
      </q-list>
      <q-pagination
        v-if="data.length > 6"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        color="primary"
        input
      />
    </div>
  </q-page>
</template>

<script>
import TheAditionals from "./dialogs/TheAditionals.vue";

export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  components: {
    TheAditionals
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  mounted() {
    var vue = this;
    var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
      let row = {
        value: item.id,
        label: item.name
      };
      vue.locals.push(row);
    });

    this.local.value = this.$store.getters["auth/getDataLocal"].id;
    this.local.label = this.$store.getters["auth/getDataLocal"].name;
    this.sync(true);
    this.responsiveMode();

    this.bus.$on("sync-coupons", () => {
      this.sync(false);
    });
  },
  computed: {
    getData() {
      return this.data.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.data.length / 6);
    },
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    },
    getLocals() {
      let filteredLocals = this.locals.filter(item => {
        return item.label
          .toLowerCase()
          .includes(this.localFilter.toLowerCase());
      });
      let orderedLocals = filteredLocals.sort((a, b) => {
        return b.label - a.label;
      });
      return orderedLocals;
    }
  },
  data() {
    return {
      page: 1,
      perPage: 6,
      prod: null,
      responsiveMobile: false,
      value: true,
      availableStandOut: 0,
      availableGoUp: 0,
      locals: [],
      local: {
        value: null,
        label: ""
      },
      localFilter: "",
      data: [],
      result: {
        localId: 1,
        available: {
          goUp: 0,
          standOut: 0
        },
        coupons: [
          {
            id: 1,
            status: "pendiente",
            title: "Cupon de 50 piezas por $14.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 2,
            status: "activo",
            title: "Cupon de 50 piezas por $20.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 3,
            status: "pendiente",
            title: "Cupon de 10 piezas por $25.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 4,
            status: "activo",
            title: "Cupon de 30 piezas por $50.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 5,
            status: "activo",
            title: "Cupon de 20 piezas por $40.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 6,
            status: "pendiente",
            title: "Cupon de 50 piezas por $14.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 10,
            status: "activo",
            title: "Cupon de 50 piezas por $20.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 11,
            status: "activo",
            title: "Cupon de 20 piezas por $40.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 12,
            status: "pendiente",
            title: "Cupon de 50 piezas por $14.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          },
          {
            id: 13,
            status: "activo",
            title: "Cupon de 50 piezas por $20.000",
            image:
              "https://media.istockphoto.com/photos/hot-crispy-deep-fried-sushi-rolls-picture-id1006373634"
          }
        ]
      }
    };
  },
  methods: {
    responsiveMode() {
      var responsive = window.matchMedia("(max-width: 900px)");
      var vue = this;

      if (screen.width < 900) {
        vue.responsiveMobile = true;
      }

      responsive.addListener(function(event) {
        if (event.matches) {
          vue.responsiveMobile = true;
        } else {
          vue.responsiveMobile = false;
        }
      });
    },
    sync(flag) {
      if (flag) {
        this.showLoading();
      }
      if (!this.prod) {
        setTimeout(() => {
          this.data = this.result.coupons;
          this.availableGoUp = this.result.available.goUp;
          this.availableStandOut = this.result.available.standOut;
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("coupons", {
          localId: this.local.value
        });
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.hideLoading();
            if (response.data.status === "success") {
              var r = response.data.result;
              this.data = r.coupons;
              this.availableGoUp = r.available.goUp;
              this.availableStandOut = r.available.standOut;
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    changeStatus(item) {
      console.log(item.id);
      console.log(item.status);

      let data = {
        couponID: item.id,
        status: item.status
      };

      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.sync(false);
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"](
          "coupon.change.status"
        );
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.sync(false);
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.sync(false);
            this.errorHandling(error);
          });
      }
    },
    dialogStandOut() {
      if (this.availableStandOut == 0) {
        this.bus.$emit("open-aditionals", "just-one");
      } else {
        //do something
      }
    },
    dialogGoUp() {
      if (this.availableGoUp == 0) {
        this.bus.$emit("open-aditionals", "just-two");
      } else {
        //do something
      }
    },
    dialogAditionals() {
      this.bus.$emit("open-aditionals", "all");
    },
    dialogEdit(item) {
      console.log(item);
    },
    findLocal(local) {
      this.local.value = local.value;
      this.local.label = local.label;
      this.localFilter = "";
      this.sync(true);
    }
  }
};
</script>

<style lang="scss">
@media screen and (max-width: 500px) {
  .labels-available {
    width: 100%;
    p {
      text-align: center !important;
    }
  }
  .dropdown-style {
    margin: 0 auto !important;
    margin-bottom: 20px !important;
  }
}
</style>
