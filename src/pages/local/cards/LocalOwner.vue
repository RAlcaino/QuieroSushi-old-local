<template>
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
          <p style="margin-left:10px; margin-bottom:5px;color:rgba(0,0,0,0.6) ">
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
        @click="updateLocal()"
        >Guardar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ["dataLocal", "dataLocalOriginal", "localSelected"],
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],

  methods: {
    updateLocal() {
      var data = this.mapperOwner();
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
    },
    mapperOwner() {
      var data = {
        razon: this.dataLocal.razon,
        giro: this.dataLocal.giro,
        nombre_dueno: this.dataLocal.nombre_dueno,
        telefono_dueno: this.dataLocal.telefono_dueno,
        nombre_legal: this.dataLocal.nombre_legal,
        tipo_constitucion: this.dataLocal.tipo_constitucion,
        rut_empresa: this.dataLocal.rut_empresa,
        rut_legal: this.dataLocal.rut_legal
      }
      /*if (this.dataLocalOriginal.rut_empresa !== this.dataLocal.rut_empresa) {
        data["rut_empresa"] = this.dataLocal.rut_empresa;
      }

      if (this.dataLocalOriginal.rut_legal !== this.dataLocal.rut_legal) {
        data["rut_legal"] = this.dataLocal.rut_legal;
      }*/
      return data;
    }
  }
};
</script>

<style></style>
