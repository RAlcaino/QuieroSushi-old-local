<template>
  <q-page
    class="q-pa-sm"
    style="padding-bottom:100px"
  >
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <q-card class="card-bg">
          <q-card-section
            class="text-h6"
            style="display: flex; flex-direction:row; justify-content:space-between"
          >
            <div class="text-h6">
              <q-icon style="padding-bottom:4px" name="paid"></q-icon>
              Estadisticas de ventas
            </div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "OrderStadistics",
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  data() {
    return {
      prod: null
    };
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  mounted() {
    this.init();
  },
  methods:{

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
