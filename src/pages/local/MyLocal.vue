<template>
  <q-page
    v-if="dataLocal.nombre !== ''"
    class="q-pa-sm"
    style="padding-bottom:100px"
  >
    <edit-photo></edit-photo>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
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
                v-model="localSelected"
                :options="locals"
                label="Local"
                @input="change"
              />
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side @click="upploadNew(dataLocal)">
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
                    :zoom="16"
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
              @click="updateLocal(true)"
              >Guardar
            </q-btn>
          </q-card-actions>
        </q-card>
        <q-card
          class="card-bg"
          style="width:100%; height: auto; margin-top:15px"
        >
          <q-card-section class="text-h6 ">
            <div class="text-h6 ">
              <q-icon style="padding-bottom:4px" name="schedule"></q-icon>
              Horarios
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row" style="justify-content:center">
              <div
                class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                style="text-align:right"
              >
                <div
                  v-for="dia in dataLocal.semana"
                  :key="dia.dia_semana"
                  style="display: flex;margin-bottom:10px; justify-content:center; flex-wrap:wrap;"
                >
                  <div>
                    <q-chip
                      clickable
                      @click="dia.estado = !dia.estado"
                      :color="dia.estado == true ? 'green' : 'primary'"
                      text-color="white"
                      :icon="dia.estado == true ? 'lock_open' : 'lock'"
                    >
                      {{ dia.estado == true ? "Abierto" : "Cerrado" }}
                    </q-chip>
                  </div>
                  <p
                    style="font-weight:bold; width: 15%; margin:0; padding-top:10px; margin-right: 10px;"
                  >
                    {{ dia.label }}:
                  </p>
                  <q-input
                    :disable="!dia.estado"
                    color
                    outlined
                    rounded
                    dense
                    v-model="dia.hora_apertura"
                    class="input-schedule"
                    style="margin-right:10px"
                    label="Hora apertura"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="dia.hora_apertura" format24h>
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Cerrar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    :disable="!dia.estado"
                    color
                    outlined
                    rounded
                    dense
                    v-model="dia.hora_cierre"
                    class="input-schedule"
                    label="Hora cierre"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="dia.hora_cierre" format24h>
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Cerrar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              style="margin-bottom:10px"
              rounded
              dense
              class="text-capitalize bg-green text-white"
              @click="updateSchedule()"
              >Guardar
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card class="my-card card-bg">
          <q-card-section class="text-h6 ">
            <div class="text-h6 ">
              <q-icon style="padding-bottom:4px" name="face"></q-icon>
              Información del dueño
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.nombre_dueno"
                  label="Nombre del dueño(a)"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.telefono_dueno"
                  :maxlength="9"
                  label="Teléfono"
                />
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <p
                  style="margin-left:10px; margin-bottom:5px;color:rgba(0,0,0,0.6) "
                >
                  Tipo de constitución
                </p>
                <div
                  style="display:flex; flex-direction:row; justify-content:space-between"
                >
                  <q-radio
                    style="color:rgba(0,0,0,0.6) "
                    size="xs"
                    v-model="dataLocal.tipo_constitucion"
                    :val="1"
                    label="Persona Jurídica"
                  />
                  <q-radio
                    style="color:rgba(0,0,0,0.6) "
                    size="xs"
                    v-model="dataLocal.tipo_constitucion"
                    :val="2"
                    label="Persona Natural"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.nombre_legal"
                  label="Representante legal"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.rut_legal"
                  label="RUT Representante legal"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.rut_empresa"
                  label="RUT empresa"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.razon"
                  label="Razón social"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  rounded
                  v-model="dataLocal.giro"
                  label="Giro"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              style="margin-bottom:10px"
              rounded
              dense
              class="text-capitalize bg-green text-white"
              @click="updateLocal(false)"
              >Guardar
            </q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="card-bg" style="margin-top: 15px;">
          <q-card-section
            class="text-h6"
            style="display: flex; flex-direction: row; justify-content: space-between; align-items:center;"
          >
            <div class="text-h6 ">
              <q-icon
                style="padding-bottom:4px"
                name="delivery_dining"
              ></q-icon>
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
                    <!--<q-item dense clickable @click="allOrders()">
                      <q-item-section>Todos</q-item-section>
                    </q-item>-->
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
      </div>
    </div>
  </q-page>
