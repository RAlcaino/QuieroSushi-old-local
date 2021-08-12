<template>
  <div style="padding-bottom:100px;">
    <more-details></more-details>
    <the-done></the-done>
    <the-cancel :mode="'orders'"></the-cancel>
    <div
      class="fit row wrap justify-center items-center content-center"
      style="padding-top:3%;"
    >
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="ordersConfirmed.length === 0 && searching === false"
        style="margin-top:100px"
      >
        <img src="../../../assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron pedidos confirmados
        </p>
      </div>
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <div
        class="fit row wrap justify-left items-start content-start"
        style="padding-left: 20px "
        v-if="searching === false"
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
                  />{{ item.confirmationTimestamp.split(" ")[0] }}
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
              <p style="margin:0;font-family:'Roboto'">
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
            class="fit row wrap justify-center items-center content-center"
          >
            <div style="font-size:14px;font-family:'Roboto'">
              <q-icon
                name="schedule"
                style="font-size:22px; padding-bottom:5px"
                class="i-icon"
              /><strong
                >Hora Prometida: {{ item.kitchenTime.split(" ")[1] }}</strong
              >
            </div>
          </q-card-section>

          <q-card-actions>
            <div
              class="fit row no-wrap justify-center items-center content-center"
            >
              <q-btn
                @click="doneDialog(item)"
                rounded
                size="sm"
                color="green"
                style="font-size:10.5px; margin-right:5px"
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
                style="font-size:10.5px; margin-right:5px"
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
        v-if="ordersConfirmed.length > 8 && searching === false"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        color="blue"
        input
        @input="callEvent"
      />
    </div>
  </div>
</template>

<script>
import BaseMoreComponent from "../../../components/bases/BaseMoreComponent.vue";
import MoreDetails from "./dialogs/MoreDetails.vue";
import TheDone from "./dialogs/TheDone.vue";
import TheCancel from "./dialogs/TheCancel.vue";

export default {
  props: ["ordersConfirmed"],
  inject: ["formatNumber", "capitalize"],
  components: {
    BaseMoreComponent,
    MoreDetails,
    TheDone,
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
      return this.ordersConfirmed.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.ordersConfirmed.length / 8);
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
    moreDetails(row) {
      this.bus.$emit("more-details", row);
    },
    doneDialog(row) {
      this.bus.$emit("the-done", row);
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
      this.bus.$emit("modal-status-order-?", data);
    }
  }
};
</script>

<style></style>
