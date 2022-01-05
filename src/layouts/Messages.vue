<template>
  <div>
    <q-item
      style="max-width: 420px"
      v-for="msg in messages"
      :key="msg.date"
      clickable
      v-ripple
    >
      <q-item-section avatar top class="avatar__notif__styles">
        <q-avatar icon="email" text-color="primary"/>
        <p style="margin: 0; font-size: 12.5px;">
          {{ msg.date }}
        </p>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ msg.msg }}</q-item-label>
      </q-item-section>
    </q-item>
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
