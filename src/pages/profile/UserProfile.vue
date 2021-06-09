<template>
  <q-page
    v-if="dataLocal.nombre !== ''"
    class="q-pa-sm"
    style="padding-bottom:100px"
  >
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
                <q-item-section side>
                  <q-avatar size="100px">
                    <img
                      :src="'http://quierosushi.cl/locales/' + dataLocal.imagen"
                    />
                  </q-avatar>
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
                    v-model="dataLocal.telefono_callcenter"
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
                    v-model="dataLocal.telefono_emp"
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
                    v-model="dataLocal.telefono"
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
                    :options="comunesFiltered"
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
              class="text-capitalize bg-primary text-white"
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
                <div v-for="dia in dataLocal.semana" :key="dia.dia_semana" style="display: flex;margin-bottom:10px;">
                  <p
                    style="width: 25%; margin:0; padding-top:10px; margin-right: 10px;"
                  >
                    {{dia.label}}:
                  </p>
                  <q-input
                    color
                    outlined
                    rounded
                    dense
                    v-model="dia.hora_apertura"
                    mask="fulltime" :rules="['fulltime']"
                    class="input-schedule" style="margin-right:10px"
                    label="Hora apertura"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="dia.hora_apertura" format24h with-seconds>
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
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
                    color
                    outlined
                    rounded
                    dense
                    v-model="dia.hora_cierre"
                    mask="fulltime" :rules="['fulltime']"
                    
                    class="input-schedule"
                    label="Hora cierre"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="dia.hora_cierre" format24h with-seconds>
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
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
              class="text-capitalize bg-primary text-white"
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
              class="text-capitalize bg-primary text-white"
              @click="updateLocal(false)"
              >Guardar
            </q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="card-bg" style="margin-top: 15px;">
          <q-card-section class="text-h6 ">
            <div class="text-h6 ">
              <q-icon style="padding-bottom:4px" name="vpn_key"></q-icon>
              Cambiar contraseña
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  rounded
                  v-model="password_dict.current_password"
                  label="Contraseña actual"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  rounded
                  v-model="password_dict.new_password"
                  label="Contraseña nueva"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  rounded
                  v-model="password_dict.confirm_new_password"
                  label="Confirmar contraseña"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              style="margin-bottom:10px; margin-top:8px"
              rounded
              dense
              class="text-capitalize bg-primary text-white"
              >Guardar
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "UserProfile",
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  data() {
    return {
      user_details: {},
      password_dict: {},
      mapData: "",
      model: null,
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
      shape: null,
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
        semana:null
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
        semana:null
      },
      region: {
        id: null,
        label: ""
      },
      time: "10:56:00",
      markers: [],
      apiKey: this.apiKeyGoogle,
      baseUrl:
        "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apikeyGoogle}"
    };
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  mounted() {
    this.init();
  },
  computed: {
    comunesFiltered() {
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
              console.log(this.dataLocal);
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
        telefono_callcenter: this.dataLocal.telefono_callcenter,
        ciudad: this.dataLocal.ciudad.label,
        region: this.dataLocal.region.value,
        telefono_emp: this.dataLocal.telefono_emp
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
      this.dataLocal.id = data.id_local;
      this.dataLocal.imagen = data.imagen;
      this.dataLocal.nombre = data.nombre;
      this.dataLocal.direccion = data.direccion;
      this.dataLocal.local = data.local;
      this.dataLocal.lat = data.lat;
      this.dataLocal.lng = data.lng;
      this.dataLocal.comuna = this.$store.getters["auth/getZones"].comunes.find(
        item => item.value === data.comuna.id
      );
      this.dataLocal.telefono = data.telefono;
      this.dataLocal.telefono_callcenter = data.telefono_callcenter;
      this.dataLocal.horario = data.horario;
      this.dataLocal.ciudad = this.$store.getters["auth/getZones"].cities.find(
        item => item.value === data.ciudad.id
      );
      this.dataLocal.region = {
        value: data.region.id,
        label: data.region.nombre
      };
      this.dataLocal.telefono_emp = data.telefono_emp;
      this.dataLocal.rut_empresa = data.rut_empresa;
      this.dataLocal.razon = data.razon;
      this.dataLocal.giro = data.giro;
      this.dataLocal.nombre_dueno = data.nombre_dueno;
      this.dataLocal.telefono_dueno = data.telefono_dueno;
      this.dataLocal.nombre_legal = data.nombre_legal;
      this.dataLocal.rut_legal = data.rut_legal;
      this.dataLocal.tipo_constitucion = data.tipo_constitucion;
      this.dataLocal.semana = data.semana;

      //-----

      this.dataLocalOriginal.id = data.id_local;
      this.dataLocalOriginal.imagen = data.imagen;
      this.dataLocalOriginal.nombre = data.nombre;
      this.dataLocalOriginal.direccion = data.direccion;
      this.dataLocalOriginal.local = data.local;
      this.dataLocalOriginal.lat = data.lat;
      this.dataLocalOriginal.lng = data.lng;
      this.dataLocalOriginal.comuna = this.$store.getters[
        "auth/getZones"
      ].comunes.find(item => item.value === data.comuna.id);
      this.dataLocalOriginal.telefono = data.telefono;
      this.dataLocalOriginal.telefono_callcenter = data.telefono_callcenter;
      this.dataLocalOriginal.horario = data.horario;
      this.dataLocalOriginal.ciudad = this.$store.getters[
        "auth/getZones"
      ].cities.find(item => item.value === data.ciudad.id);
      this.dataLocalOriginal.region = {
        value: data.region.id,
        label: data.region.nombre
      };
      this.dataLocalOriginal.telefono_emp = data.telefono_emp;
      this.dataLocalOriginal.rut_empresa = data.rut_empresa;
      this.dataLocalOriginal.razon = data.razon;
      this.dataLocalOriginal.giro = data.giro;
      this.dataLocalOriginal.nombre_dueno = data.nombre_dueno;
      this.dataLocalOriginal.telefono_dueno = data.telefono_dueno;
      this.dataLocalOriginal.nombre_legal = data.nombre_legal;
      this.dataLocalOriginal.rut_legal = data.rut_legal;
      this.dataLocalOriginal.tipo_constitucion = data.tipo_constitucion;
      this.dataLocalOriginal.semana = data.semana;
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
        console.log(url);

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
      let week=this.dataLocal.semana;
      let weekWithoutLabel=[];
      let eachday=week.map(function(item){
        let day={
          dia_semana:item.dia_semana,
          hora_apertura:item.hora_apertura,
          hora_cierre:item.hora_cierre
        }
        weekWithoutLabel.push(day);
      });
      let data={
        semana:weekWithoutLabel
      }
      console.log(data);
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
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
