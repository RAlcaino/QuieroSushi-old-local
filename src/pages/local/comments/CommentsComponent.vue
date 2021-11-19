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

          <div v-for="comment in comments" :key="comment.comentario_id">
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
        v-if="meta.total > perPage"
        v-model="page"
        :max="meta.lastPage"
        style="padding-top:25px"
        color="primary"
        input
        @input="getComments()"
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
          src="~/assets/maki-roll2.gif"
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
          No se encontraron comentarios {{ this.statusSelected.toLowerCase() }}
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
      perPage: 15,
      status: ["Sin replicas", "Con replicas"],
      statusSelected: "Sin replicas",
      filteredComments: [],
      meta: {
        lastPage: 0,
        total: 0
      }
    };
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
        this.statusSelected = "Sin replicas";
        this.page = 1;
        this.getComments(true);
      }
    },
    changeStatus(val) {
      if (val !== null) {
        this.page = 1;
        this.getComments();
      }
    },
    getComments() {
      this.flag = true;
      var filters = this.filters();
      var url = `${this.$store.getters["routes/getRoute"]("get.comments", {
        localId: this.localSelected.value
      })}${filters}`;
      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.comments = response.data.result.data;
            this.flag = false;
            this.meta = {
              lastPage: response.data.result.meta.total_pages,
              total: response.data.result.meta.total
            };
          } else {
            this.showNotification(response.data.message, "negative", "error");
          }
        })
        .catch(error => {
          this.errorHandling(error);
          this.flag = false;
        });
    },
    filters() {
      if (this.statusSelected === "Con replicas") {
        return `?reply=1&page=${this.page}`;
      } else if (this.statusSelected === "Sin replicas") {
        return `?reply=0&page=${this.page}`;
      }
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
