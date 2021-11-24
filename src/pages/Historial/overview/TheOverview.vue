<template>
  <div
    v-if="
      data.confirmedOrdersData.length !== 0 ||
        data.cancelledOrdersData.length !== 0
    "
  >
    <div v-for="item in items" :key="item.title">
      <the-item
        v-if="item.value > 0 || item.flag"
        :title="item.title"
        :value="item.value"
        :formatNumber="formatNumber"
        :flag="item.flag"
      ></the-item>
    </div>
  </div>
</template>

<script>
import TheItem from "./TheItem.vue";
export default {
  components: { TheItem },
  props: ["data", "formatNumber"],
  data() {
    return {
      items: [
        {
          title: "Comisión Ventas (12% + IVA): ",
          value: this.data.generalData.comision.toString().split(".")[0],
          flag: false
        },
        {
          title: "Comisión Pago Online (3% + IVA): ",
          value: this.data.generalData.comision_online.toString().split(".")[0],
          flag: false
        },
        {
          title: "Comisión Pago Online Ventas Anuladas (3% + IVA): ",
          value: this.data.generalData.onlinePayCancelledComission
            .toString()
            .split(".")[0],
          flag: false
        },
        {
          title: "Servicio Devolución Ventas Anuladas (300 + IVA):",
          value: this.data.generalData.serviceReturnCancelledOrders
            .toString()
            .split(".")[0],
          flag: false
        },
        {
          title: "Total a Pagar: ",
          value: this.data.generalData.totalToPay.toString().split(".")[0],
          flag: false
        },
        {
          title: "Pagos Recibidos Online: ",
          value: this.data.generalData.pago_online.toString().split(".")[0],
          flag: false
        },
        {
          title: `${
            this.data.generalData.saldo_a_pagar > 0
              ? "Total a pagar: "
              : "Monto a recibir:"
          } `,
          value: this.data.generalData.saldo_a_pagar.toString().split(".")[0],
          flag: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
