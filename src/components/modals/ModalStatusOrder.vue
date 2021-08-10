<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="border-radius:10px;width: 500px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="contact_support"
          />
          ¿Cual es el estado del pedido?
        </div>
      </q-card-section>

      <q-card-section v-if="data !== null">
        <q-list>
          <q-item>
            <q-item-section avatar top>
              <q-icon name="message" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Mensaje</strong></q-item-label>
              <q-item-label>{{ data.mensaje }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item style="margin-top: 10px;">
            <q-item-section avatar top>
              <q-icon name="help_center" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Estado</strong></q-item-label>
              <q-option-group
                :options="options"
                type="radio"
                v-model="group"
                @input="changeStatus()"
              />
            </q-item-section>
          </q-item>
          <q-item style="margin-top: 10px;" v-if="group === 'delay'">
            <q-item-section avatar top>
              <q-icon name="schedule" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                ><strong>¿A que hora aproximadamente?</strong></q-item-label
              >
              <q-input
                v-model="time"
                mask="time"
                :rules="['time']"
                dense
                outlined
                rounded
                label="Hora"
                style="margin-top: 10px; width:50%;"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="time" format24h>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          :disable="validation"
          color="green"
          label="Notificar"
          style="font-size: 11px !important"
          @click="notify()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  computed: {
    validation() {
      if (this.group === null) {
        return true;
      }
      if (this.group === "delay" && this.time === null) {
        return true;
      }
    }
  },
  data() {
    return {
      open: false,
      data: null,
      options: [
        { label: "Ya esta en camino", value: "on-the-way", color: "green" },
        { label: "Ya esta por salir", value: "almost-ready", color: "blue" },
        {
          label: "Llegara mas tarde de lo acordado",
          value: "delay",
          color: "red"
        }
      ],
      group: null,
      time: null
    };
  },
  created() {
    this.bus.$on("modal-status-order-?", data => {
      this.open = true;
      this.data = { ...data };
      console.log(data);
    });
  },
  methods: {
    notify() {
      let msg = "";
      let each = this.options.map(el => {
        if (el.value === this.group) {
          msg = el.label;
        }
      });
      var data = {
        orderId: this.data.id_venta,
        message:
          this.group === "delay" ? `${msg} ${this.time}.` : msg
      };
      var url = this.$store.getters["routes/getRoute"](
        "notification.status.order"
      );
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.open = false;
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    changeStatus() {
      if (this.group !== "delay") {
        this.time = null;
      }
    }
  }
};
</script>

<style></style>
