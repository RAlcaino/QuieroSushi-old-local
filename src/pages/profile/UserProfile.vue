<template>
  <q-page class="q-pa-sm" style="padding-bottom:100px">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg">
          <q-card-section class="text-h6" style="display: flex; flex-direction:row; justify-content:space-between">
            <div class="text-h6">
              <q-icon style="padding-bottom:4px" name="store"></q-icon>
              Información del local
            </div>
            <div>
              <q-select
                outlined
                rounded
                dense
                v-model="model"
                :options="options"
                label="Local"
              />
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
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
                    v-model="user_details.user_name"
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
                    v-model="user_details.email"
                    label="Teléfono Principal"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    outlined
                    rounded
                    dense
                    v-model="user_details.first_name"
                    label="Teléfono Whatsapp"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    outlined
                    rounded
                    dense
                    v-model="user_details.last_name"
                    label="Teléfono Secundario"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    type="textarea"
                    outlined
                    rounded
                    v-model="user_details.last_name"
                    label="Horario de Atención"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-select
                    outlined
                    rounded
                    dense
                    v-model="model"
                    :options="options"
                    label="Región"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-select
                    outlined
                    rounded
                    dense
                    v-model="model"
                    :options="options"
                    label="Ciudad"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                <q-item-section>
                  <q-select
                    outlined
                    rounded
                    dense
                    v-model="model"
                    :options="options"
                    label="Comuna"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    outlined
                    rounded
                    dense
                    v-model="user_details.city"
                    label="Dirección"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    outlined
                    rounded
                    dense
                    v-model="user_details.post_code"
                    label="N° Local"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <p style="margin-left:10px; color: rgba(0,0,0,0.6)">Mapa</p>
                  <div
                    id="myMap"
                    class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    style="height: 172px"
                  ></div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn style="margin-bottom:10px"  rounded dense class="text-capitalize bg-primary text-white"
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
                  v-model="password_dict.current_password"
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
                  v-model="password_dict.new_password"
                  label="Teléfono"
                />
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <p style="margin-left:10px; margin-bottom:5px;color:rgba(0,0,0,0.6) ">Tipo de constitución</p>
                <div style="display:flex; flex-direction:row; justify-content:space-between">
                  <q-radio style="color:rgba(0,0,0,0.6) " size="xs" v-model="shape" val="line" label="Persona Jurídica" />
                  <q-radio style="color:rgba(0,0,0,0.6) " size="xs" v-model="shape" val="rectangle" label="Persona Natural" />
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
                  v-model="password_dict.new_password"
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
                  v-model="password_dict.new_password"
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
                  v-model="password_dict.new_password"
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
                  v-model="password_dict.new_password"
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
                  v-model="password_dict.new_password"
                  label="Giro"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn style="margin-bottom:10px" rounded dense class="text-capitalize bg-primary text-white"
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
            <q-btn style="margin-bottom:10px; margin-top:8px" rounded dense class="text-capitalize bg-primary text-white"
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
  data() {
    return {
      user_details: {},
      password_dict: {},
      mapData: "",
      model: null,
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
      shape:null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.mapData = new google.maps.Map(document.getElementById("myMap"), {
        center: { lat: 42.345573, lng: -71.098326 },
        zoom: 7
      });

      let pano = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
          position: { lat: 42.345573, lng: -71.098326 },
          pov: {
            heading: 34,
            pitch: 10
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.card-bg {
  background-color: white;
  border-radius: 10px;
}
</style>
