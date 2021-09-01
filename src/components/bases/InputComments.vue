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
    }
  },
  data() {
    return {
      toggle: false,
      text: "",
      sendingMsg: false
    };
  },
  methods: {
    notify() {
      if (this.validation) {
        return;
      }
      this.sendingMsg = true;

      setTimeout(()=>{
          this.sendingMsg = false;
      },1000);
    },
    close() {
      this.toggle = !this.toggle;
      this.text = "";
    }
  }
};
</script>

<style></style>
