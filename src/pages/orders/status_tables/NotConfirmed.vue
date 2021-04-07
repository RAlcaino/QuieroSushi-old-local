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
        class="fit row wrap justify-left items-start content-start"
        style="padding-left: 20px "
      >
        <q-card
          v-for="item of ordersNotConfirmed"
          :key="item.id"
          class="my-card class-card"
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
          <q-card-section
            class="fit row wrap justify-around content-center"
          >
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
          <q-separator style="background:rgba(255, 45, 45, 0.4);" />

          <q-card-actions
            class="fit row no-wrap justify-center items-center content-center"
          >
            <q-btn
              rounded
              size="sm"
              color="primary"
              style="font-size:10px; margin-right:5px"
              @click="cancelDialog(item)"
            >
              Anular
            </q-btn>
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
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!--<q-table
      :pagination.sync="pagination"
      class="q-my-xs q-my-md"
      :data="ordersNotConfirmed"
      :columns="getColumns"
      row-key="key"
      :loading="loading"
      no-data-label="No se encontro ningún registro"
      no-results-label="No se encontro ningún registro"
      rows-per-page-label="Registros por página"
      title="Pedidos sin confirmar"
      :filter="filter"
      style="border-radius: 10px !important"
      virtual-scroll
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <base-more-component :props="props" color="primary">
            <q-item clickable @click="moreDetailsDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="more" class="i-icon" />
                <span> Ver más</span>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="confirmDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="check_circle" class="i-icon" />
                <span> Confirmar</span>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="cancelDialog(props.row)">
              <q-item-section class="i-section">
                <q-icon name="cancel" class="i-icon" />
                <span> Anular</span>
              </q-item-section>
            </q-item>
          </base-more-component>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'total'">{{
              formatNumber(col.value)
            }}</template>
            <template v-else-if="col.name === 'orderType'">{{
              capitalize(col.value)
            }}</template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>-->
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
    var responsive = window.matchMedia("(max-width: 450px)");
    var vue = this;

    if (screen.width < 450) {
      vue.pagination.rowsPerPage = 7;
    }

    responsive.addListener(function(event) {
      if (event.matches) {
        vue.pagination.rowsPerPage = 7;
      } else {
        vue.pagination.rowsPerPage = 10;
      }
    });
  },
  computed: {
    getColumns() {
      var newArray = [];
      var role = this.$store.getters["auth/getDataUser"].role;
      var roots = this.columns.map(function(item) {
        if (item.role.some(item2 => item2 === role)) {
          newArray.push(item);
        }
      });
      return newArray;
    }
  },
  data() {
    return {
      filter: "",
      loading: false,
      pagination: {
        rowsPerPage: 9
      },
      columns: [
        {
          name: "requestedTime",
          align: "left",
          label: "Fecha",
          field: row => row.requestedTime,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "name",
          align: "center",
          label: "Cliente",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "orderType",
          align: "center",
          label: "Tipo",
          field: row => row.orderType,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "userPhone",
          align: "center",
          label: "Télefono",
          field: row => row.userPhone,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "userAddress",
          align: "center",
          label: "Dirección",
          field: row => row.userAddress,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        },
        {
          name: "total",
          align: "right",
          label: "Total($)",
          field: row => row.total,
          format: val => `${val}`,
          sortable: true,
          required: true,
          role: ["Cajero", "Gerente", "Administrador", "Super Admin", "God"]
        }
      ]
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
