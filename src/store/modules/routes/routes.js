const state = {
  urlGlobal: "",
  routes: []
};
const mutations = {
  setLinks(state) {
    state.urlGlobal = process.env.API_URL;
    state.routes = [
      {
        name: "login",
        link: "/login"
      },
      {
        name: "orders",
        link: "/pedidos/{userId}/{filter}"
      },
      {
        name: "order.confirm",
        link: "/pedidos/confirm"
      },
      {
        name: "order.cancel",
        link: "/pedidos/cancel"
      },
      {
        name: "order.done",
        link: "/pedidos/done"
      },
      {
        name: "resource.coupons",
        link: "/cupones/{localId}"
      },
      {
        name: "coupon.change.status",
        link: "/cupones/change"
      },
      {
        name: "services.prices",
        link: "/servicios/prices"
      },
      {
        name: "locals.update",
        link: "/locales/update/{localId}"
      },
      {
        name: "locals.get",
        link: "/locales/get"
      },
      {
        name: "get.url.pay",
        link: "/servicios/pay"
      },
      {
        name: "refresh.token",
        link: "/refresh"
      },
      {
        name: "resource.local",
        link: "/locals/{localId}"
      },
      {
        name: "get.zones",
        link: "/zonas"
      },
      {
        name: "coupon.stand.out",
        link: "/goUpHigh"
      },
      {
        name: "coupon.go.up",
        link: "/goUpCoupon"
      },
      {
        name: "get.titles",
        link: "/title"
      },
      {
        name: "refresh.session",
        link: "/refresh/session"
      },
      {
        name: "orders.history",
        link: "/history/{filter}?page={page}"
      },
      {
        name: "gp.users",
        link: "/usuarios"
      },
      {
        name: "resource.users",
        link: "/usuarios/{localId}"
      },
      {
        name: "get.roles",
        link: "/roles/get"
      },
      {
        name: "upload.photo",
        link: "/files/{type}"
      },
      {
        name: "orders.history.download",
        link: "/history/download/{filter}"
      },
      {
        name: "history.newOrder.pusher",
        link: "/pedidos/actionPusher"
      },
      {
        name: "notification.status.order",
        link: "/notification"
      },
      {
        name: "get.chat",
        link: "/getChat/{orderId}"
      },
      {
        name: "send.ws",
        link: "/sendWhatsApp"
      },
      {
        name: "get.serverTime",
        link: "/serverTime"
      },
      {
        name: "get.comments",
        link: "/comentarios/{localId}"
      },
      {
        name: "do.reply",
        link: "/replies"
      },
      {
        name: "tickets.all",
        link: "/tickets"
      },
      {
        name: "tickets.resources",
        link: "/tickets/{id}" //id = idLocal or idTicket
      },
      {
        name: "comments",
        link: "/comments"
      },
      {
        name: "status.postpago",
        link: "/status_post_pago"
      },
      {
        name: "weekly.pay",
        link: "/pay_weekly_local"
      },
      {
        name: "transferences",
        link: "/transferences"
      },
      {
        name: "weekly.payment",
        link: "/weekly-payment"
      },
      {
        name: "report",
        link: "/report/{idPostpago}"
      },
      {
        name: "sales.amount",
        link: "/sales_amount/{idLocal}"
      },
      {
        name: "charts.bar",
        link: "/charts/{idLocal}"
      },
      {
        name: "charts.pie",
        link: "/sales_pie/{idLocal}"
      },
      {
        name: "resources.notifications",
        link: "/notifications/{id}"
      },
      {
        name: "password.recovery",
        link: "/password-recovery"
      },
      {
        name: "change.password",
        link: "/change-password/{idUser}"
      },
      {
        name: "get.delivery.status",
        link: "/get-delivery/{delivery_id}"
      }
    ];
  }
};
const actions = {};
const getters = {
  getRoutes: state => {
    return state.routes;
  },
  getRoute: state => (name, params) => {
    let route = state.routes.find(route => route.name === name);
    if (params != undefined) {
      var routeFormmater = "";
      var count = 0;
      for (var key in params) {
        if (count == 0) {
          routeFormmater = route.link.replace("{" + key + "}", params[key]);
        } else {
          routeFormmater = routeFormmater.replace("{" + key + "}", params[key]);
        }
        count++;
      }

      return state.urlGlobal + routeFormmater;
    }
    return state.urlGlobal + route.link;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
