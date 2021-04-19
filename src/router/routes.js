import jwt_decode from "jwt-decode";
import SecureLS from "secure-ls";
import {Store} from "../store/index.js";

var ls = new SecureLS({ isCompression: false });

const routes = [
  {
    path: '/',
    beforeEnter:(to,from,next)=>{
      if(isAuthenticated()){
        next("/pedidos");
      }else{
        next("/login");
      }
    }
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/dashboard/Dashboard.vue'),
        beforeEnter:(to,from,next)=>{
          if(isAuthenticated()){
            if(accessTo('Home')){
              next();
            }
            else{
              next("/404");
            }
          }else{
            next("/login");
          }
        }
      },
      { 
        path: '/pedidos', 
        component: () => import('pages/orders/TheOrders.vue'),
        beforeEnter:(to,from,next)=>{
          if(isAuthenticated()){
            if(accessTo('Pedidos')){
              next();
            }
            else{
              next("/404");
            }
          }else{
            next("/login");
          }
        }
      },
      { 
        path: '/cupones', 
        component: () => import('pages/coupons/TheCoupons.vue'),
        beforeEnter:(to,from,next)=>{
          if(isAuthenticated()){
            if(accessTo('Cupones')){
              next();
            }
            else{
              next("/404");
            }
          }else{
            next("/login");
          }
        }
      },
      
      
      
      /* Template Paths - It could be useful*/
      {path: '/Dashboard2', component: () => import('pages/Dashboard2.vue')},
      {path: '/Profile', component: () => import('pages/UserProfile.vue')},
      {path: '/Map', component: () => import('pages/Map.vue')},
      {path: '/MapMarker', component: () => import('pages/MapMarker.vue')},
      {path: '/StreetView', component: () => import('pages/StreetView.vue')},
      {path: '/TreeTable', component: () => import('pages/TreeTable.vue')},
      {path: '/Charts', component: () => import('pages/Charts.vue')},
      {path: '/Cards', component: () => import('pages/Cards.vue')},
      {path: '/Tables', component: () => import('pages/Tables.vue')},
      {path: '/Contact', component: () => import('pages/Contact.vue')},
      {path: '/Checkout', component: () => import('pages/Checkout.vue')},
      {path: '/Calendar', component: () => import('pages/Calendar.vue')},
      {path: '/Pagination', component: () => import('pages/Pagination.vue')},
      {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
      {path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue')},
    ]
  },
  {
    path: '/Lock',
    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/mantenimiento',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue')
  },
  {
    path: '/login',
    component: () => import('pages/login/TheLogin.vue'),
    beforeEnter:(to,from,next)=>{
      if(isAuthenticated()){
        next("/pedidos");
      }else{
        next();
      }
    }

  },
  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

function isAuthenticated(){
  if(Store.getters['auth/getAuthenticated']){
    return true;
  }
  else{
    return false;
  }
}

function accessTo(option){
  let availableMenuOptions=Store.getters['auth/getAvailableMenuOptions'];
  if(availableMenuOptions.some(item => item.label===option)){
    return true;
  }
  else{
    return false;
  }
}


 


export default routes
