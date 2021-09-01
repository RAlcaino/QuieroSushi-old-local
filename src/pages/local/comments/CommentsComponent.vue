<template>
  <q-page class="q-pa-sm" style="background:white; padding-bottom:125px">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="question_answer" />
      <q-toolbar-title> Comentarios</q-toolbar-title>
      <q-btn flat round dense icon="sync" class="q-mr-xs" />
    </q-toolbar>

    <div class="fit row no-wrap justify-center items-center content-center">
      <q-card class="class__card">
        <q-list bordered class="rounded-borders" style="max-width: 100%">
          <q-item-label header>Recientes</q-item-label>

          <q-item style="margin: 10px">
            <q-item-section avatar top>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Brunch this weekend?</q-item-label>
              <q-item-label caption lines="1000" style="font-size: 13px;">
                <span class="text-weight-bold">
                  <q-btn flat round dense icon="question_answer"
                /></span>
                I'll be in your neighborhood doing errands this weekend. Do you
                want to grab brunch?
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              1 min ago
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item style="margin: 10px">
            <q-item-section avatar top>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Brunch this weekend?</q-item-label>
              <q-item-label caption lines="1000" style="font-size: 13px;">
                <span class="text-weight-bold">
                  <q-btn flat round dense icon="question_answer"
                /></span>
                I'll be in your neighborhood doing errands this weekend. Do you
                want to grab brunch?
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              1 min ago
            </q-item-section>
          </q-item>

          <q-separator inset />
          <q-item style="margin: 10px">
            <q-item-section avatar top>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Brunch this weekend?</q-item-label>
              <q-item-label caption lines="1000" style="font-size: 13px;">
                <span class="text-weight-bold">
                  <q-btn flat round dense icon="question_answer"
                /></span>
                I'll be in your neighborhood doing errands this weekend. Do you
                want to grab brunch?
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              1 min ago
            </q-item-section>
          </q-item>

          <q-separator inset />
          <q-item style="margin: 10px">
            <q-item-section avatar top>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Brunch this weekend?</q-item-label>
              <q-item-label caption lines="1000" style="font-size: 13px;">
                <input-comments></input-comments>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              1 min ago
            </q-item-section>
          </q-item>

          <q-separator inset />
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import InputComments from "../../../components/bases/InputComments.vue";

export default {
  components: {
    InputComments
  }
};
</script>

<style lang="scss" scoped>
.class__card {
  width: 50%;
  height: auto;
  border-radius: 15px;
  margin-top: 50px;
}</style
>>
