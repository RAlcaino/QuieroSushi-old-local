<template>
  <q-page class="q-pa-sm" style="background:white; padding-bottom:125px">
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="question_answer" />
      <q-toolbar-title>
        Comentarios en {{ localSelected.label }}</q-toolbar-title
      >
      <q-btn flat round dense icon="sync" class="q-mr-xs" @click="getComments(true)" />
    </q-toolbar>

    <div
      class="text-h6"
      style="width: 95%;display: flex; flex-direction:row; justify-content:flex-end; margin-top:20px;"
      v-if="locals.length > 1"
    >
      <div>
        <q-select
          outlined
          rounded
          dense
          v-model="localSelected"
          :options="locals"
          label="Locales"
          @input="change"
        />
      </div>
    </div>
    <div
      v-if="comments.length > 0 && flag === false"
      class="fit row no-wrap justify-center items-center content-center"
    >
      <q-card class="class__card">
        <q-list bordered class="rounded-borders" style="max-width: 100%">
          <q-item-label header>Recientes</q-item-label>

          <div v-for="comment in comments" :key="comment.comentario_id">
            <q-item style="margin: 10px">
              <q-item-section avatar top>
                <q-avatar icon="person" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1000">{{
                  comment.comentario
                }}</q-item-label>
                <q-item-label
                  v-if="comment.replica_id !== null"
                  caption
                  lines="1000"
                  style="font-size: 13px;"
                >
                  <span class="text-weight-bold">
                    <q-btn flat round dense icon="question_answer"
                  /></span>
                  {{ comment.replica }}
                </q-item-label>
                <q-item-label
                  v-else
                  caption
                  lines="1000"
                  style="font-size: 13px;"
                >
                  <input-comments
                    :comment="comment.comentario_id"
                    :local="localSelected.value"
                  ></input-comments>
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                {{ comment.fecha_comentario }}
              </q-item-section>
            </q-item>

            <q-separator inset />
          </div>
        </q-list>
      </q-card>
    </div>
    <div
      v-else
      class="fit row no-wrap justify-center items-center content-center"
    >
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <div
        class="fit column wrap justify-center items-center content-center"
        v-if="comments.length === 0 && flag === false"
        style="margin-top:100px"
      >
        <img src="../../../assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron comentarios
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import InputComments from "../../../components/bases/InputComments.vue";

export default {
  components: {
    InputComments
  },
  created() {
    this.init();
    this.getComments(true);

    this.bus.$on("refresh-comments", () => {
      this.getComments(false);
    });
  },
  data() {
    return {
      locals: [],
      localSelected: "",
      comments: [],
      flag: false
    };
  },
  methods: {
    init() {
      this.formatLocals();
    },
    formatLocals() {
      this.locals = [];
      var each = this.$store.getters["auth/getDataLocals"].map(item => {
        let row = {
          value: item.id,
          label: item.name + ", " + item.commune,
          image: item.image,
          commune: item.commune,
          name: item.name,
          cartStatus: item.cartStatus
        };
        this.locals.push(row);
        this.locals.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      });

      this.localSelected = this.locals[0];
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.getComments(true);
      }
    },
    getComments(flag) {
      if (flag) {
        this.flag = true;
      }
      var url = this.$store.getters["routes/getRoute"]("get.comments", {
        localId: this.localSelected.value
      });
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.comments = response.data.result.filter(
              comment =>
                comment.comentario !== "-- Usuario no ha dejado comentario --"
            );
            this.flag = false;
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

<style lang="scss" scoped>
.class__card {
  width: 50%;
  height: auto;
  border-radius: 15px;
  margin-top: 50px;
}</style
>>
