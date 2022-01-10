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
          value: Math.round(this.data.generalData.comision),
          flag: false
        },
        {
          title: "Comisión Pago Online (3% + IVA): ",
          value: Math.round(this.data.generalData.comision_online),
          flag: false
        },
        {
          title: "Comisión Pago Online Ventas Anuladas (3% + IVA): ",
          value: Math.round(this.data.generalData.onlinePayCancelledComission),
          flag: false
        },
        {
          title: "Servicio Devolución Ventas Anuladas (300 + IVA):",
          value: Math.round(this.data.generalData.serviceReturnCancelledOrders),
          flag: false
        },
        {
          title: "Total a Pagar: ",
          value: Math.round(this.data.generalData.totalToPay),
          flag: false
        },
        {
          title: "Total descuento pagado por Quierosushi.cl: ",
          value: Math.round(this.data.generalData.confirmedQsDiscountPayed),
          flag: false
        },
        {
          title: "Pagos Recibidos Online: ",
          value: Math.round(this.data.generalData.pago_online),
          flag: false
        },
        {
          title: `${
            this.data.generalData.saldo_a_pagar > 0
              ? "Total a pagar: "
              : "Monto a recibir:"
          } `,
          value: Math.round(this.data.generalData.saldo_a_pagar),
          flag: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