</template>

<script>
import EditPhoto from "./dialogs/EditPhoto.vue";
export default {
  name: "UserProfile",
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  components: {
    EditPhoto
  },
  data() {
    return {
      password_dict: {},
      mapData: "",
      prod: null,
      locals: [],
      localSelected: null,
      dataLocal: {
        id: null,
        imagen: "",
        nombre: "",
        direccion: "",
        local: "",
        lat: "",
        lng: "",
        comuna: "",
        telefono: "",
        telefono_callcenter: "",
        horario: "",
        ciudad: "",
        region: {
          id: ""
        },
        telefono_emp: "",
        rut_empresa: "",
        razon: "",
        giro: "",
        nombre_dueno: "",
        telefono_dueno: "",
        nombre_legal: "",
        rut_legal: "",
        tipo_constitucion: "",
        semana: null,
        telefono_notificaciones: null,
        telefono_notificaciones_pagos: ""
      },
      dataLocalOriginal: {
        id: null,
        imagen: "",
        nombre: "",
        direccion: "",
        local: "",
        lat: "",
        lng: "",
        comuna: "",
        telefono: "",
        telefono_callcenter: "",
        horario: "",
        ciudad: "",
        region: {
          id: ""
        },
        telefono_emp: "",
        rut_empresa: "",
        razon: "",
        giro: "",
        nombre_dueno: "",
        telefono_dueno: "",
        nombre_legal: "",
        rut_legal: "",
        tipo_constitucion: "",
        semana: null,
        telefono_notificaciones: null,
        telefono_notificaciones_pagos: ""
      },
      region: {
        id: null,
        label: ""
      },
      time: "10:56:00",
      markers: [],
      apiKey: process.env.API_GOOGLE,
      baseUrl:
        "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apikeyGoogle}",
      comuneSelected: {},
      comunesSelected: [],
      comuneSearch: "",
      comunes: [],
      comunesFiltered: [],
      comunesSelectedOriginal: []
    };
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.initComunes();
  },
  mounted() {
    this.init();

    this.bus.$on("sync-info-local", () => {
      this.getDataLocal();
    });
  },
  computed: {
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
    sameArrayValidation() {
      if (
        this.comunesSelected.sort().length ===
        this.comunesSelectedOriginal.sort().length
      ) {
        return true;
      }

      return false;
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
      vue.comunesFiltered = this.comunes;
    },
    getDataLocal() {
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("resource.local", {
          localId: this.localSelected.value
        });
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.mapperResponse(response.data.result);
              this.getMarkers();
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
      }
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.getDataLocal();
      }
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
    init() {
      var vue = this;
      this.formatLocals();
      this.localSelected = vue.locals[0];
      this.getDataLocal();
    },
    updateLocal(flag) {
      if (flag) {
        var data = this.mapperLocal();
      } else {
        var data = this.mapperOwner();
      }
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
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
              this.localSelected = this.locals.find(
                item => item.value === this.localSelected.value
              );
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
      }
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
    mapperOwner() {
      var vue = this;
      var data = {
        razon: this.dataLocal.razon,
        giro: this.dataLocal.giro,
        nombre_dueno: this.dataLocal.nombre_dueno,
        telefono_dueno: this.dataLocal.telefono_dueno,
        nombre_legal: this.dataLocal.nombre_legal,
        tipo_constitucion: this.dataLocal.tipo_constitucion
      };

      if (this.dataLocalOriginal.rut_empresa !== this.dataLocal.rut_empresa) {
        data["rut_empresa"] = vue.dataLocal.rut_empresa;
      }

      if (this.dataLocalOriginal.rut_legal !== this.dataLocal.rut_legal) {
        data["rut_legal"] = vue.dataLocal.rut_legal;
      }
      return data;
    },
    mapperResponse(data) {
      this.dataLocal = {
        ...data,
        id: data.id_local,
        imagen: data.foto1,
        comuna: this.$store.getters["auth/getZones"].comunes.find(
          item => item.value === data.comuna.id
        ),
        telefono_notificaciones: data.telefono_notificaciones.toString(),
        ciudad: this.$store.getters["auth/getZones"].cities.find(
          item => item.value === data.ciudad.id
        ),
        region: {
          value: data.region.id,
          label: data.region.nombre
        },
        semana: this.weekStructure(data.semana)
      };

      this.dataLocalOriginal = { ...this.dataLocal };
      this.comunesSelected = this.findComunes(data.comunas_delivery);
      this.comunesSelectedOriginal = [...this.comunesSelected];
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

        if (!this.prod) {
          setTimeout(() => {}, 3000);
        } else {
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
        }
      } else {
        console.log("falta informacion");
      }
    },
    getMarkers() {
      this.markers = [];
      let marker = {
        lat: +this.dataLocal.lat,
        lng: +this.dataLocal.lng
      };
      this.markers.push(marker);
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
    formatLocals() {
      var vue = this;
      vue.locals = [];
      var each = this.$store.getters["auth/getDataLocals"].map(function(item) {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          cartStatus: item.cartStatus
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
    updateSchedule() {
      let week = this.dataLocal.semana;
      let weekWithoutLabel = [];
      let eachday = week.map(function(item) {
        if (item.estado) {
          let day = {
            dia_semana: item.dia_semana,
            hora_apertura: item.hora_apertura,
            hora_cierre: item.hora_cierre
          };
          weekWithoutLabel.push(day);
        }
      });
      let data = {
        semana: weekWithoutLabel
      };
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
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
    weekStructure(semana) {
      let week = [];
      let result = this.uniqueDayWeek(semana);
      let eachday = result.map(function(item) {
        let day = {
          dia_semana: item.dia_semana,
          hora_apertura: item.hora_apertura.substr(0, 5),
          hora_cierre: item.hora_cierre.substr(0, 5),
          label: item.label,
          estado: true
        };
        week.push(day);
      });

      for (let index = 0; index < 7; index++) {
        if (!week.some(el => el.dia_semana === index)) {
          week.push({
            dia_semana: index,
            hora_apertura: "00:00",
            hora_cierre: "00:00",
            label: this.weekDay(index),
            estado: false
          });
        }
      }

      week.sort(function(a, b) {
        if (a.dia_semana > b.dia_semana) {
          return 1;
        }
        if (a.dia_semana < b.dia_semana) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      return week;
    },
    weekDay(day) {
      if (day === 0) {
        return "Domingo";
      } else if (day === 1) {
        return "Lunes";
      } else if (day === 2) {
        return "Martes";
      } else if (day === 3) {
        return "Miercoles";
      } else if (day === 4) {
        return "Jueves";
      } else if (day === 5) {
        return "Viernes";
      } else if (day === 6) {
        return "Sabado";
      }
    },
    setPassword() {
      let data = {
        contrasena_actual: this.password_dict.current_password,
        contrasena_nueva: this.password_dict.new_password
      };
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("change.password", {
          userId: this.$store.getters["auth/getDataUser"].id
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
    uniqueDayWeek(week) {
      const uniqueWeek = [];

      for (var i = 0; i < week.length; i++) {
        const item = week[i];

        if (uniqueWeek.length !== 0) {
          if (!uniqueWeek.some(el => el.dia_semana === item.dia_semana)) {
            uniqueWeek.push(item);
          }
        } else {
          uniqueWeek.push(item);
        }
      }
      return uniqueWeek;
    },
    upploadNew(local) {
      this.bus.$emit("upload-photo-local", local.id);
    },
    edit() {
      this.showLoading();
      let data = {
        comunas_delivery: this.formatComunes()
      };
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
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
              this.comunesSelectedOriginal=[...this.comunesSelected];
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
    undoChangesComunes() {
      this.comunesSelected=[];
      this.comunesSelectedOriginal.forEach((item)=>{
        item.flag=true;
        this.comunesSelected.push(item);
      });
    }
  }
};
</script>

<style lang="scss">
.card-bg {
  background-color: white;
  border-radius: 10px;
}
.input-schedule {
  width: 25%;
}

@media screen and (max-width: 500px) {
  .input-schedule {
    width: 30%;
  }
}
.image__local {
  margin: 0 auto;
  width: 100px;
  height: 100px;
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
</style>
