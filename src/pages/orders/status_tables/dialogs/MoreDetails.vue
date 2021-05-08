<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card class="my-card" style="width: 450px; border-radius:10px;">
      <q-card-section class="q-pt-none" style="padding-bottom:0">
        <q-tabs v-model="tab" class="text-blacklight">
          <q-tab
            name="one"
          >
            <strong v-if="$store.getters['auth/getDataUser'].role === 'God'">N° Pedido: {{ orderDetail.id }}</strong>
            <strong v-else>Detalle</strong>
          </q-tab>
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="one" class="tab-panel" v-if="orderDetail.product">
            <q-list class="list-style" style="border-bottom: 1.2px dotted #000">
              <q-item
                v-if="orderDetail.extras"
                v-ripple
                style="padding: 8px 0 !important"
              >
                <q-item-section avatar>
                  <img
                    src="~assets/salsas.jpg"
                    width="50"
                    style="border-radius:10%"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    style="text-align: left;color:#333; margin:0;font-weight:bold; font-size: 14px"
                  >
                    Palitos: {{ orderDetail.extras.chopsticks }} | Jengibre:
                    {{ orderDetail.extras.ginger }} | Wasabi:
                    {{ orderDetail.extras.wasabi }}
                  </q-item-label>
                  <q-item-label caption> Incluido</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-for="(item, index) in orderDetail.product"
                :key="index"
                v-ripple
                style="padding: 8px 0 !important"
              >
                <q-item-section avatar>
                  <img
                    :src="item.detail.image"
                    width="50"
                    style="border-radius:10%"
                  />
                </q-item-section>
                <q-item-section
                  class="fit row wrap justify-between items-start content-start"
                  style="flex-direction: row !important"
                >
                  <q-item-label
                    style="width: 60%; font-weight:bold;font-size: 14px; color: #333"
                  >
                    {{ item.quantity }} x {{ item.detail.name }}
                  </q-item-label>
                  <q-item-label
                    style="width: 40%; text-align: right; margin:0;font-weight:bold; color:#ff2d2d; font-size: 14px"
                  >
                    {{ " $" + formatNumber(item.quantity * item.detail.price) }}
                  </q-item-label>
                  <q-item-label caption>
                    {{
                      " $" + formatNumber(item.detail.price) + " C/U"
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
            <div class="tab-overview-footer">
              <p v-if="item.discount!==0" style="font-size:14px">
                <strong style="color: green;">Descuento incluido</strong>
              </p>
              <p style="font-size:14px">
                <strong style="color: #333;">Subtotal: </strong> ${{ formatNumber(orderDetail.subtotal) }}
              </p>
              <p style="font-size:14px">
                <strong style="color: #333;">Costo Despacho: </strong> ${{ formatNumber(orderDetail.deliveryCost) }}
              </p>
              <p style="font-size:14px">
                <strong style="color: #333;">Total: </strong> <span style="color:#ff2d2d; font-weight:bold">${{ formatNumber(orderDetail.total) }}</span>
              </p>
            </div>
            <div class="tab-overview-footer">
              <q-list>
                <q-item v-if="item.payDetail.address2!==null">
                  <q-item-section avatar>
                    <q-icon name="room" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Dirección del cliente</q-item-label>
                    <q-item-label caption>{{item.payDetail.address2}}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />

                <q-item v-if="item.aditionalMessage!==null">
                    <q-item-section avatar>
                    <q-icon name="message" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mensaje del cliente</q-item-label>
                    <q-item-label caption>{{item.aditionalMessage}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="sm" v-close-popup rounded color="primary" label="Cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["formatNumber"],
  mounted() {
    this.bus.$on("more-details", data => {
      this.card = !this.card;
      this.orderDetail = data;
    });
  },
  data() {
    return {
      card: false,
      tab: "one",
      orderDetail: {}
    };
  }
};
</script>

<style lang="scss">
.tab-panel {
  height: auto !important;
  overflow: visible !important;
}
.tab-overview {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 20px;
}
.tab-overview-headers {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  text-align: left;
  p {
    margin-bottom: 5px;
  }
}
.tab-overview-items {
  width: 100%;
  display: flex;
  justify-content: right;
  flex-direction: column;
  text-align: left;
  p {
    word-wrap: break-word;
    hyphens: manual;
    width: 100%;
    margin-bottom: 10px;
  }
}
.tab-overview-subtotals {
  width: 30%;
  display: flex;
  justify-content: right;
  flex-direction: column;
  p {
    margin-bottom: 0;
  }
}

.tab-overview-footer {
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: right;
  align-items: right;
  flex-direction: column;
  p {
    text-align: right;
    margin-bottom: 0;
  }
}

.list-style {
  margin-left: 20px;
}

@media screen and (max-width: 600px) {
  .list-style {
    margin-left: 0px;
  }
}
</style>
