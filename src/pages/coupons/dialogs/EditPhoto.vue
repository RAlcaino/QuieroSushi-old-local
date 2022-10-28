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
    <q-card class="my-card" style="width: 500px; border-radius:10px">
      <q-card-section class="card-section-modal-new-o">
        <p style="font-size: 16px; font-weight: bold;">Elige una foto</p>
        <q-uploader
          url=""
          color="primary"
          flat
          bordered
          label="Foto del cupon"
          hide-upload-btn
          style="max-width: 300px"
          accept=".png,.jpg,.jpeg"
          @added="fileAdded"
          @removed="fileRemoved"
        >
        </q-uploader>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          :disable="file_selected === null"
          rounded
          color="green"
          label="Guardar"
          style="font-size: 11px !important"
          @click="uploadPhoto()"
        />
        <q-btn
          rounded
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          v-close-popup
        />
      </q-card-actions>
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
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("open-upload-photo", (coupon, localId) => {
      this.card = true;
      this.coupon = coupon;
      this.localId = localId;
      this.file_selected = null;
    });
  },
  mounted() {},
  data() {
    return {
      card: false,
      prod: null,
      coupon: null,
      localId: null,
      file_selected: null
    };
  },
  methods: {
    uploadPhoto() {
      var formData = new FormData();
      formData.append("file", this.file_selected);
      formData.append("id_cupon", this.coupon.id);
      formData.append("id_local", this.localId);
      formData.append("espacio", "foto1");

      this.showLoading();

      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("upload.photo", {
          type: "cupon"
        });
        this.$axios
          .post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.bus.$emit("sync-coupon-edit");
            }
            this.hideLoading();
            this.closePopup();
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    },
    fileAdded(files) {
      this.file_selected = files[0];
    },
    fileRemoved(files) {
      this.file_selected = null;
    },
    closePopup() {
      this.card = false;
    }
  }
};
</script>

<style>
.q-uploader__subtitle {
  font-size: 12px;
  line-height: 18px;
  display: none !important;
}
</style>
