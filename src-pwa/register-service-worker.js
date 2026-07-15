import { register } from "register-service-worker";
import { Loading, QSpinnerGears } from "quasar";

const loading = Loading;
let refreshing = false;

function reloadForUpdate() {
  if (refreshing) {
    return;
  }

  refreshing = true;
  window.location.reload();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", reloadForUpdate);
}

register(process.env.SERVICE_WORKER_FILE, {
  ready() {
    loading.hide();
    console.log("Service worker is active.");
  },

  registered(registration) {
    loading.hide();
    console.log("Service worker has been registered.");

    // Buscar nueva versión en cada carga de la app
    registration.update();
  },

  cached() {
    console.log("Content has been cached for offline use.");
  },

  updatefound() {
    console.log("New content is downloading!");
    loading.show({
      spinner: QSpinnerGears,
      message: "Actualizando panel..."
    });
  },

  updated() {
    loading.hide();
    console.log("New content is available; reloading.");
    reloadForUpdate();
  },

  offline() {
    console.log(
      "No internet connection found. App is running in offline mode!"
    );
  },

  error(err) {
    loading.hide();
    console.error("Error during service worker registration:", err);
  }
});
