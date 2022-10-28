<template>
  <q-card class="card-bg" style="margin-top: 15px;">
    <q-card-section
      class="text-h6"
      style="display: flex; flex-direction: row; justify-content: space-between; align-items:center;"
    >
      <div class="text-h6 ">
        <q-icon style="padding-bottom:4px" name="delivery_dining"></q-icon>
        Comunas Delivery
      </div>
      <q-btn
        v-if="!sameArrayValidation"
        round
        dense
        flat
        color="primary"
        icon="undo"
        style="margin-left: 5px"
        @click="undoChangesComunes()"
      ></q-btn>
    </q-card-section>
    <q-card-section
      class="q-pa-sm row"
      style="display: flex; flex-direction: column; justify-content: center; align-items:center;"
    >
      <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
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
            @input="changeComune"
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
        class="col-lg-8 col-md-8 col-sm-12 col-xs-12"
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
      </q-item>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        style="margin-bottom:10px; margin-top:8px"
        rounded
        dense
        @click="edit()"
        class="text-capitalize bg-green text-white"
        >Guardar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ["dataLocal", "localSelected"],
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.data={...this.dataLocal};
    this.initComunes();

    this.bus.$on("sync-communes", (data) => {
      this.data={...data};
      this.initComunes();
    });
  },
  data() {
    return {
      comuneSelected: {},
      comunesSelected: [],
      comuneSearch: "",
      comunes: [],
      comunesFiltered: [],
      comunesSelectedOriginal: [],
      data: {}
    };
  },
  computed: {
    sameArrayValidation() {
      if (
        this.comunesSelected.sort().length ===
        this.comunesSelectedOriginal.sort().length
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    initComunes() {
      this.comunes = [];
      this.comunesSelected = [];
      this.comunesSelectedOriginal = [];
      let each = this.$store.getters["auth/getZones"].comunes.map(item => {
        let row = {
          value: item.value,
          label: item.label
        };
        this.comunes.push(row);
      });
      this.comuneSelected = this.comunes[0];
      this.comunesFiltered = [...this.comunes];
      this.comunesSelected = this.findComunes(this.data.comunas_delivery);
      this.comunesSelectedOriginal = [...this.comunesSelected];
    },
    changeComune(val) {
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
      if (comunes !== null) {
        let comunesArray = comunes.split(",");
        comunesArray.forEach(each => {
          let el = this.$store.getters["auth/getZones"].comunes.find(
            item2 => item2.label === each
          );
          let row = {
            label: el.label,
            value: el.value,
            flag: true
          };
          comunesNew.push(row);
        });
      }
      return comunesNew;
    },
    formatComunes() {
      let result = "";
      this.comunesSelected.forEach(res => {
        result += res.label + ",";
      });
      return result.slice(0, -1);
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
    edit() {
      this.showLoading();
      let data = {
        comunas_delivery: this.formatComunes()
      };
      var url = this.$store.getters["routes/getRoute"]("resource.local", {
        localId: this.localSelected.value
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
            this.comunesSelectedOriginal = [...this.comunesSelected];
          } else {
            this.hideLoading();
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.hideLoading();
          this.errorHandling(error);
        });
    },
    undoChangesComunes() {
      this.comunesSelected = [];
      this.comunesSelectedOriginal.forEach(item => {
        item.flag = true;
        this.comunesSelected.push(item);
      });
    }
  }
};
</script>

<style></style>
