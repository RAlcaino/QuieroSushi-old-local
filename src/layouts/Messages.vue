<template>
  <div>
    <div v-for="(msg, index) in messages" :key="msg.date">
      <q-item style="max-width: 420px; padding: 5 16px;" clickable v-ripple>
        <q-item-section avatar top class="avatar__notif__styles">
          <q-avatar icon="email" text-color="primary" />
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
</style>
