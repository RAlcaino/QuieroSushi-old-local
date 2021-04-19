<template>
  <div style="padding-bottom:100px;">
    <more-details></more-details>
    <the-done></the-done>
    <div
      class="fit row wrap justify-center items-center content-center"
      style="padding-top:3%;"
    >
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="ordersConfirmed.length === 0"
      >
        <img src="../../../assets/icons8-sad.gif" alt="sad" width="130">
        <p style="font-size:16px; font-weight:bold;text-align:center">No se encontraron pedidos confirmados</p>
      </div>
      <div
        class="fit row wrap justify-left items-start content-start"
        style="padding-left: 20px "
      >
        <q-card
          v-for="item of getData"
          :key="item.id"
          class="my-card class-card bg-grey-1"
          style="border-color:rgba(0,0,255,0.4)"
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
                />{{ item.confirmationTimestamp.split(" ")[0] }}
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
                >Hora Prometida:
                {{ item.confirmationTimestamp.split(" ")[1] }}</strong
              >
            </div>
          </q-card-section>

          <q-card-actions
            class="fit row no-wrap justify-center items-center content-center"
          >
            <q-btn
              @click="doneDialog(item)"
              rounded
              size="sm"
              color="green"
              style="font-size:10px"
            >
              <template v-if="item.orderType === 'retiro'">
                Listo para Retiro</template
              >
              <template v-else>En camino</template>
            </q-btn>
            <q-btn
              @click="moreDetails(item)"
              rounded
              size="sm"
              color="blue"
              style="font-size:10px"
            >
              Detalle
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <q-pagination
        v-if="ordersConfirmed.length > 4"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        color="blue"
        input
      />
    </div>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheDone from "./dialogs/TheDone.vue";

export default {
  props: ["ordersConfirmed"],
  inject: ["formatNumber", "capitalize"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheDone
  },
  computed: {
    getData() {
      return this.ordersConfirmed.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.ordersConfirmed.length / 4);
    }
  },
  data() {
    return {
      page: 1,
      perPage: 4,
      filter: ""
    };
  },
  methods: {
    moreDetails(row) {
      this.bus.$emit("more-details", row);
    },
    doneDialog(row) {
      this.bus.$emit("the-done", row);
    }
  }
};
</script>

<style></style>
