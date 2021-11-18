<template>
  <base-page title="Cupones" icon="category" :sync="sync" :toolbar="true">
    <the-aditionals :localName="localSelected.label"></the-aditionals>
    <the-edit></the-edit>
    <edit-photo></edit-photo>
    <div
      style="padding-top:25px; margin:0 auto !important;"
      class="fit row wrap justify-between items-start content-start container-q-select"
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
      <div class="c-q-select-responsive" v-if="locals.length > 1">
        <q-select
          rounded
          outlined
          dense
          :options="localsFilter"
          :options-dense="true"
          hide-hint
          label="Locales"
          v-model="localSelected"
          @input="change"
          @popup-hide="allLocals()"
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
      </div>
    </div>

    <div class="fit column no-wrap justify-center items-center content-center">
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="data.length === 0 && searching === false"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron cupones
        </p>
      </div>
      <div
        style="margin-top:100px;border-radius:100%; overflow:hidden"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll2.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <q-list
        v-if="data.length !== 0 && searching === false"
        bordered
        class="rounded-borders"
        style="width:90%; border-radius:20px"
      >
        <q-item-label
          header
          class="fit row no-wrap justify-between items-start content-center"
        >
          <div style="padding-top:8px">
            Mis cupones en: <strong>{{ localSelected.label }}</strong>
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
                color="green"
                @input="changeStatus(item)"
              />
            </q-item-section>

            <q-item-section
              v-if="$store.getters['auth/getDataUser'].role === 'God'"
              center
              class="col-1 gt-xs"
            >
              <p style="margin-bottom:5px; font-weight:bold">#{{ item.id }}</p>
            </q-item-section>

            <q-item-section
              center
              class="col-2 gt-xs"
              @click="upploadNew(item)"
            >
              <div class="image__coupon">
                <img
                  :src="item.image"
                  alt="img-sushi"
                  width="50"
                  height="50"
                  style="align-self:center; display: block;"
                />
                <div class="overlay__change__image">
                  <q-icon size="20px" name="edit" color="white" />
                </div>
              </div>
            </q-item-section>

            <q-item-section center>
              <q-item-label>
                <span class="text-weight-medium">{{ item.title }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section center v-if="item.position">
              <span class="material-icons" style="font-size: 16px;">
                trending_up
              </span>
              <p
                style="margin-bottom:5px; font-weight:bold; text-align:center;"
              >
                Posición: {{ item.position }}
              </p>
            </q-item-section>

            <q-item-section center side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-sm"
                  color="amber-14"
                  rounded
                  size="sm"
                  @click="dialogStandOut(item)"
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
                  @click="dialogGoUp(item)"
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
                      <q-item
                        clickable
                        @click="dialogStandOut(item)"
                        v-close-popup
                      >
                        <q-item-section>Destacar</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable @click="dialogGoUp(item)" v-close-popup>
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
        v-if="data.length > 6 && searching === false"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        color="primary"
        input
      />
    </div>
  </base-page>
</template>

<script>
import TheAditionals from "./dialogs/TheAditionals.vue";
import TheEdit from "./dialogs/TheEdit.vue";
import EditPhoto from "./dialogs/EditPhoto.vue";
import BasePage from "../../components/bases/BasePage.vue";

export default {
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals"
  ],
  components: {
    TheAditionals,
    TheEdit,
    EditPhoto,
    BasePage
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("sync-coupons", () => {
      this.sync();
    });
  },
  mounted() {
    this.initLocals();
    this.localsFilter = this.locals;

    this.sync(false);
    this.responsiveMode();

    this.bus.$on("sync-coupon-edit", () => {
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
      searching: false,
      flag: false,
      page: 1,
      perPage: 6,
      prod: null,
      responsiveMobile: false,
      value: true,
      availableStandOut: 0,
      availableGoUp: 0,
      locals: [],
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
      },
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
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
      } else {
        this.flag = true;
        this.searching = true;
      }
      if (!this.prod) {
        setTimeout(() => {
          this.data = this.result.coupons;
          this.availableGoUp = this.result.available.goUp;
          this.availableStandOut = this.result.available.standOut;
          if (flag) {
            this.hideLoading();
          } else {
            this.flag = false;
            this.searching = false;
          }
        }, 3000);
      } else {
        //console.log(this.localSelected);
        var url = this.$store.getters["routes/getRoute"]("resource.coupons", {
          localId: this.localSelected.value
        });
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (flag) {
              this.hideLoading();
            } else {
              this.flag = false;
              this.searching = false;
            }
            if (response.data.status === "success") {
              var r = response.data.result;
              this.data = r.coupons;
              var tempData = [];
              let map = this.data.map(item => {
                let row = {
                  id: item.id,
                  image: item.image,
                  status: this.realStatus(item.status),
                  title: item.title,
                  pieces: item.pieces,
                  price: item.price,
                  discounted: item.discounted,
                  details: item.details.replaceAll(".-", "\n"),
                  conditions: item.conditions.replaceAll(".-", "\n"),
                  shortTitle: item.shortTitle,
                  longTitle: item.longTitle,
                  delivery: item.delivery,
                  position: item.position
                };
                tempData.push(row);
              });
              this.data = tempData;
              this.availableGoUp = r.available.goUp;
              this.availableStandOut = r.available.standOut;
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            if (flag) {
              this.hideLoading();
            } else {
              this.flag = false;
              this.searching = false;
            }
            this.errorHandling(error);
          });
      }
    },
    realStatus(status) {
      if (status === "pendiente") {
        return false;
      }
      if (status === "activo" || status === "cerrado") {
        return true;
      }
    },
    changeStatus(item) {
      let data = {
        estado: ""
      };
      if (item.status == true) {
        if (this.$store.getters["auth/getDataLocal"].cartStatus == 0) {
          data.estado = "cerrado";
        } else {
          data.estado = "activo";
        }
      } else {
        data.estado = "pendiente";
      }

      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.sync(true);
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("resource.coupons", {
          localId: item.id
        });
        this.$axios
          .put(url, data, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.sync(true);
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.sync(true);
            this.errorHandling(error);
          });
      }
    },
    dialogStandOut(item) {
      if (this.availableStandOut == 0) {
        this.bus.$emit("open-aditionals", "");
      } else {
        this.showLoading();
        if (!this.prod) {
          setTimeout(() => {
            this.sync(true);
          }, 3000);
        } else {
          var url = this.$store.getters["routes/getRoute"]("coupon.stand.out");
          this.$axios
            .post(
              url,
              {
                id_local: this.localSelected.value,
                id_cupon: item.id
              },
              {
                headers: {
                  Authorization: this.$store.getters["auth/getToken"]
                }
              }
            )
            .then(response => {
              if (response) {
                this.hideLoading();
                this.Swal.fire({
                  text: "Cupón Destacado",
                  icon: "success",
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#21ba45",
                  timer: 5000,
                  timerProgressBar: true
                });
                this.sync();
              }
            })
            .catch(error => {
              this.sync(true);
              this.errorHandling(error);
            });
        }
      }
    },
    dialogGoUp(item) {
      if (this.availableGoUp == 0) {
        this.bus.$emit("open-aditionals");
      } else {
        this.showLoading();
        if (!this.prod) {
          setTimeout(() => {
            this.sync(true);
          }, 3000);
        } else {
          var url = this.$store.getters["routes/getRoute"]("coupon.go.up");
          this.$axios
            .post(
              url,
              {
                id_local: this.localSelected.value,
                id_cupon: item.id
              },
              {
                headers: {
                  Authorization: this.$store.getters["auth/getToken"]
                }
              }
            )
            .then(response => {
              if (response) {
                this.hideLoading();
                this.Swal.fire({
                  text: "El cupón esta en la posición N° 1",
                  icon: "success",
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#21ba45",
                  timer: 5000,
                  timerProgressBar: true
                });
                this.sync();
              }
            })
            .catch(error => {
              this.sync(true);
              this.errorHandling(error);
            });
        }
      }
    },
    dialogAditionals() {
      this.bus.$emit("open-aditionals");
    },
    dialogEdit(item) {
      this.bus.$emit("open-edit-coupon", item);
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
        this.localSelected = { ...val };
        this.sync(false);
        this.$store.commit("auth/setCurrentLocal", {
          id: val.value,
          name: val.name,
          image: val.image,
          commune: val.commune,
          cartStatus: val.cartStatus
        });
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    initLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      if (this.$store.getters["auth/getDataLocal"].id === -1) {
        this.localSelected.value = this.locals[0].value;
        this.localSelected.image = this.locals[0].image;
        this.localSelected.commune = this.locals[0].commune;
        this.localSelected.name = this.locals[0].name;
        this.localSelected.label =
          this.localSelected.name + ", " + this.localSelected.commune;
        this.localSelected.cartStatus = this.locals[0].cartStatus;

        this.$store.commit("auth/setCurrentLocal", {
          id: this.localSelected.value,
          name: this.localSelected.name,
          image: this.localSelected.image,
          commune: this.localSelected.commune,
          cartStatus: this.localSelected.cartStatus
        });
      } else {
        this.localSelected.value = this.$store.getters["auth/getDataLocal"].id;
        this.localSelected.image = this.$store.getters[
          "auth/getDataLocal"
        ].image;
        this.localSelected.commune = this.$store.getters[
          "auth/getDataLocal"
        ].commune;
        this.localSelected.name = this.$store.getters["auth/getDataLocal"].name;
        this.localSelected.label =
          this.localSelected.name + ", " + this.localSelected.commune;

        this.localSelected.cartStatus = this.$store.getters[
          "auth/getDataLocal"
        ].cartStatus;
      }
    },
    upploadNew(coupon) {
      this.bus.$emit(
        "open-upload-photo",
        coupon,
        this.$store.getters["auth/getDataLocal"].id
      );
    }
  }
};
</script>

<style lang="scss">
.container-q-select {
  width: 90% !important;
}
.q-select-coupon {
  margin-right: 46px;
}

.image__coupon {
  margin: 0 auto;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.overlay__change__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.overlay__change__image:hover {
  opacity: 1;
}

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
  .container-q-select {
    margin-left: 0 !important;
    width: 100% !important;
  }
  .c-q-select-responsive {
    margin: 0 auto !important;
  }
  .q-select-coupon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
