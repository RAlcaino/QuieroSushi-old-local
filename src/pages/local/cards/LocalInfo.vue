<template>
  <q-card class="card-bg">
    <q-card-section
      class="text-h6"
      style="display: flex; flex-direction:row; justify-content:space-between"
    >
      <div class="text-h6">
        <q-icon style="padding-bottom:4px" name="store"></q-icon>
        Información del local
      </div>
      <div>
        <q-select
          outlined
          rounded
          dense
          :value="currentLocalSelected"
          :options="locals"
          label="Local"
          @input="change"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-list class="row">
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section side @click="openPhotoDialog(dataLocal)">
            <div class="image__local">
              <img
                :src="dataLocal.imagen"
                alt="img-local"
                width="100"
                height="100"
                style="align-self:center; display: block;"
              />
              <div class="overlay__change__image">
                <q-icon size="20px" name="edit" color="white" />
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              color
              outlined
              rounded
              dense
              v-model="dataLocal.nombre"
              label="Nombre del local"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              outlined
              rounded
              dense
              :maxlength="9"
              v-model="dataLocal.telefono"
              label="Teléfono (+56)"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              outlined
              rounded
              dense
              v-model="dataLocal.telefono_notificaciones"
              :maxlength="9"
              label="Teléfono notificaciones (+56)"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              outlined
              rounded
              dense
              v-model="dataLocal.telefono_notificaciones_pagos"
              :maxlength="9"
              label="Teléfono notificaciones pago (+56)"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              outlined
              rounded
              dense
              v-model="dataLocal.region"
              :options="$store.getters['auth/getZones'].regions"
              label="Región"
            >
              <template v-slot:selected-item="scope">
                <span v-if="scope.opt.label !== null"
                  >{{ scope.opt.label.substring(0, 15) }}...</span
                >
                <span v-else>Seleccionar...</span>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              outlined
              rounded
              dense
              v-model="dataLocal.ciudad"
              :options="citiesFiltered"
              label="Ciudad"
            >
              <template v-slot:selected-item="scope">
                <span>{{
                  scope.opt.label.length > 10
                    ? scope.opt.label.substring(0, 15) + "..."
                    : scope.opt.label
                }}</span>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              outlined
              rounded
              dense
              v-model="dataLocal.comuna"
              :options="comunesFilteredForm"
              label="Comuna"
            >
              <template v-slot:selected-item="scope">
                <span>{{
                  scope.opt.label.length > 10
                    ? scope.opt.label.substring(0, 15) + "..."
                    : scope.opt.label
                }}</span>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              outlined
              rounded
              dense
              v-model="dataLocal.direccion"
              label="Dirección"
            />
          </q-item-section>
          <q-btn
            color="primary"
            round
            size="sm"
            style="margin-left: 10px; height:30px;margin-top:6px"
            @click="getLocation()"
          >
            <q-icon size="20px" name="my_location" />
          </q-btn>
        </q-item>
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              outlined
              rounded
              dense
              v-model="dataLocal.local"
              label="N° Local"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <p style="margin-left:10px; color: rgba(0,0,0,0.6)">Mapa</p>
            <GmapMap
              :center="{ lat: +dataLocal.lat, lng: +dataLocal.lng }"
              :zoom="18"
              map-type-id="terrain"
              style="width: 100%; height: 226px; border-radius:10px;"
            >
              <GmapMarker
                v-for="(marker, index) in markers"
                :key="index"
                :position="marker"
                :clickable="true"
              />
            </GmapMap>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        style="margin-bottom:10px"
        rounded
        dense
        class="text-capitalize bg-green text-white"
        @click="updateLocal()"
        >Guardar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ["dataLocal", "localSelected", "openPhotoDialog"],
  inject: [
    "change",
    "setLocalSelected",
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling"
  ],
  data() {
    return {
      markers: [],
      apiKey: process.env.API_GOOGLE,
      baseUrl:
        "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apikeyGoogle}",
      locals: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    currentLocalSelected(){
        this.getMarkers();
        return this.localSelected;
    },
    comunesFilteredForm() {
      var comunesFiltered = this.$store.getters["auth/getZones"].comunes.filter(
        item =>
          item.id_ciudad === this.dataLocal.ciudad.value &&
          item.id_region === this.dataLocal.region.value
      );
      if (
        !comunesFiltered.some(
          item => item.value === this.dataLocal.comuna.value
        ) &&
        comunesFiltered.length !== 0
      ) {
        this.dataLocal.comuna = comunesFiltered[0];
      }
      return comunesFiltered;
    },
    citiesFiltered() {
      var citiesFiltered = this.$store.getters["auth/getZones"].cities.filter(
        item => item.id_region === this.dataLocal.region.value
      );
      if (
        !citiesFiltered.some(
          item => item.value === this.dataLocal.ciudad.value
        ) &&
        citiesFiltered.length !== 0
      ) {
        this.dataLocal.ciudad = citiesFiltered[0];
      }
      return citiesFiltered;
    }
  },
  methods: {
    init() {
      this.formatLocals();
    },
    getLocation() {
      if (
        this.dataLocal.direccion !== null &&
        this.dataLocal.comuna.label !== null &&
        this.dataLocal.ciudad.label !== null &&
        this.dataLocal.region.label !== null
      ) {
        var address =
          this.dataLocal.direccion +
          " " +
          this.dataLocal.comuna.label +
          " " +
          this.dataLocal.ciudad.label +
          " " +
          this.dataLocal.region.label;

        var finalAddress = address.trim().replace(/ /g, "+");
        var url = this.baseUrl.replace("{address}", finalAddress);
        url = url.replace("{apikeyGoogle}", this.apiKey);

        this.$axios
          .get(url)
          .then(response => {
            let location = response.data.results[0].geometry.location;
            this.dataLocal.lat = location.lat;
            this.dataLocal.lng = location.lng;
            this.getMarkers();
          })
          .catch(error => {
            this.errorHandling(error);
          });
      } else {
        console.log("falta informacion");
      }
    },
    updateLocal() {
      var data = this.mapperLocal();
      this.showLoading();
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
            this.$store.commit("auth/setLocalName", this.dataLocal);
            this.formatLocals();
            this.setLocalSelected(this.locals);
            this.hideLoading();
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
    formatLocals() {
      this.locals = [];
      var each = this.$store.getters["auth/getDataLocals"].map(item => {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          cartStatus: item.cartStatus
        };
        this.locals.push(row);
        this.locals.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      });
    },
    mapperLocal() {
      let data = {
        nombre: this.dataLocal.nombre,
        direccion: this.dataLocal.direccion,
        local: this.dataLocal.local,
        lat: this.dataLocal.lat,
        lng: this.dataLocal.lng,
        comuna: this.dataLocal.comuna.label,
        telefono: this.dataLocal.telefono,
        telefono_notificaciones: parseInt(
          this.dataLocal.telefono_notificaciones
        ),
        telefono_notificaciones_pagos: this.dataLocal
          .telefono_notificaciones_pagos,
        ciudad: this.dataLocal.ciudad.label,
        region: this.dataLocal.region.value
      };

      return data;
    },
    getMarkers() {
      this.markers = [];
      let marker = {
        lat: +this.dataLocal.lat,
        lng: +this.dataLocal.lng
      };
      this.markers.push(marker);
    },
    upploadNew(local) {
      this.bus.$emit("upload-photo-local", local.id);
    }
  }
};
</script>

<style></style>
