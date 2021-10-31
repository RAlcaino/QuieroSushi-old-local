<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      style="border-radius:10px;width: 600px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        v-if="data !== null"
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white; font-size: 18px;">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="20px"
            name="support_agent"
          />
          Servicio Al Cliente — N° Pedido:
          {{
            $store.getters["auth/getDataUser"].role === "God"
              ? `${data === undefined ? this.data.id_venta : data.id_venta} - ${
                  data.internalCode
                }`
              : data.internalCode
          }}
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="close()" />
      </q-card-section>

      <q-card-section
        id="chat"
        v-if="data !== null"
        style="overflow-y: auto;"
        :style="chatHeight"
      >
        <q-list>
          <q-item style="margin-top: 10px;">
            <q-item-section avatar top>
              <q-icon name="person" color="primary" />
            </q-item-section>
            <q-item-section v-if="customerDataAvailable">
              <q-item-label
                ><strong>Cliente: </strong
                >{{ data.client.nombre }}</q-item-label
              >
              <div style="margin-top: 15px;">
                <p>
                  <strong>Telefono (+56):</strong> {{ data.client.telefono }}
                </p>
                <p><strong>Tipo de venta:</strong> {{ data.type }}</p>
                <p v-if="data.type !== 'retiro' && data.address.length !== 0">
                  <strong>Direccion:</strong> {{ data.address[0].direccion }}.
                  Dpto/Ubicacion: {{ data.address[0].direccion2 }}.
                  {{ data.address[0].comuna }}
                </p>
              </div>
            </q-item-section>
          </q-item>
          <q-item style="margin-top: 10px;">
            <q-item-section avatar top>
              <q-icon name="question_answer" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Chat</strong></q-item-label>
              <div
                style="width: 100%; max-width: 400px"
                v-if="data.chats.length !== 0"
              >
                <q-chat-message
                  v-for="msg in data.chats"
                  :key="msg.id"
                  :name="msg.origen"
                  :avatar="avatarMsg(msg.origen)"
                  :text="[msg.mensaje]"
                  :sent="msg.origen === 'Local' ? true : false"
                  :stamp="msg.timestamp"
                />
              </div>
              <div v-else class="center-div">
                <p
                  style="font-size:14px; font-weight:bold;text-align:center;margin-top:3px;"
                >
                  No hay mensajes
                </p>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-else>
        <div
          style="margin-top:50px"
          class="fit column wrap justify-center items-center content-center"
        >
          <img
            src="~/assets/maki-roll2.gif"
            alt="sad"
            width="130"
            style="border-radius:100%"
          />
          <p
            v-if="newChat"
            style="font-size:14px; font-weight:bold;text-align:center; margin-top: 3px;"
          >
            Nuevo mensaje en otro pedido...
          </p>
        </div>
      </q-card-section>

      <q-card-actions style="height: 20%; width: 100%; display:block;">
        <div class="q-pa-md" style="display: flex;">
          <q-input
            v-model="text"
            dense
            outlined
            :maxlength="60"
            counter
            rounded
            @keyup.enter="notify()"
            style="width:100%;margin-right:5px; height: 60px;"
          />
          <q-btn
            color="green"
            round
            :disable="validation"
            size="sm"
            @click="notify()"
            style="width: 35px; height:35px; margin-top: 3px;"
          >
            <q-icon v-if="!sendingMsg" size="20px" name="send" />
            <q-spinner-hourglass v-if="sendingMsg" size="20px" color="white" />
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import $ from "jquery";
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  computed: {
    validation() {
      if (this.text === null || this.text.trim().length === 0) {
        return true;
      }

      if (this.sendingMsg) {
        return true;
      }

      return false;
    },
    customerDataAvailable() {
      return (
        this.data.client !== undefined &&
        this.data.type !== undefined &&
        this.data.address !== undefined
      );
    },
    chatHeight() {
      if (this.data.chats.length > 2) {
        return {
          height: "450px"
        };
      }
      return {
        height: "300px"
      };
    }
  },
  data() {
    return {
      open: false,
      data: null,
      text: null,
      sendingMsg: false,
      newChat: false,
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
        {
          id: 8,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 9,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 10,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 11,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        }
      ]
    };
  },
  mounted() {
    this.bus.$on("modal-status-order-?", data => {
      this.open = true;
      this.text = null;
      this.sendingMsg = false;
      this.newChat = false;
      this.init(data, "INIT");
    });
  },
  methods: {
    notify() {
      if (this.validation) {
        return;
      }
      this.sendingMsg = true;
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
            this.init(undefined, "REFRESH");
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
      return origen === "Local"
        ? require("src/assets/store.png")
        : require("src/assets/sca.png");
    },
    init(data, action) {
      if (this.data !== null && data !== undefined) {
        if (+this.data.id_venta !== +data.id_venta) {
          this.data = null;
          this.newChat = true;
        } else {
          action = "REFRESH";
        }
      }
      var url = this.$store.getters["routes/getRoute"]("get.chat", {
        orderId: data === undefined ? this.data.id_venta : data.id_venta
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            if (action === "INIT") {
              setTimeout(() => {
                this.data = { ...data, ...response.data.result };
                this.moveDownChat();
                this.newChat = false;
              }, 1200);
            }
            if (action === "REFRESH") {
              this.data.chats = [...response.data.result.chats];
              this.sendingMsg = false;
              this.text = null;
              this.moveDownChat();
              this.newChat = false;
            }
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    close() {
      this.open = false;
      this.data = null;
      this.text = null;
      this.sendingMsg = false;
    },
    moveDownChat() {
      $(document).ready(function() {
        /*var t = document.getElementById("chat");
              t.scrollTop=t.scrollHeight;*/
        $("#chat").animate(
          { scrollTop: $("#chat").prop("scrollHeight") },
          1000
        );
      });
    }
  }
};
</script>

<style>
.center-div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
