import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Signin from "@/views/Signin.vue";
import Popular from "@/views/Popular.vue";
import Search from "@/views/Search.vue";
import Wishlist from "@/views/Wishlist.vue";
import { useAuth } from "@/composables/useAuth.js";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: { requiresAuth: true },
        },
        {
            path: "/popular",
            name: "Popular",
            component: Popular,
            meta: { requiresAuth: true },
        },
        {
            path: "/search",
            name: "Search",
            component: Search,
            meta: { requiresAuth: true },
        },
        {
            path: "/wishlist",
            name: "Wishlist",
            component: Wishlist,
            meta: { requiresAuth: true },
        },
        {
            path: "/signin",
            name: "Signin",
            component: Signin,
        },
    ],
});

/* 🔐 로그인 라우팅 가드 */
router.beforeEach((to, from, next) => {
    const { auth } = useAuth();

    if (to.meta.requiresAuth && !auth.isLogin) {
        next("/signin");
    } else if (to.path === "/signin" && auth.isLogin) {
        next("/");
    } else {
        next();
    }
});

export default router;
