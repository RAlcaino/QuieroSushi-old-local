<template>
  <q-dialog v-model="open" persistent>
    <q-card class="my-card">
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="description"
          />
          Detalle
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section style="max-height: 90%; overflow: auto;padding: 5px;">
        <div
          class="fit column wrap justify-start items-start content-start"
          v-if="!loading"
        >
          <strong
            style="width: 100%; text-align: center;margin: 15px 0; font-size: 16px;"
            >Semana {{ week }}</strong
          >
          <div style="width: 100%; height: 100%; border-radius: 15px; ">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              align="justify"
              narrow-indicator
            >
              <q-tab
                name="sales-c"
                label="Ventas Confirmadas"
                class="text-green"
              />
              <q-tab
                name="sales-a"
                label="Ventas Anuladas"
                class="text-primary"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated keep-alive>
              <q-tab-panel name="sales-c">
                <the-table
                  :data="data.confirmedOrdersData"
                  :formatNumber="formatNumber"
                ></the-table>
              </q-tab-panel>

              <q-tab-panel name="sales-a">
                <the-table
                  :data="data.cancelledOrdersData"
                  :formatNumber="formatNumber"
                ></the-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div v-if="!loading" class="overview__styles">
            <the-overview
              :data="data"
              :formatNumber="formatNumber"
            ></the-overview>
          </div>
        </div>
        <div
          class="fit column wrap justify-center items-center content-center"
          v-else
          style="height: 450px !important;"
        >
          <img
            src="~/assets/maki-roll2.gif"
            alt="sad"
            width="130"
            style="border-radius:100%"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import TheOverview from "../overview/TheOverview.vue";
import TheTable from "../table/TheTable.vue";
export default {
  components: { TheTable, TheOverview },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "formatNumber"
  ],
  created() {
    this.bus.$on("open-details-postpago", props => {
      this.open = true;
      this.week = props.week;
      this.getDetail(props.key);
    });
  },
  data() {
    return {
      open: false,
      data: [],
      tab: "sales-c",
      loading: true,
      week: ""
    };
  },
  methods: {
    getDetail(idPostpago) {
      var url = this.$store.getters["routes/getRoute"]("report", {
        idPostpago: idPostpago
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.data = response.data.result;
            this.loading = false;
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    close() {
      this.open = false;
      this.data = [];
      this.tab = "sales-c";
      this.loading = true;
      this.week = "";
      this.bus.$emit("reset-row-bottom");
    }
  }
};
</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 10px;
  max-width: 100%;
  width: 65%;
  height: 600px;
  overflow: hidden;
}

.overview__styles {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  margin-top: 20px;
  padding: 0 15px;
}

@media screen and (max-width: 900px) {
  .my-card {
    width: 100% !important;
  }
}
</style>
