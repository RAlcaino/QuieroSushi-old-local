<template>
  <q-page class="q-pa-sm" style="background:white; max-height: 600px; padding-bottom: 20px ; overflow: auto;">
    <q-toolbar v-if="toolbar" class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense :icon="icon" />
      <q-toolbar-title :style="FontSize"> {{ title }}</q-toolbar-title>
      <q-btn
        v-if="sync"
        flat
        round
        dense
        icon="sync"
        class="q-mr-xs"
        @click="sync(false)"
      />
    </q-toolbar>

    <slot></slot>
  </q-page>
</template>

<script>
export default {
  props: ["title", "sync", "icon", "toolbar"],
  data() {
    return {
      responsiveMobile: false
    };
  },
  computed: {
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    }
  },
  mounted() {
    this.responsiveMode();
  },
  methods: {
    responsiveMode() {
      var responsive = window.matchMedia("(max-width: 900px)");

      if (screen.width < 900) {
        this.responsiveMobile = true;
      }

      responsive.addListener(event => {
        if (event.matches) {
          this.responsiveMobile = true;
        } else {
          this.responsiveMobile = false;
        }
      });
    }
  }
};
</script>

<style></style>
