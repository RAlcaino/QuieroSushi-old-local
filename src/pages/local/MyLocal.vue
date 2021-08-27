<template>
  <q-page class="q-pa-sm" style="padding-bottom:100px">
    <edit-photo></edit-photo>
    <div class="row q-col-gutter-sm" v-if="dataLocal.nombre !== ''">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <local-info
          :dataLocal="dataLocal"
          :localSelected="localSelected"
          :openPhotoDialog="upploadNew"
        ></local-info>
        <local-schedule
          :dataLocal="dataLocal"
          :localSelected="localSelected"
        ></local-schedule>
      </div>
      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <local-owner
          :dataLocal="dataLocal"
          :dataLocalOriginal="dataLocalOriginal"
          :localSelected="localSelected"
        ></local-owner>
        <local-communes
          :dataLocal="dataLocal"
          :localSelected="localSelected"
        ></local-communes>
      </div>
    </div>
    <div
      v-else
      style="margin-top:30vh"
      class="fit column wrap justify-center items-center content-center"
    >
      <img
        src="~/assets/maki-roll.gif"
        alt="sad"
        width="130"
        style="border-radius:100%"
      />
    </div>
  </q-page>
</template>

<script>
import EditPhoto from "./dialogs/EditPhoto.vue";

//CARDS
import LocalInfo from "./cards/LocalInfo.vue";
import LocalSchedule from "./cards/LocalSchedule.vue";
import LocalOwner from "./cards/LocalOwner.vue";
import LocalCommunes from "./cards/LocalCommunes.vue";

export default {
  name: "UserProfile",
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  components: {
    EditPhoto,
    LocalInfo,
    LocalSchedule,
    LocalOwner,
    LocalCommunes
  },
  provide() {
    return {
      change: this.change,
      setLocalSelected: this.setLocalSelected
    };
  },
  data() {
    return {
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
      }
    };
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  mounted() {
    this.init();

    this.bus.$on("sync-info-local-1", () => {
      this.getDataLocal();
    });
  },
  methods: {
    getDataLocal() {
      //this.showLoading();
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
    init() {
      this.formatLocals();
      this.localSelected = this.locals[0];
      this.getDataLocal();
    },
    setLocalSelected(locals) {
      this.localSelected = locals.find(
        item => item.value === this.localSelected.value
      );
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
      this.bus.$emit("sync-communes", this.dataLocal);
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
        this.locals.sort(function(a, b) {
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
