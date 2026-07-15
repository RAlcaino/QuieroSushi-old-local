<template>
  <q-dialog
    :value="shouldShowModal"
    persistent
    no-esc-dismiss
    @input="onDialogInput"
  >
    <q-card
      class="my-card"
      :style="isMigrationBlock ? migrationCardStyle : debtCardStyle"
    >
      <q-card-section class="card-section-modal-new-o">
        <q-avatar
          style="width:80px; height:80px; font-size:110px"
          :icon="isMigrationBlock ? 'campaign' : 'error'"
          text-color="primary"
        />

        <template v-if="isMigrationBlock">
          <span class="q-ml-sm block-title">
            {{ migrationTitle }}
          </span>
          <p class="q-mt-md q-mb-sm text-body2 text-center migration-copy">
            Este panel antiguo solo estará disponible por
            <strong>pocos días</strong>. Después deberás usar el
            <strong>nuevo panel</strong> para gestionar pedidos.
          </p>
          <ol class="migration-steps q-mb-md">
            <li>
              Entra a
              <a
                :href="newPanelUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="panel-migration-link"
              >{{ newPanelHost }}</a>.
            </li>
            <li>
              Inicia sesión con el mismo correo y solicita el código que te
              llegará al mail para iniciar sesión. Una vez dentro, podrás generar
              una nueva clave si quieres ingresar de la manera tradicional.
            </li>
            <li>Gestiona tus pedidos desde el nuevo panel.</li>
          </ol>
          <p class="text-body2 text-center migration-copy q-mb-sm">
            Si <strong>no tienes acceso</strong> al correo con el que ingresas
            normalmente, contáctanos por WhatsApp. El mensaje ya incluirá tus
            locales.
          </p>
          <p class="text-caption text-center text-grey-7 q-mb-none">
            Cuando termine la migración, el panel definitivo quedará en
            <strong>{{ finalPanelHost }}</strong>.
          </p>
        </template>

        <span v-else class="q-ml-sm block-title">{{ debtTitle }}</span>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="isMigrationBlock && showCloseButton"
          flat
          color="primary"
          label="Cerrar"
          style="font-size: 11px !important"
          @click="closeModalDebt()"
        />
        <q-btn
          v-if="isMigrationBlock && !allowClose"
          flat
          color="primary"
          label="Cerrar sesión"
          style="font-size: 11px !important"
          @click="logoutFromMigration()"
        />
        <q-btn
          v-if="isMigrationBlock"
          rounded
          color="positive"
          label="Contactar soporte"
          icon="fab fa-whatsapp"
          style="font-size: 11px !important"
          :href="supportWhatsAppUrl"
          target="_blank"
          rel="noopener noreferrer"
        />
        <q-btn
          v-if="isMigrationBlock"
          rounded
          color="primary"
          label="Ir al nuevo panel"
          icon="open_in_new"
          style="font-size: 11px !important"
          :href="newPanelUrl"
          target="_blank"
          rel="noopener noreferrer"
        />
        <q-btn
          v-else
          rounded
          color="primary"
          :label="getLabel()"
          style="font-size: 11px !important"
          @click="closeModalDebt()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getPanelBlockConfig } from "src/config/panelBlock";
import { buildSupportWhatsAppMessage } from "src/utils/supportWhatsAppMessage";

export default {
  inject: ["logout"],
  props: ["open"],
  computed: {
    panelBlock() {
      return getPanelBlockConfig();
    },
    isMigrationBlock() {
      return this.$store.getters["auth/getDataUser"].blockReason === "migration";
    },
    locals() {
      return this.$store.getters["auth/getDataLocals"] || [];
    },
    qdLocals() {
      return this.$store.getters["auth/getDataQDLocals"] || [];
    },
    allLocals() {
      return [...this.locals, ...this.qdLocals];
    },
    allowClose() {
      return this.panelBlock.allowClose !== false;
    },
    allLocalsBlocked() {
      return (
        this.locals.length > 0 &&
        this.locals.every(item => item._panelMigrationBlock)
      );
    },
    hasAllowedLocals() {
      return this.locals.some(item => item.localStatus === "normal");
    },
    mustStayOpen() {
      if (!this.isMigrationBlock) {
        return false;
      }

      if (!this.locals.some(item => item._panelMigrationBlock)) {
        return false;
      }

      return !this.allowClose;
    },
    showCloseButton() {
      return this.isMigrationBlock && this.allowClose;
    },
    shouldShowModal() {
      if (
        this.isMigrationBlock &&
        !this.locals.some(item => item._panelMigrationBlock)
      ) {
        return false;
      }

      if (this.mustStayOpen) {
        return true;
      }

      return this.open;
    },
    isCajero() {
      return this.$store.getters["auth/getDataUser"].role === "Cajero";
    },
    newPanelUrl() {
      return this.panelBlock.newPanelUrl;
    },
    finalPanelUrl() {
      return this.panelBlock.finalPanelUrl;
    },
    newPanelHost() {
      return this.newPanelUrl.replace(/^https?:\/\//, "");
    },
    finalPanelHost() {
      return this.finalPanelUrl.replace(/^https?:\/\//, "");
    },
    supportWhatsAppUrl() {
      const phone = String(this.panelBlock.supportWhatsApp || "").replace(
        /\D/g,
        ""
      );
      const text = encodeURIComponent(
        buildSupportWhatsAppMessage(
          this.panelBlock.supportWhatsAppMessage,
          this.allLocals
        )
      );
      return `https://wa.me/${phone}?text=${text}`;
    },
    migrationCardStyle() {
      return "width: 520px; max-width: 95vw; border-radius:10px";
    },
    debtCardStyle() {
      return "width: 330px; height:250px; border-radius:10px";
    },
    migrationTitle() {
      return this.locals.length > 1
        ? "Tus locales ya usan el panel nuevo"
        : "Tu local ya usa el panel nuevo";
    },
    debtTitle() {
      if (this.allLocalsBlocked) {
        return this.locals.length > 1
          ? "¡Tienes todos tus locales bloqueados!"
          : "¡Tu local esta bloqueado!";
      }

      return "¡Tienes algunos de tus locales bloqueados!";
    }
  },
  methods: {
    onDialogInput(value) {
      if (!value && this.mustStayOpen) {
        return;
      }

      if (!value) {
        this.$store.commit("auth/setDebt", false);
      }
    },
    logoutFromMigration() {
      this.logout();
    },
    closeModalDebt() {
      if (this.mustStayOpen) {
        return;
      }

      this.$store.commit("auth/setDebt", false);

      if (this.allLocalsBlocked && this.isCajero) {
        this.logout();
      }
    },
    getLabel() {
      if (this.allLocalsBlocked && this.isCajero) {
        return "Cerrar Sesión";
      }

      return "Cerrar";
    }
  }
};
</script>

<style lang="scss" scoped>
.block-title {
  font-size: 20px;
  text-align: center;
  display: block;
}

.migration-copy,
.migration-steps {
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.migration-steps {
  padding-left: 20px;
  text-align: left;
}

.panel-migration-link {
  color: #ff2d2d;
  font-weight: 600;
}
</style>
