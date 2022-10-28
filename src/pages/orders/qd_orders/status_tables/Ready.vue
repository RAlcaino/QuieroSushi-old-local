<template>
  <div style="padding-bottom: 100px">
    <more-details currentTab="done"></more-details>
    <the-cancel :mode="'orders'"></the-cancel>
    <div
      class="fit row wrap justify-center items-center content-center"
      style="padding-top: 3%"
    >
      <div
        style="margin-top: 100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="ordersReady.length === 0 && searching === false"
      >
        <img src="../../../../assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size: 16px; font-weight: bold; text-align: center">
          No se encontraron pedidos listos
        </p>
      </div>
      <div
        style="margin-top: 100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll2.gif"
          alt="sad"
          width="130"
          style="border-radius: 100%"
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
          flat
          bordered
          style="border-color: rgba(0, 128, 0, 0.4)"
        >
          <q-card-section
            class="fit row wrap justify-between content-center"
            style="padding: 10px 16px 5px 16px"
          >
            <div
              class="text-overline fit row wrap justify-between content-center"
            >
              <div
                class="order-type"
                style="width: 50%; font-size: 13px; font-family: 'Roboto'"
              >
                <div v-if="item.originOrder !== null">
                  <strong>Origen:</strong> {{ item.originOrder }}
                </div>
                <div v-if="item.supplierOrder !== null">
                  <strong>Reparto: </strong> {{ item.supplierOrder }}
                </div>
                <div>
                  <q-icon
                    :name="
                      item.orderType === 'retiro'
                        ? 'takeout_dining'
                        : 'delivery_dining'
                    "
                    style="font-size: 20px; padding-bottom: 5px"
                    class="i-icon"
                  />{{
                    `${capitalize(item.orderType)} ${
                      item.es_uber === 1
                        ? ` ${
                            item.uuid !== undefined && item.uuid !== null
                              ? item.uuid.slice(-5)
                              : ""
                          }`
                        : ""
                    }`
                  }}
                </div>
                <div>
                  <q-icon
                    name="event"
                    style="font-size: 20px; padding-bottom: 5px"
                    class="i-icon"
                  />{{ item.waitingPaymentTimestamp.split(" ")[0] }}
                </div>
              </div>
              <div
                class="order-date"
                style="
                  width: 50%;
                  font-size: 13px;
                  font-family: 'Roboto';
                  text-align: right;
                "
              >
                <div>
                  <q-icon
                    name="tag"
                    style="font-size: 20px; padding-bottom: 5px"
                    class="i-icon"
                  />{{ item.internalCode }}
                </div>
                <div>
                  <q-icon
                    name="store"
                    style="font-size: 20px; padding-bottom: 5px"
                    class="i-icon"
                  />{{ item.local.name }}
                </div>
                <div>
                  <q-icon
                    name="room"
                    style="font-size: 20px; padding-bottom: 5px"
                    class="i-icon"
                  />{{ item.local.commune }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            "
          >
            <div class="user-info">
              <p style="margin: 0; font-weight: bold">Cliente</p>
              <p style="margin: 0">
                {{ item.userDetail.user }}
              </p>
              <p style="margin: 0; font-family: 'Roboto'">
                {{ item.userDetail.userPhone }}
              </p>
              <p
                style="margin: 0; font-family: 'Roboto'"
                v-if="item.es_uber !== 1"
              >
                {{ item.userDetail.address.trim() }}.
                <template
                  v-if="
                    item.userDetail.address2 != '' &&
                      item.userDetail.address2 !== null
                  "
                >
                  <span v-if="item.userDetail.address2.search('dpto') == -1"
                    >Dpto/Ubicacion:</span
                  >
                  {{ item.userDetail.address2.trim() }}.
                </template>
                {{ item.userDetail.userCommune.trim() }}
              </p>
            </div>
            <div class="user-userDetail">
              <p
                style="
                  margin: 0;
                  font-family: 'Roboto';
                  font-weight: bold;
                  text-align: right;
                "
              >
                Total:
              </p>
              <p style="margin: 0; font-family: 'Roboto'; text-align: right">
                {{ item.paymentMethod }}
              </p>
              <p style="margin: 0; font-family: 'Roboto'; text-align: right">
                {{ formatNumber(item.total) }}
              </p>
            </div>
          </q-card-section>
          <q-card-section
            class="fit column wrap justify-center items-center content-center"
          >
            <div style="font-size: 14px; font-family: 'Roboto'">
              <q-icon
                name="schedule"
                style="font-size: 22px; padding-bottom: 5px"
                class="i-icon"
              /><strong
                >Creado a las:
                {{
                  item.waitingPaymentTimestamp.split(" ")[1].slice(0, 5)
                }}</strong
              >
            </div>
            <div
              v-if="item.preparationTimestamp !== null"
              style="font-size: 14px; font-family: 'Roboto'"
            >
              <q-icon
                name="schedule"
                style="font-size: 22px; padding-bottom: 5px"
                class="i-icon"
              /><strong
                >Llegara al local a las:
                {{
                  item.preparationTimestamp.split(" ")[1].slice(0, 5)
                }}</strong
              >
            </div>
            <!-- <div
              style="font-size: 14px; font-family: 'Roboto'"
              v-if="
                item.timestamp_llegada_local !== null &&
                item.timestamp_llegada_local.split(' ')[1].slice(0, 5) !==
                  '00:00'
              "
            >
              <q-icon
                name="schedule"
                style="font-size: 22px; padding-bottom: 5px"
                class="i-icon"
              /><strong
                >Llegó al local:
                {{
                  item.timestamp_llegada_local.split(" ")[1].slice(0, 5)
                }}</strong
              >
            </div> -->
          </q-card-section>

          <q-card-actions
            class="fit row no-wrap justify-center items-center content-center"
          >
            <q-btn
              @click="moreDetails(item)"
              rounded
              size="sm"
              color="blue"
              style="font-size: 10.5px"
            >
              Detalle
            </q-btn>
            <!-- <q-btn
              rounded
              size="sm"
              color="primary"
              style="font-size: 10.5px; margin-right: 5px"
              @click="cancelDialog(item)"
            >
              Anular
            </q-btn>
            <q-btn
              rounded
              size="sm"
              color="amber-9"
              style="font-size: 10.5px; margin-right: 5px"
              @click="openChat(item)"
            >
              Servicio al cliente
            </q-btn> -->
          </q-card-actions>
        </q-card>
      </div>
      <q-pagination
        v-if="ordersReady.length > 15 && searching === false"
        v-model="page"
        :max="getMaxPages"
        style="padding-top: 25px"
        color="green"
        input
        @input="callEvent"
      />
    </div>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheCancel from "./dialogs/TheCancel.vue";

export default {
  props: ["ordersReady", "sendWs"],
  inject: ["formatNumber", "capitalize"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheCancel
  },
  created() {
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
      return this.ordersReady.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.ordersReady.length / 15);
    }
  },
  data() {
    return {
      page: 1,
      perPage: 15,
      filter: "",
      flag: false,
      searching: false
    };
  },
  beforeDestroy() {
    this.flag = false;
  },
  methods: {
    format(d) {
      let date = new Date(d);
      let time = "";
      let formated = "";

      time += date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // get hour
      time +=
        date.getMinutes() < 10
          ? ":0" + date.getMinutes()
          : ":" + date.getMinutes(); // get minutes

      formated =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        time;

      return formated;
    },
    getPromisedTime(item) {
      let promisedTime = new Date(item.kitchenTime);
      return this.format(
        promisedTime.setMinutes(
          promisedTime.getMinutes() - item.gmapsDeliveryTime
        )
      )
        .split(" ")[1]
        .slice(0, 5);
    },
    moreDetails(row) {
      this.bus.$emit("more-details", row);
    },
    callEvent(val) {
      this.bus.$emit("scroll-up");
    },
    cancelDialog(row) {
      this.bus.$emit("the-cancel", row);
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

<style></style>
