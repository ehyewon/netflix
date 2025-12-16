// src/composables/useAuth.js
import { reactive } from "vue";

const auth = reactive({
    isLogin: localStorage.getItem("isLogin") === "true",
    email: localStorage.getItem("loginEmail") || "",
});

export function useAuth() {
    function login(email) {
        auth.isLogin = true;
        auth.email = email;

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("loginEmail", email);
    }

    function logout() {
        auth.isLogin = false;
        auth.email = "";

        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("autoLogin");
    }

    return { auth, login, logout };
}
