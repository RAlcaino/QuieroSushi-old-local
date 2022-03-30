<template>
  <div style="padding-bottom:100px;">
    <more-details currentTab="not-confirmed"></more-details>
    <keep-alive>
      <the-confirm></the-confirm>
    </keep-alive>
    <the-cancel :mode="'orders'"></the-cancel>
    <div
      class="fit row wrap justify-center items-center content-center"
      style="padding-top:3%;"
    >
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="ordersNotConfirmed.length === 0 && searching === false"
        style="margin-top:100px"
      >
        <img src="../../../assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron pedidos sin confirmar
        </p>
      </div>
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll2.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <div
        class="fit row wrap justify-left items-start content-start"
        v-if="searching === false"
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
            class="fit row wrap justify-around content-center"
            style="padding:10px 16px 5px 16px;"
          >
            <div
              class="text-overline fit row wrap justify-between content-center"
            >
              <div
                class="order-type"
                style="width:50%;font-size:13px;font-family:'Roboto'"
              >
                <div>
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
                <div>
                  <q-icon
                    name="event"
                    style="font-size:20px; padding-bottom:5px;"
                    class="i-icon"
                  />{{ item.requestedTime.split(" ")[0] }}
                </div>
              </div>
              <div
                class="order-date"
                style="width:50%;font-size:13px;font-family:'Roboto';text-align:right"
              >
                <div>
                  <q-icon
                    name="store"
                    style="font-size:20px; padding-bottom:5px"
                    class="i-icon"
                  />{{ item.local.name }}
                </div>
                <div>
                  <q-icon
                    name="room"
                    style="font-size:20px; padding-bottom:5px;"
                    class="i-icon"
                  />{{ item.local.commune }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            style="display:flex; flex-direction:row; justify-content: space-between;"
          >
            <div class="user-info">
              <p style="margin:0; font-weight:bold">
                {{ item.payDetail.user }}
              </p>
              <p
                v-if="item.local.tiene_anulacion_automatica === 0"
                style="margin:0;font-family:'Roboto'"
              >
                {{ item.payDetail.userPhone }}
              </p>
              <p style="margin:0;font-family:'Roboto'">
                {{ item.payDetail.address.trim() }}.
                <template v-if="item.payDetail.address2 != ''">
                  <span v-if="item.payDetail.address2.search('dpto') == -1"
                    >Dpto/Ubicacion:</span
                  >
                  {{ item.payDetail.address2.trim() }}.
                </template>
                {{ item.payDetail.userCommune.trim() }}
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
            class="fit column wrap justify-center items-center content-center"
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
            <div
              style="font-size:14px;font-family:'Roboto'"
              v-if="item.local.tiene_anulacion_automatica === 1"
            >
              <the-timer :timestamp_inicio="item.startTimestamp"></the-timer>
            </div>
          </q-card-section>

          <q-card-actions>
            <div
              class="fit row no-wrap justify-center items-center content-center"
            >
              <q-btn
                rounded
                size="sm"
                color="blue"
                style="font-size:10.5px; margin-right:5px"
                @click="moreDetailsDialog(item)"
              >
                Detalle
              </q-btn>
              <q-btn
                rounded
                size="sm"
                color="primary"
                style="font-size:10.5px; margin-right:5px"
                @click="cancelDialog(item)"
              >
                Anular
              </q-btn>
              <q-btn
                rounded
                size="sm"
                color="green"
                style="font-size:10.5px"
                @click="confirmDialog(item)"
              >
                Confirmar
              </q-btn>
            </div>
            <div
              class="fit row wrap justify-center items-center content-center"
              style="margin-top: 5px;"
            >
              <q-btn
                rounded
                size="sm"
                color="amber-9"
                style="font-size:10.5px; margin-right:5px"
                @click="openChat(item)"
              >
                Servicio al cliente
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <q-pagination
        v-if="ordersNotConfirmed.length > 8 && searching === false"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        input
        @input="callEvent"
      />
    </div>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheConfirm from "./dialogs/TheConfirm.vue";
import TheCancel from "./dialogs/TheCancel.vue";
import TheTimer from "../timer/TheTimer.vue";

export default {
  props: ["ordersNotConfirmed", "refresh", "sendWs"],
  inject: ["formatNumber", "capitalize"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheConfirm,
    TheCancel,
    TheTimer
  },
  created() {
    this.flag = this.refresh;
    this.searching = this.refresh;
    this.bus.$on("reset-page", () => {
      if (this.page !== 1) {
        this.flag = true;
        this.searching = true;
        setTimeout(() => {
          this.flag = false;
          this.searching = false;
        }, 500);
      }
      this.page = 1;
    });
    this.bus.$on("start-loader", () => {
      this.flag = true;
      this.searching = true;
    });
    this.bus.$on("end-loader", () => {
      this.flag = false;
      this.searching = false;
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
      return Math.ceil(this.ordersNotConfirmed.length / 8);
    }
  },
  data() {
    return {
      page: 1,
      perPage: 8,
      filter: "",
      flag: false,
      searching: false
    };
  },
  beforeDestroy() {
    console.log("Before Unmount NC");
    this.flag = false;
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
    },
    callEvent(val) {
      this.bus.$emit("scroll-up");
    },
    openChat(row) {
      var data = {
        id_venta: row.id
      };
      //this.sendWs(row.id);
      this.bus.$emit("modal-status-order", data);
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
  margin-right: 1%;
  margin-left: 1%;
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.3);
}

.user-info {
  width: auto;
}
.user-payDetail {
  width: 30%;
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
