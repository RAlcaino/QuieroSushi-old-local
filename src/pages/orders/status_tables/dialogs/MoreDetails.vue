<template>
  <q-dialog
    v-model="card"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card class="my-card" style="width: 400px; border-radius:10px;">
      <q-card-section class="q-pt-none">
        <q-tabs v-model="tab" class="text-blacklight">
          <q-tab label="Resumen" name="one" />
          <q-tab label="Detalle pedido" name="two" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="one" class="tab-panel" v-if="orderDetail.product">
            <div class="tab-overview-headers">
              <p>
                <strong style="color: #333; padding-left: 25px">Items</strong>
              </p>
              <p>
                <strong style="color: #333;padding-left: 25px "
                  >Subtotales</strong
                >
              </p>
            </div>
            <div class="tab-overview">
              <div class="tab-overview-items">
                <div v-for="(item, index) in orderDetail.product" :key="index" style="display:flex; justify-content:space-between">
                  <div style="width:60%">
                    <p>
                      <strong>+</strong>
                      {{ item.quantity }} x
                      {{ item.detail.name }} x 
                      ${{ item.detail.price }}
                    </p>
                  </div>

                  <div style="width:30%">
                    <p>
                      <strong>+ </strong>
                      {{ " $" + item.quantity * item.detail.price }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-overview-footer">
              <p>
                <strong style="color: #333">Subtotal: </strong> $
                {{ orderDetail.subtotal }}
              </p>
              <p>
                <strong style="color: #333">Costo Despacho: </strong> $
                {{ orderDetail.deliveryCost }}
              </p>
              <p>
                <strong style="color: #333">Total: </strong>$
                {{ orderDetail.total }}
              </p>
            </div>
          </q-tab-panel>
          <q-tab-panel
            name="two"
            v-if="orderDetail.payDetail"
          >
            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="blacklight" name="perm_identity" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ orderDetail.requestedTime }}</q-item-label>
                  <q-item-label caption
                    >{{ orderDetail.payDetail.user }} - tlf:
                    {{ orderDetail.payDetail.userPhone }}</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="blacklight" name="payment" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Tipo de pago:</q-item-label>
                  <q-item-label caption>{{
                    orderDetail.payDetail.pay
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-if="orderDetail.orderType!=='retiro'">
                <q-item-section avatar>
                  <q-icon color="blacklight" name="location_on" />
                </q-item-section>

                <q-item-section >
                  <q-item-label>Dirección de despacho</q-item-label>
                  <q-item-label caption>{{
                    orderDetail.payDetail.address
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-section class="q-pt-none"> </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="sm" v-close-popup rounded color="primary" label="Cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
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
  height: 220px !important;
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
  padding-top: 15px;
  display: flex;
  justify-content: right;
  align-items: right;
  flex-direction: column;
  p {
    text-align: right;
    margin-bottom: 0;
  }
}
</style>
