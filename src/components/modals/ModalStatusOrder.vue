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
            name="support_agent"
          />
          Servicio al cliente
        </div>
        <q-space />
        <q-btn
          icon="close"
          color="white"
          flat
          round
          dense
          @click="open = false"
        />
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
                <p v-if="data.type !== 'despacho'">
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
              <div style="width: 100%; max-width: 400px">
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
            src="~/assets/maki-roll.gif"
            alt="sad"
            width="130"
            style="border-radius:100%"
          />
        </div>
      </q-card-section>

      <q-card-actions style="height: 20%; width: 100%; display:block;">
        <div class="q-pa-md" style="display: flex;">
          <q-input
            v-model="text"
            dense
            outlined
            :maxlength="100"
            counter
            rounded
            autogrow
            style="width:100%;margin-right:5px;"
          />
          <q-btn
            color="green"
            round
            :disable="validation"
            size="sm"
            @click="notify()"
            style="width: 35px; height:35px; margin-top: 3px;"
          >
            <q-icon size="20px" name="send" />
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
      } else {
        return false;
      }
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
      this.init(data);
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
      return origen === "Local" ? require("src/assets/store.png") : require("src/assets/sca.png");
    },
    init(data) {
      var url = this.$store.getters["routes/getRoute"]("get.chat", {
        orderId: data.id_venta
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.data = { ...data, ...response.data.result };
            $(document).ready(function() {
              /*var t = document.getElementById("chat");
              t.scrollTop=t.scrollHeight;*/
              $("#chat").animate(
                { scrollTop: $("#chat").prop("scrollHeight") },
                1000
              );
            });
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
        });
    }
  }
};
</script>

<style></style>
