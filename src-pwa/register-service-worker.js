import { register } from "register-service-worker";
import { Notify } from "quasar";
import {
  Loading,
  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from "quasar";

const loading = Loading;
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(registration) {
    console.log("Service worker is active.");
    loading.hide();
  },

  registered(registration) {
    console.log("Service worker has been registered.");
    loading.hide();
  },

  cached(registration) {
    console.log("Content has been cached for offline use.");
  },

  updatefound(registration) {
    registration.update();
    console.log("New content is downloading!");
    loading.show({
      spinner: QSpinnerGears,
      message: "Espere un momento..."
    });
  },

  updated(registration) {
    loading.hide();
    Notify.create({
      message: "Es necesario actualizar la página",
      icon: "info",
      color: "blue",
      textColor: "white",
      position: "top",
      timeout: 1500,
      onDismiss() {
        location.reload(true);
      }
    });
    console.log("New content is available; please refresh!.");
  },

  offline() {
    console.log(
      "No internet connection found. App is running in offline mode!"
    );
  },

  error(err) {
    console.error("Error during service worker registration:", err);
  }
});
