<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card class="my-card" style="width: 450px; border-radius:10px;">
      <q-card-section class="q-pt-none" style="padding-bottom:0">
        <q-tabs v-model="tab" class="text-blacklight">
          <q-tab label="Detalle" name="one" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="one" class="tab-panel" v-if="orderDetail.product">
            <q-list class="list-style">
              <q-item v-ripple>
                <q-item-section avatar>
                  <q-icon style="margin-left:15px" color="green" name="check_circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Palitos: {{ orderDetail.extras.chopsticks }} | Jengibre:
                    {{ orderDetail.extras.ginger }} | Wasabi:
                    {{ orderDetail.extras.wasabi }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-for="(item, index) in orderDetail.product"
                :key="index"
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon style="margin-left:15px"  color="green" name="check_circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ item.quantity }} x {{ item.detail.name }} x ${{
                      formatNumber(item.detail.price)
                    }}</q-item-label
                  >
                  <q-item-label caption>
                    {{
                      " $" + formatNumber(item.quantity * item.detail.price)
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
            <div class="tab-overview-footer">
              <p>
                <strong style="color: #333">Subtotal: </strong> $
                {{ formatNumber(orderDetail.subtotal) }}
              </p>
              <p>
                <strong style="color: #333">Costo Despacho: </strong> $
                {{ formatNumber(orderDetail.deliveryCost) }}
              </p>
              <p>
                <strong style="color: #333">Total: </strong>$
                {{ formatNumber(orderDetail.total) }}
              </p>
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
  margin-left: 35px;
}

@media screen and (max-width: 600px) {
  .list-style {
    margin-left: 0px;
  }
}
</style>
