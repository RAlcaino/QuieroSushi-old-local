<template>
  <div>
    <div v-for="(msg, index) in messages" :key="msg.date">
      <q-item style="max-width: 420px; padding: 5 16px;" clickable v-ripple>
        <q-item-section avatar top class="avatar__notif__styles">
          <div>
            <div class="live-c" v-if="msg.visto === 0"></div>
            <q-avatar icon="email" text-color="primary" />
          </div>
          <p style="margin: 0; font-size: 12.5px;">
            {{ msg.fecha.substring(0, 16) }}
          </p>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ msg.mensaje }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator v-if="index + 1 !== messages.length" spaced inset />
    </div>
  </div>
</template>

<script>
export default {
  name: "Messages",
  mounted() {
    this.messages = this.$store.getters["auth/getUserNotifications"];
  },
  data() {
    return {
      messages: []
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar__notif__styles {
  display: flex;
  align-items: center !important;
}

.live-c {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 100%;
  margin-bottom: 2px;
  animation: live-animation 1s linear infinite;
}

@keyframes live-animation {
  50% {
    opacity: 0.2;
    color: red;
  }
}
</style>
