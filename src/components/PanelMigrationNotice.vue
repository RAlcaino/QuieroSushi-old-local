<template>
  <div v-if="showNotice">
    <q-banner dense inline-actions class="text-white bg-warning panel-migration-banner">
      <template v-slot:avatar>
        <q-icon name="info" color="white" />
      </template>
      <span>
        <span v-if="hasCountdown" class="panel-migration-countdown-inline q-mr-sm">
          <q-icon name="schedule" size="16px" class="q-mr-xs" />
          <strong>{{ countdownLabel }}</strong>
        </span>
        <strong>Empieza a usar el nuevo panel hoy</strong> en
        <a
          href="https://local.qsushi.cl"
          target="_blank"
          rel="noopener noreferrer"
          class="panel-migration-link"
        >local.qsushi.cl</a>.
        Este panel será reemplazado el <strong>7 de julio a las 8:00 AM</strong>.
      </span>
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Ver detalles"
          @click="openModal"
        />
      </template>
    </q-banner>

    <q-dialog v-model="modalOpen" persistent>
      <q-card class="panel-migration-modal">
        <q-card-section class="row items-center q-pb-none panel-migration-modal__header">
          <div class="text-h6 text-white">
            <q-icon name="campaign" size="24px" class="q-mr-sm" />
            Empieza a usar el nuevo panel
          </div>
          <q-space />
          <q-btn icon="close" color="white" flat round dense @click="closeModal" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div v-if="hasCountdown" class="panel-migration-countdown q-mb-md">
            <p class="text-subtitle2 text-center q-mb-sm text-grey-8">
              Tiempo restante antes de reemplazar este panel
            </p>
            <div class="row justify-center q-gutter-sm">
              <div
                v-for="item in countdownItems"
                :key="item.label"
                class="panel-migration-countdown__item"
              >
                <div class="panel-migration-countdown__value">{{ item.value }}</div>
                <div class="panel-migration-countdown__label">{{ item.label }}</div>
              </div>
            </div>
          </div>
          <p v-else class="text-body1 text-center text-primary q-mb-md">
            <strong>¡Hoy reemplazamos este panel!</strong> Usa el nuevo en
            <a
              href="https://local.qsushi.cl"
              target="_blank"
              rel="noopener noreferrer"
              class="panel-migration-link--dark"
            >local.qsushi.cl</a>.
          </p>

          <p class="text-body1 q-mb-md">
            <strong>Empieza a usar el nuevo panel hoy</strong> para ver y gestionar tus
            pedidos. Entra a
            <a
              href="https://local.qsushi.cl"
              target="_blank"
              rel="noopener noreferrer"
              class="panel-migration-link--dark"
            >local.qsushi.cl</a>,
            un <strong>enlace provisorio</strong> para que te familiarices con el cambio y nos
            envíes tu feedback.
          </p>
          <p class="text-body1 q-mb-md">
            El <strong>7 de julio de 2026 a las 8:00 AM</strong> dejaremos de usar este panel
            y pasaremos definitivamente al nuevo. Cuando termine el proceso, el
            <strong>nuevo panel</strong> volverá a estar disponible en el mismo enlace de siempre:
            <strong>local.quierosushi.cl</strong>.
          </p>
          <p class="text-body1 q-mb-none text-grey-8">
            Mientras tanto, te recomendamos gestionar tus pedidos desde el nuevo panel para
            ir adaptándote antes del cambio.
          </p>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            color="primary"
            label="Cerrar"
            @click="closeModal"
          />
          <q-btn
            rounded
            color="primary"
            label="Ir al nuevo panel"
            icon="open_in_new"
            href="https://local.qsushi.cl"
            target="_blank"
            rel="noopener noreferrer"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
const MIGRATION_DATE = new Date("2026-07-07T08:00:00-04:00");
const MIGRATION_NOTICE_UNTIL = new Date("2026-07-31T23:59:59");
const MODAL_PENDING_KEY = "panel-migration-pending";

export default {
  name: "PanelMigrationNotice",
  data() {
    return {
      modalOpen: false,
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      countdownInterval: null
    };
  },
  computed: {
    showNotice() {
      return new Date() <= MIGRATION_NOTICE_UNTIL;
    },
    hasCountdown() {
      return new Date() < MIGRATION_DATE;
    },
    countdownLabel() {
      const { days, hours, minutes, seconds } = this.countdown;
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    countdownItems() {
      return [
        { label: "días", value: this.pad(this.countdown.days) },
        { label: "horas", value: this.pad(this.countdown.hours) },
        { label: "min", value: this.pad(this.countdown.minutes) },
        { label: "seg", value: this.pad(this.countdown.seconds) }
      ];
    }
  },
  mounted() {
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
    this.openOnLogin();
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
  methods: {
    pad(value) {
      return String(value).padStart(2, "0");
    },
    updateCountdown() {
      const diff = MIGRATION_DATE - new Date();

      if (diff <= 0) {
        this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return;
      }

      this.countdown = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    },
    openOnLogin() {
      if (!this.showNotice || !sessionStorage.getItem(MODAL_PENDING_KEY)) {
        return;
      }

      sessionStorage.removeItem(MODAL_PENDING_KEY);
      this.$nextTick(() => {
        this.modalOpen = true;
      });
    },
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-migration-banner {
  font-size: 14px;
}

.panel-migration-countdown-inline {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 2px 8px;
}

.panel-migration-link {
  color: white;
  font-weight: 600;
  text-decoration: underline;
}

.panel-migration-link--dark {
  color: #ff2d2d;
  font-weight: 600;
}

.panel-migration-modal {
  width: 560px;
  max-width: 95vw;
  border-radius: 10px;
}

.panel-migration-modal__header {
  background: #333;
  padding: 12px 20px !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.panel-migration-countdown__item {
  min-width: 64px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px 8px;
}

.panel-migration-countdown__value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: #ff2d2d;
}

.panel-migration-countdown__label {
  font-size: 11px;
  text-transform: uppercase;
  color: #666;
  margin-top: 4px;
}
</style>
