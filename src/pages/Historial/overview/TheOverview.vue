<template>
  <div
    v-if="
      data.confirmedOrdersData.length !== 0 ||
        data.cancelledOrdersData.length !== 0
    "
  >
    <div v-for="item in items" :key="item.title">
      <the-item
        v-if="item.value > 0 && item.name !== 'total_pagar'"
        :title="item.title"
        :value="item.value"
        :formatNumber="formatNumber"
        :flag="item.flag"
      ></the-item>
      <the-item
        v-if="
          item.name === 'total_pagar' &&
            (items[5].value > 0 || items[6].value > 0)
        "
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
          name: "comision_ventas",
          title: "Comisión Ventas (12% + IVA): ",
          value: Math.round(this.data.generalData.comision),
          flag: false
        },
        {
          name: "comision_online",
          title: "Comisión Pago Online (3% + IVA): ",
          value: Math.round(this.data.generalData.comision_online),
          flag: false
        },
        {
          name: "comision_online_anuladas",
          title: "Comisión Pago Online Ventas Anuladas (3% + IVA): ",
          value: Math.round(this.data.generalData.onlinePayCancelledComission),
          flag: false
        },
        {
          name: "devolucion_ventas_anuladas",
          title: "Servicio Devolución Ventas Anuladas (300 + IVA):",
          value: Math.round(this.data.generalData.serviceReturnCancelledOrders),
          flag: false
        },
        {
          name: "total_pagar",
          title: "Total a Pagar: ",
          value: Math.round(this.data.generalData.totalToPay),
          flag: false
        },
        {
          name: "descuento_qs",
          title: "Total descuento pagado por Quierosushi.cl: ",
          value: Math.round(this.data.generalData.confirmedQsDiscountPayed),
          flag: false
        },
        {
          name: "pagos_online",
          title: "Pagos Recibidos Online: ",
          value: Math.round(this.data.generalData.pago_online),
          flag: false
        },
        {
          name: "saldo_monto",
          title: `${
            this.data.generalData.saldo_a_pagar > 0
              ? "Saldo a pagar: "
              : "Monto a recibir:"
          } `,
          value: `${
            this.data.generalData.saldo_a_pagar > 0
              ? Math.round(this.data.generalData.saldo_a_pagar)
              : Math.round(this.data.generalData.saldo_a_pagar) * -1
          } `,
          flag: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
