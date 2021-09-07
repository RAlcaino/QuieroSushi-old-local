<template>
  <q-dialog v-model="card" persistent>
    <!--<q-card
      class="my-card"
      style="width: 350px; height:270px; border-radius:10px"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          icon="info"
          text-color="blue"
        />
        <span class="q-ml-sm" style="font-size:18px; text-align:center"
          >¡Proximamente esta función estará habilitada!</span
        >
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
        />
      </q-card-actions>
    </q-card>-->

    <q-card
      style="border-radius:10px;width: 700px; max-width: 80vw;overflow:hidden; "
    >
      <q-card-section
        class="row items-center q-pb-none bg-blue"
        style="padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="edit"
          />
          Editar
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="reset()" />
      </q-card-section>
      <q-card-section
        class="row items-center justify-center"
        style="height:500px;"
        :style="sectionStyle"
      >
        <div class="row q-col-gutter-sm justify-center">
          <div class="col-lg-10 col-md-10 col-xs-12 col-sm-12">
            <div
              class="text-h6"
              style="text-align:center; margin-bottom: 10px;"
            >
              <q-icon
                style="padding-bottom:4px"
                name="confirmation_number"
              ></q-icon>
              Datos del cupon
            </div>
            <q-list class="row">
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="item.pieces"
                    outlined
                    rounded
                    dense
                    label="Cantidad de piezas"
                    :min="1"
                    type="number"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="item.price"
                    outlined
                    rounded
                    dense
                    label="Precio normal"
                    type="text"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="item.discounted"
                    outlined
                    rounded
                    dense
                    label="Precio promoción"
                    type="text"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    ref="select"
                    rounded
                    outlined
                    dense
                    :options="$store.getters['auth/getTitles']"
                    :options-dense="true"
                    @input="changeTitles"
                    v-model="titleSelected"
                    class="q-select-s"
                    label="Titulos predeterminados de ayuda"
                    :virtual-scroll-sticky-size-start="80"
                  >
                    <template v-slot:prepend>
                      <q-icon name="title" />
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="titleDetails.shortTitle"
                    color
                    outlined
                    rounded
                    dense
                    label="Titulo corto"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="titleDetails.longTitle"
                    color
                    outlined
                    rounded
                    dense
                    label="Titulo largo"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="item.conditions"
                    outlined
                    rounded
                    label="Condiciones"
                    autogrow
                    type="textarea"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    outlined
                    rounded
                    v-model="item.details"
                    label="Detalles"
                    autogrow
                    type="textarea"
                  />
                </q-item-section>
              </q-item>
              <!--<q-item class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    ref="select"
                    rounded
                    outlined
                    dense
                    :options="comunesFiltered"
                    :options-dense="true"
                    label="Comunas delivery"
                    v-model="comuneSelected"
                    @input="change"
                    @popup-hide="allComunes()"
                    class="q-select-s"
                    style="margin-bottom: 15px;"
                    :virtual-scroll-sticky-size-start="80"
                  >
                    <template v-slot:prepend>
                      <q-icon name="place" />
                    </template>
                    <template v-slot:before-options>
                      <q-item>
                        <q-item-section class="text-grey">
                          <input
                            v-model="comuneSearch"
                            @input="filterFn(comuneSearch)"
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
                            v-model="comuneSearch"
                            @input="filterFn(comuneSearch)"
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
                  @click="addComune()"
                >
                  <q-icon size="20px" name="add" />
                </q-btn>
              </q-item>
              <q-item
                v-if="comunesSelected.length !== 0"
                class="col-lg-7 col-md-7 col-sm-12 col-xs-12"
                style="margin-top:10px"
              >
                <q-item-section>
                  <q-item-label style="font-weight:bold;margin-bottom:10px"
                    >Comunas agregadas:</q-item-label
                  >
                  <q-chip
                    v-for="comune of comunesSelected"
                    :key="comune.value"
                    v-model="comune.flag"
                    removable
                    color="green"
                    text-color="white"
                    icon="place"
                    @remove="deleteComune(comune.value)"
                  >
                    {{ comune.label }}
                  </q-chip>
                </q-item-section>
              </q-item>-->
            </q-list>
          </div>
        </div>
        <q-card-actions align="center">
          <q-btn
            @click="edit()"
            size="sm"
            style="font-size:12px;padding: 0px 15px !important; margin:20px 0"
            rounded
            color="blue"
            >Editar</q-btn
          >
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: [
    "formatNumber",
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling"
  ],
  created() {
    var vue = this;
    this.prod = this.$store.getters["mode/getMode"];
    this.initComunes();
    this.comunesFiltered = this.comunes;
    this.bus.$on("open-edit-coupon", row => {
      this.card = true;
      this.item.id = row.id;
      this.item.title = row.title;
      this.item.discounted = row.discounted;
      this.item.pieces = row.pieces;
      this.item.details = row.details;
      this.item.conditions = row.conditions;
      this.comunesSelected = this.findComunes(row.delivery);
      var qty = this.item.pieces.toString();
      var localName=this.$store.getters["auth/getDataLocal"].name;
      this.currentTitleTemplate.label = row.shortTitle.replaceAll(
        qty,
        "$p"
      );
      this.currentTitleTemplate.label = this.currentTitleTemplate.label.replaceAll(
        localName,
        "$n"
      );
      this.currentTitleTemplate.label2 = row.longTitle.replaceAll(
        qty,
        "$p"
      );
      this.currentTitleTemplate.label2 = this.currentTitleTemplate.label2.replaceAll(
        localName,
        "$n"
      );
      console.log(this.currentTitleTemplate);
      this.item.price = row.price;
    });
  },
  mounted() {
    this.responsiveMode();
  },
  watch: {
    "item.pieces": {
      handler(val) {
        var localName=this.$store.getters["auth/getDataLocal"].name;
        this.titleDetails.shortTitle = this.currentTitleTemplate.label.replaceAll(
          "$p",
          val
        );
        this.titleDetails.shortTitle = this.titleDetails.shortTitle.replaceAll(
          "$n",
          localName
        );
        this.titleDetails.longTitle = this.currentTitleTemplate.label2.replaceAll(
          "$p",
          val
        );
        this.titleDetails.longTitle = this.titleDetails.longTitle.replaceAll(
          "$n",
          localName
        );
      },
      deep: true
    }
  },
  data() {
    return {
      card: false,
      prod: null,
      responsiveMobile: false,
      comunes: [],
      comunesFiltered: [],
      comuneSearch: "",
      comunesSelected: [],
      comuneSelected: {},
      titleSelected: {
        value: null,
        label: "Seleccionar..."
      },
      item: {
        id: null,
        title: "",
        price: null,
        discounted: null,
        pieces: null,
        details: "",
        conditions: ""
      },
      titleDetails: {
        idTitle: null,
        shortTitle: "",
        longTitle: ""
      },
      currentTitleTemplate: {
        value: "",
        label: "",
        label2: ""
      }
    };
  },
  computed: {
    sectionStyle() {
      return {
        overflowY: "scroll"
      };
    }
  },
  methods: {
    reset() {
      this.card = false;
      this.titleSelected = {
        value: null,
        label: "Seleccionar..."
      };
      this.currentTitleTemplate = {
        value: "",
        label: "",
        label2: ""
      };
    },
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
    edit() {
      var data = {
        titulo: this.titleDetails.shortTitle,
        titulo_largo: this.titleDetails.longTitle,
        piezas: this.item.pieces,
        antes: this.item.price,
        despues: this.item.discounted,
        detalles: this.item.details.replaceAll("\n", ".-"),
        condiciones: this.item.conditions.replaceAll("\n", ".-")
        //delivery: this.formatComunes()
      };
      console.log(data);
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("resource.coupons", {
          localId: this.item.id
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
              this.bus.$emit("sync-coupon-edit");
              this.reset();
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
    initComunes() {
      var vue = this;
      vue.comunes = [];
      let each = this.$store.getters["auth/getZones"].comunes.map(function(
        item
      ) {
        let row = {
          value: item.value,
          label: item.label
        };
        vue.comunes.push(row);
      });
      vue.comuneSelected = vue.comunes[0];
    },
    filterFn(val) {
      if (val === "") {
        this.comunesFiltered = this.comunes;
        return;
      }

      const needle = val.toLowerCase();
      this.comunesFiltered = this.comunes.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    change(val) {
      if (val !== null) {
        this.comuneSelected = val;
      }
    },
    allComunes() {
      this.comunesFiltered = this.comunes;
      this.comuneSearch = "";
    },
    addComune() {
      if (
        this.comunesSelected.some(
          item => item.value === this.comuneSelected.value
        )
      ) {
        this.showNotification(
          "La comuna ya encuentra en su lista",
          "negative",
          "error"
        );
      } else {
        this.comunesSelected.push({
          value: this.comuneSelected.value,
          label: this.comuneSelected.label,
          flag: true
        });
      }
    },
    deleteComune(storeId) {
      this.comunesSelected = this.comunesSelected.filter(
        item => item.value !== storeId
      );
    },
    findComunes(comunes) {
      let comunesNew = [];
      let comunesArray = comunes.split(",");
      comunesArray.forEach(each => {
        let el = this.$store.getters["auth/getZones"].comunes.find(
          item2 => item2.label === each
        );
        let row = {
          label: el.label,
          value: el.value
        };
        comunesNew.push(row);
      });
      return comunesNew;
    },
    formatComunes() {
      let result = "";
      this.comunesSelected.forEach(res => {
        result += res.label + ",";
      });
      return result.slice(0, -1);
    },
    changeTitles(val) {
      console.log(val);
      this.currentTitleTemplate = val;
      var localName=this.$store.getters["auth/getDataLocal"].name;
      this.titleDetails.shortTitle = this.currentTitleTemplate.label.replaceAll(
        "$p",
        this.item.pieces
      );
      this.titleDetails.shortTitle = this.titleDetails.shortTitle.replaceAll(
        "$n",
        localName
      );
      this.titleDetails.longTitle = this.currentTitleTemplate.label2.replaceAll(
        "$p",
        this.item.pieces
      );
      this.titleDetails.longTitle = this.titleDetails.longTitle.replaceAll(
        "$n",
        localName
      );
    }
  }
};
</script>

<style lang="scss"></style>
