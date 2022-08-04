import SecureLS from "secure-ls";
import { Store } from "../store/index.js";

var ls = new SecureLS({ isCompression: false });

const routes = [
  {
    path: "/",
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/pedidos");
      } else {
        next("/login");
      }
    }
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/bienvenido",
        component: () => import("pages/welcome/TheWelcome.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            next();
          } else {
            next("/login");
          }
        }
      },
      {
        path: "",
        component: () => import("pages/dashboard/Dashboard.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/home")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "pedidos",
        path: "/pedidos",
        component: () => import("src/pages/orders/qs_orders/TheOrders.vue"),
        props: true,
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/pedidos")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "cupones",
        path: "/cupones",
        component: () => import("pages/coupons/TheCoupons.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/cupones")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "checkout",
        path: "/checkout",
        component: () => import("src/pages/payment/Checkout.vue"),
        props: true,
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            next();
          } else {
            next("/login");
          }
        }
      },
      {
        name: "local",
        path: "/locales",
        component: () => import("src/pages/local/MyLocal.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/locales")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "own-orders",
        path: "/pedidos-propios",
        component: () => import("src/pages/orders/qd_orders/TheOwnOrders.vue"),
        props: true,
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/pedidos-propios")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "admin-users",
        path: "/administrar-usuarios",
        component: () => import("src/pages/cruds/users/UsersPage.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/administrar-usuarios")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "orders-statistics",
        path: "/ventas",
        component: () =>
          import("src/pages/ordersStatistics/OrdersStatistics.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/ventas")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "comments-local",
        path: "/comentarios",
        component: () =>
          import("src/pages/local/comments/CommentsComponent.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/comentarios")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "support-tickets",
        path: "/tickets",
        component: () => import("src/pages/support/TheTickets.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/tickets")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "weekly-historial",
        path: "/historico-cobro-semanal",
        component: () => import("src/pages/Historial/WeeklyHistorial.vue"),
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/historico-cobro-semanal")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      {
        name: "register-services",
        path: "/registrar-transferencia",
        component: () =>
          import("src/pages/registerServices/RegisterServices.vue"),
        props: true,
        beforeEnter: (to, from, next) => {
          if (isAuthenticated()) {
            if (accessTo("/registrar-transferencia")) {
              next();
            } else {
              next("/404");
            }
          } else {
            next("/login");
          }
        }
      },
      /* Template Paths - It could be useful*/
      { path: "/Dashboard2", component: () => import("pages/Dashboard2.vue") },
      { path: "/Map", component: () => import("pages/Map.vue") },
      { path: "/MapMarker", component: () => import("pages/MapMarker.vue") },
      { path: "/StreetView", component: () => import("pages/StreetView.vue") },
      { path: "/TreeTable", component: () => import("pages/TreeTable.vue") },
      { path: "/Charts", component: () => import("pages/Charts.vue") },
      { path: "/Cards", component: () => import("pages/Cards.vue") },
      { path: "/Tables", component: () => import("pages/Tables.vue") },
      { path: "/Contact", component: () => import("pages/Contact.vue") },
      { path: "/Calendar", component: () => import("pages/Calendar.vue") },
      { path: "/Pagination", component: () => import("pages/Pagination.vue") },
      { path: "/Taskboard", component: () => import("pages/TaskBoard.vue") },
      {
        path: "/Ecommerce",
        component: () => import("pages/ProductCatalogues.vue")
      }
    ]
  },
  {
    path: "/Lock",
    component: () => import("pages/LockScreen.vue")
  },
  {
    path: "/mantenimiento",
    component: () => import("pages/Maintenance.vue")
  },
  {
    path: "/Pricing",
    component: () => import("pages/Pricing.vue")
  },
  {
    path: "/login",
    component: () => import("pages/login/TheLogin.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/pedidos");
      } else {
        next();
      }
    }
  },
  {
    path: "/cambio-clave/:token",
    component: () => import("pages/passwordRecovery/PasswordRecovery.vue")
  },
  {
    name: "payment-sucess",
    path: "/pago-exito/:type",
    component: () => import("src/pages/payment/TheConfirm.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    name: "payment-error",
    path: "/pago-error/:type",
    component: () => import("src/pages/payment/TheError.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    path: "/Mail",
    component: () => import("layouts/Mail.vue")
  },
  {
    path: "/Lock-2",
    component: () => import("pages/LockScreen-2.vue")
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

function isAuthenticated() {
  if (Store.getters["auth/getAuthenticated"]) {
    return true;
  } else {
    return false;
  }
}

function accessTo(link) {
  let availableMenuOptions = Store.getters["auth/getAvailableMenuOptions"];
  if (availableMenuOptions.some(item => item.link === link)) {
    return true;
  } else {
    return false;
  }
}

export default routes;
