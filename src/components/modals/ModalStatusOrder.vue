<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="border-radius:10px;width: 600px; max-width: 80vw; overflow:hidden"
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

      <q-card-section
        v-if="data !== null"
        style="height: 450px; overflow-y: auto;"
      >
        <q-list>
          <q-item>
            <q-item-section avatar top>
              <q-icon name="message" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Último Mensaje</strong></q-item-label>
              <q-item-label>{{ data.mensaje }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item style="margin-top: 10px;">
            <q-item-section avatar top>
              <q-icon name="help_center" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Respuesta</strong></q-item-label>
              <div class="q-pa-md" style="display: flex;">
                <q-input
                  v-model="text"
                  dense
                  outlined
                  rounded
                  autogrow
                  style="width:80%;margin-right:5px;"
                />
                <q-btn
                  color="green"
                  round
                  :disable="validation"
                  size="sm"
                  @click="notify()"
                  style="width: 35px; height:35px; margin-top: 2px;"
                >
                  <q-icon size="20px" name="send" />
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-item style="margin-top: 10px;">
            <q-item-section avatar top>
              <q-icon name="question_answer" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Chat</strong></q-item-label>
              <div style="width: 100%; max-width: 400px">
                <q-chat-message
                  v-for="msg in messages"
                  :key="msg.id"
                  :name="msg.origen"
                  :avatar="avatarMsg(msg.origen)"
                  :text="[msg.mensaje]"
                  :sent="msg.origen === 'Local' ? true : false"
                  :stamp="msg.timestamp"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!--<q-card-actions align="right" style="height: 20%;">
        <q-btn
          rounded
          :disable="validation"
          color="green"
          label="Notificar"
          style="font-size: 11px !important"
          @click="notify()"
        />
      </q-card-actions>-->
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  computed: {
    validation() {
      if (this.text === null || this.text.trim().length === 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      open: false,
      data: null,
      text: null,
      messages: [
        {
          id: 6,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 7,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        },
      ]
    };
  },
  created() {
    this.bus.$on("modal-status-order-?", data => {
      this.open = true;
      this.data = { ...data };
    });
  },
  methods: {
    notify() {
      var data = {
        orderId: +this.data.id_venta,
        message: this.text
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
    },
    avatarMsg(origen) {
      return origen === "Local" ? "img/store.png" : "img/sca.png";
    }
  }
};
</script>

<style></style>
