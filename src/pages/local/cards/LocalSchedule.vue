<template>
  <q-card class="card-bg" style="width:100%; height: auto; margin-top:15px">
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
</template>

<script>
export default {
  props: ["dataLocal", "localSelected"],
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  methods: {
    updateSchedule() {
      let week = this.dataLocal.semana;
      let weekWithoutLabel = [];
      let eachday = week.map(item => {
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
};
</script>

<style></style>
