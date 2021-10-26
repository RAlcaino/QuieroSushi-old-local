<template>
  <base-page
    :title="`Comentarios en ${localSelected.label}`"
    icon="question_answer"
    :sync="getComments"
    :toolbar="true"
  >
    <div class="text-h6 comment__container__select">
      <div style="margin: 0 5px">
        <q-select
          outlined
          rounded
          dense
          v-model="statusSelected"
          :options="status"
          label="Estados"
          @input="changeStatus"
        />
      </div>
      <div style="margin: 0 5px" v-if="locals.length > 1">
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
      class="fit column no-wrap justify-center items-center content-center"
    >
      <q-card class="class__card">
        <q-list bordered class="rounded-borders" style="max-width: 100%">
          <q-item-label header>Recientes</q-item-label>

          <div v-for="comment in getData" :key="comment.comentario_id">
            <q-item style="margin: 10px">
              <q-item-section avatar top class="avatar__responsive">
                <q-avatar icon="person" color="primary" text-color="white" />
                <p class="comment__date__avatar">
                  {{ comment.fecha_comentario }}
                </p>
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

              <q-item-section side top class="comment__date">
                {{ comment.fecha_comentario }}
              </q-item-section>
            </q-item>
            <q-separator inset />
          </div>
        </q-list>
      </q-card>
      <q-pagination
        v-if="comments.length > perPage"
        v-model="page"
        :max="getMaxPages"
        style="padding-top:25px"
        color="primary"
        input
        @input="scrollTop()"
      />
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
  </base-page>
</template>

<script>
import InputComments from "../../../components/bases/InputComments.vue";
import BasePage from "../../../components/bases/BasePage.vue";

export default {
  inject: ["showNotification", "errorHandling", "scrollTop", "getStoreLocals"],
  components: {
    InputComments,
    BasePage
  },
  created() {
    this.init();
    this.getComments(true);

    this.bus.$on("refresh-comments", () => {
      this.getComments(false);
      this.sendingResponse = true;
    });
  },
  data() {
    return {
      locals: [],
      localSelected: "",
      comments: [],
      flag: false,
      page: 1,
      perPage: 6,
      status: ["Todos", "Sin replicas", "Con replicas"],
      statusSelected: "Todos",
      filteredComments: []
    };
  },
  computed: {
    getData() {
      if (this.statusSelected === "Todos") {
        this.filteredComments = [...this.comments];
      } else if (this.statusSelected === "Sin replicas") {
        this.filteredComments = [
          ...this.comments.filter(item => item.replica_id === null)
        ];
      } else if (this.statusSelected === "Con replicas") {
        this.filteredComments = [
          ...this.comments.filter(item => item.replica_id !== null)
        ];
      }
      return this.filteredComments.slice(
        (this.page - 1) * this.perPage,
        (this.page - 1) * this.perPage + this.perPage
      );
    },
    getMaxPages() {
      return Math.ceil(this.filteredComments.length / this.perPage);
    }
  },
  methods: {
    init() {
      this.formatLocals();
    },
    formatLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      this.localSelected = this.locals[0];
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.statusSelected = "Todos";
        this.page = 1;
        this.getComments(true);
      }
    },
    changeStatus(val) {
      if (val !== null) {
        this.page = 1;
      }
    },
    getComments() {
      this.flag = true;
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
  width: 90%;
  height: auto;
  border-radius: 15px;
}

.comment__container__select {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 20px auto;
}

.comment__date__avatar {
  display: none;
}

@media screen and (max-width: 500px) {
  .class__card {
    width: 95%;
  }

  .comment__container__select {
    justify-content: center;
  }

  .comment__date {
    display: none;
  }

  .avatar__responsive {
    align-items: center !important;
  }
  .comment__date__avatar {
    display: block;
    padding: 5px 0;
    font-size: 13px;
  }
}
</style>
