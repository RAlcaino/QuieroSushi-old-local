<template>
  <div style="padding-bottom:100px;">
    <more-details></more-details>
    <keep-alive>
      <the-confirm></the-confirm>
    </keep-alive>
    <the-cancel></the-cancel>
    <div
      class="fit row wrap justify-center items-center content-center"
      style="padding-top:3%;"
    >
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="ordersNotConfirmed.length === 0 && flag === true"
      >
        <img src="../../../assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron pedidos sin confirmar
        </p>
      </div>
      <div
        class="fit row wrap justify-left items-start content-start"
        style="padding-left: 20px "
      >
        <q-card
          v-for="item of getData"
          :key="item.id"
          class="my-card class-card bg-grey-1"
          style="border-color:rgba(255, 45, 45, 0.4)"
          flat
          bordered
        >
          <q-card-section
            class="fit row wrap justify-between content-center"
            style="padding:10px 16px 5px 16px;"
          >
            <div
              class="text-overline fit row wrap justify-between content-center"
            >
              <div
                class="order-type"
                style="width:50%;font-size:13px;font-family:'Roboto'"
              >
                <q-icon
                  :name="
                    item.orderType === 'retiro'
                      ? 'takeout_dining'
                      : 'delivery_dining'
                  "
                  style="font-size:20px; padding-bottom:5px"
                  class="i-icon"
                />{{ capitalize(item.orderType) }}
              </div>
              <div
                class="order-date"
                style="width:50%;font-size:13px;font-family:'Roboto';text-align:right"
              >
                <q-icon
                  name="event"
                  style="font-size:20px; padding-bottom:5px;"
                  class="i-icon"
                />{{ item.requestedTime.split(" ")[0] }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="fit row wrap justify-around content-center">
            <div class="user-info">
              <p style="margin:0; font-weight:bold">
                {{ item.payDetail.user }}
              </p>
              <p style="margin:0;font-family:'Roboto'">
                {{ item.payDetail.userPhone }}
              </p>
              <p style="margin:0;font-family:'Roboto'">
                {{ item.payDetail.address }}
              </p>
            </div>
            <div class="user-payDetail">
              <p
                style="margin:0;font-family:'Roboto'; font-weight:bold;text-align:right"
              >
                Tipo de pago
              </p>
              <p style="margin:0;font-family:'Roboto';text-align:right">
                {{ item.payDetail.pay }}
              </p>
              <p style="margin:0;font-family:'Roboto';text-align:right">
                ${{ formatNumber(item.total) }}
              </p>
            </div>
          </q-card-section>
          <q-card-section
            class="fit row wrap justify-center items-center content-center"
          >
            <div style="font-size:14px;font-family:'Roboto'">
              <q-icon
                name="schedule"
                style="font-size:22px; padding-bottom:5px"
                class="i-icon"
              /><strong
                >Hora Solicitada: {{ item.requestedTime.split(" ")[1] }}</strong
              >
            </div>
          </q-card-section>

          <q-card-actions
            class="fit row no-wrap justify-center items-center content-center"
          >
            <q-btn
              rounded
              size="sm"
              color="green"
              style="font-size:10px"
              @click="confirmDialog(item)"
            >
              Confirmar
            </q-btn>
            <q-btn
              rounded
              size="sm"
              color="blue"
              style="font-size:10px"
              @click="moreDetailsDialog(item)"
            >
              Detalle
            </q-btn>
            <q-btn
              rounded
              size="sm"
              color="primary"
              style="font-size:10px; margin-right:5px"
              @click="cancelDialog(item)"
            >
              Anular
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <q-pagination
        v-if="ordersNotConfirmed.length !== 0"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        input
      />
    </div>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheConfirm from "./dialogs/TheConfirm.vue";
import TheCancel from "./dialogs/TheCancel.vue";

export default {
  props: ["ordersNotConfirmed"],
  inject: ["formatNumber", "capitalize"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheConfirm,
    TheCancel
  },
  mounted() {
    this.bus.$on("change-flag", () => {
      this.flag = !this.flag;
    });
  },
  computed: {
    getData() {
      return this.ordersNotConfirmed.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.ordersNotConfirmed.length / 4);
    }
  },
  data() {
    return {
      page: 1,
      perPage: 4,
      filter: "",
      flag: false
    };
  },
  methods: {
    moreDetailsDialog(row) {
      this.bus.$emit("more-details", row);
    },
    confirmDialog(row) {
      this.bus.$emit("the-confirm", row);
    },
    cancelDialog(row) {
      this.bus.$emit("the-cancel", row);
    }
  }
};
</script>

<style>
.i-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.i-icon {
  padding-right: 5px;
}
.class-card {
  width: 48%;
  margin-top: 2%;
  margin-right: 2%;
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.3);
}

.user-info,
.user-payDetail {
  width: 50%;
}

@media screen and (max-width: 600px) {
  .class-card {
    width: 100% !important;
    margin-top: 5% !important;
  }
}

@media screen and (max-width: 333px) {
  .order-type {
    width: 100% !important;
  }
  .order-date {
    width: 100% !important;
    text-align: left !important;
  }
}
</style>
