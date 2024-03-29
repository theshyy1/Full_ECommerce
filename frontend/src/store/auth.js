import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getAllUsersAPI, signinAPI } from "../services/http";
import { toast } from "vue3-toastify";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State
  const userState = reactive({
    isLoggin: false,
    token: null,
    user: null,
  });
  const allUsers = ref([]);

  // Actions
  const login = async (user) => {
    const res = await signinAPI(user);
    const data = res.data;
    try {
      if (data && data.accessToken && data.user) {
        localStorage.setItem("access_token", data.accessToken);
        const requestedPath = localStorage.getItem("requestedPath");

        userState.token = data.accessToken;
        userState.user = data.user;
        userState.isLoggin = true;

        if (data.user.admin === true) {
          if (requestedPath) {
            localStorage.removeItem("requestedPath");
            await router.push({ path: requestedPath });
          } else {
            await router.push({ path: "/admin" });
          }
        } else {
          if (requestedPath) {
            localStorage.removeItem("requestedPath");
            await router.push({ path: requestedPath });
          } else {
            await router.push({ path: "/" });
          }
        }
        toast.success("Đăng nhập thành công !", {
          autoClose: 1500,
          position: "top-center",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error Login:", error);
    }
  };

  const logout = () => {
    userState.isLoggin = false;
    userState.user = null;
    userState.token = null;

    router.push({ path: "/" });
  };

  const getUsers = () => {
    getAllUsersAPI().then((data) => {
      allUsers.value = data.data;
    });
  };

  return { userState, allUsers, login, logout, getUsers };
});
