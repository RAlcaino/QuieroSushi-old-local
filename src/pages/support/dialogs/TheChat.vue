<template>
  <modal-base
    :open="open"
    :width="700"
    :closeModal="closeModal"
    title="Chat"
    icon="chat"
  >
    <q-card-section
      id="chat"
      style="max-height: 50vh;"
      class="row items-center justify-center scroll"
      v-if="data !== null"
    >
      <div style="width: 90%;" v-if="data.comments.length !== 0">
        <q-chat-message
          v-for="comment in data.comments"
          :key="comment.id"
          :name="comment.origen"
          :text="[comment.comentario]"
          :sent="comment.origen === 'Local' ? true : false"
          :stamp="comment.created_at"
        />
      </div>
      <div v-else class="center-div">
        <p
          style="font-size:14px; font-weight:bold;text-align:center;margin-top:3px;"
        >
          No hay mensajes
        </p>
      </div>
    </q-card-section>

    <template v-if="data !== null">
      <q-separator v-if="data.flag"></q-separator>

      <q-card-actions
        v-if="data.flag"
        style="height: 20%; width: 100%; display:block;"
      >
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
    </template>
  </modal-base>
</template>

<script>
import $ from "jquery";
import ModalBase from "src/components/modals/ModalBase.vue";
export default {
  props: ["sync"],
  components: { ModalBase },
  data() {
    return {
      open: false,
      data: null,
      text: "",
      sendingMsg: false,
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
        },
        {
          id: 66,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 77,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 87,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 97,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 107,
          id_venta: 2,
          origen: "SAC",
          mensaje: "Que pasa con la orden?",
          timestamp: "2021-08-10 19:45:12"
        },
        {
          id: 117,
          id_venta: 2,
          origen: "Local",
          mensaje: "Salio hace 20 minutos",
          timestamp: "2021-08-10 19:45:12"
        }
      ]
    };
  },
  computed: {
    validation() {
      if (this.text === null || this.text.trim().length === 0) {
        return true;
      }

      if (this.sendingMsg) {
        return true;
      }

      return false;
    }
  },
  created() {
    this.bus.$on("modal-chat-support", data => {
      this.open = true;
      this.data = data;
      this.sendingMsg = false;
      this.text = "";
      this.moveDownChat();
    });
    this.bus.$on("modal-chat-update", data => {
      this.data = data;
      this.text = "";
      this.sendingMsg = false;
      this.moveDownChat();
    });
  },
  methods: {
    closeModal() {
      this.open = false;
    },
    notify() {
      this.sendingMsg = true;
      let data = {
        origen:
          this.$store.getters["auth/getDataUser"].role === "God"
            ? "Soporte"
            : "Local",
        comentario: this.text,
        ticket_id: this.data.id_ticket
      };
      var url = this.$store.getters["routes/getRoute"]("comments");
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.sync(this.data);
          }

          this.sendingMsg = false;
        })
        .catch(error => {
          this.errorHandling(error);
        });
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

<style></style>
