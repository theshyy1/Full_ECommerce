<script setup>
import { useProductStore } from "../store";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const {
  userState: { isLoggin, user },
} = useAuthStore();
const store = useProductStore();

const handleClickBack = () => {
  if (!isLoggin) {
    router.push({ path: "/" });
    return;
  }

  if (user.admin === true) {
    router.push({ path: "/admin/dashboard" });
  } else {
    router.push({ path: "/" });
  }
};
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <h1 class="text-8xl text-black" :class="{ 'text-white': store.darkTheme }">
      404 Not Found
    </h1>
    <p class="my-8">Your visited page not found. You may go home page.</p>
    <button
      class="w-[200px] py-3 px-8 bg-primary text-white rounded hover:opacity-60"
      @click="handleClickBack"
    >
      Back home
    </button>
  </div>
</template>
