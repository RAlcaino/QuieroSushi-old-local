<template>
  <div>
    <div v-if="!toggle" style="margin-top: 15px;">
      <q-btn
        @click="toggle = !toggle"
        rounded
        color="green"
        :size="`sm`"
        :label="`Responder`"
      />
    </div>
    <div v-else class="q-pa-md" style="display: flex; flex-direction: column;">
      <div style="display: flex;">
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
      <div>
        <q-btn
          @click="close()"
          rounded
          color="primary"
          :size="`sm`"
          :label="`Cerrar`"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["comment", "local"],
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getServerTime"
  ],
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
  data() {
    return {
      toggle: false,
      text: "",
      sendingMsg: false
    };
  },
  mounted() {},
  methods: {
    notify() {
      if (this.validation) {
        return;
      }
      this.sendingMsg = true;

      let data = {
        comentario: this.text,
        id_comentario: this.comment,
        id_local: this.local,
        fecha: this.getServerTime()
      };

      var url = this.$store.getters["routes/getRoute"]("do.reply");
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.bus.$emit("refresh-comments");
          } else {
            this.showNotification(response.data.message, "negative", "error");
            this.sendingMsg = false;
          }
        })
        .catch(error => {
          this.errorHandling(error);
          this.sendingMsg = false;
        });
    },
    close() {
      this.toggle = !this.toggle;
      this.text = "";
    }
  }
};
</script>

<style></style>
