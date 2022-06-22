import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "../components/Layout.vue";
import Blank from "../components/Blank.vue";
import NotFound from "../components/NotFound.vue";

import Account from "../views/Account.vue";
import About from "../views/About.vue";
import NounsMap from "../components/NounsMap.vue";
import TestMint from "../components/TestMint.vue";

const routeChildren = (prefix: string): Array<RouteRecordRaw> => {
  return [
    {
      path: "",
      redirect: "map",
    },
    {
      path: "user",
      name: prefix + "user",
      component: NounsMap,
    },
    {
      path: "map",
      name: prefix + "map",
      component: NounsMap,
    },
    {
      path: "p/:photoId",
      name: prefix + "photo",
      component: NounsMap,
    },
    {
      path: "about",
      component: About,
    },
    {
      path: "account",
      component: Account,
    },
    {
      path: "testMint",
      component: TestMint,
    },
  ];
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/:lang",
        component: Blank,
        children: routeChildren("loc"),
      },
      {
        path: "",
        component: Blank,
        children: routeChildren("noloc"),
      },
    ],
  },
  {
    path: "/:page(.*)",
    name: "NotFoundPage",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
