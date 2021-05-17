<template>
  <q-page class="q-pa-sm" style="background:white; padding-bottom:125px">
    <new-user-dialog></new-user-dialog>
    <edit-user-dialog></edit-user-dialog>
    <delete-user-dialog></delete-user-dialog>
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="group" />
      <q-toolbar-title :style="FontSize"> Administrar usuarios</q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="sync"
        class="q-mr-xs"
        @click="sync(false)"
      />
    </q-toolbar>

    <div
      class="fit column no-wrap justify-center items-center content-center"
      style="margin-top:20px"
    >
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="data.length === 0 && searching === false"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron cupones
        </p>
      </div>
      <div
        style="margin-top:100px;border-radius:100%; overflow:hidden"
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
      <q-table
        v-if="data.length !== 0 && searching === false"
        :data="data"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
        no-results-label="No se encontraron usuarios"
        rows-per-page-label="Usuarios por página"
        row-key="name"
        style="width:70%;border-radius:15px"
      >
        <template v-slot:top-right>
          <q-input dense debounce="300" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:top-left>
          <q-btn
            color="green"
            rounded
            size="sm"
            @click="dialogNew()"
          >
            <q-icon style="margin-right:5px" size="20px" name="add_circle" />
            <div style="font-size:12px">Nuevo</div>
          </q-btn>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>Acciones</q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <div style="width:100%; display:flex; justify-content:center">
                <q-btn
                  color="primary"
                  round
                  size="sm"
                  style="margin-right: 20px"
                  @click="dialogDelete(props.row)"
                >
                  <q-icon size="20px" name="delete" />
                </q-btn>
                <q-btn
                  color="blue"
                  round
                  size="sm"
                  @click="dialogEdit(props.row)"
                >
                  <q-icon size="20px" name="edit" />
                </q-btn>
              </div>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'status'">
                <status-component
                  :value="col.value"
                  :userId="props.name"
                ></status-component>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import StatusComponent from "../../../components/bases/StatusComponent.vue";

import NewUserDialog from "./dialogs/NewUserDialog.vue";
import DeleteUserDialog from "./dialogs/DeleteUserDialog.vue";
import EditUserDialog from "./dialogs/EditUserDialog.vue";

export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  components: {
    StatusComponent,
    NewUserDialog,
    DeleteUserDialog,
    EditUserDialog
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
  },
  mounted() {
    this.flag = true;
    this.searching = true;
    setTimeout(() => {
      this.flag = false;
      this.searching = false;
      this.data = this.response;
    }, 3000);
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
  data() {
    return {
      filter: "",
      searching: false,
      flag: false,
      responsiveMobile: false,
      data: [],
      pagination: {
        rowsPerPage: 20,
        current_page: 1
      },
      columns: [
        {
          name: "status",
          required: true,
          label: "Estado",
          align: "center",
          field: "status"
        },
        {
          name: "email",
          align: "center",
          label: "Correo",
          field: "email",
          sortable: true
        },
        {
          name: "role",
          align: "center",
          label: "Rol",
          field: "role",
          sortable: true
        }
      ],
      response: [
        {
          id: 1,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 2,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 3,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 4,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 5,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 6,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 7,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 8,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        }
      ]
    };
  },
  methods: {
    dialogEdit(row) {
      this.bus.$emit('open-edit-user',row);
    },
    dialogDelete(row) {
      this.bus.$emit('open-delete-user',row);     
    },
    dialogNew() {
      this.bus.$emit('open-new-user');
    }
  }
};
</script>

<style lang="scss"></style>
