<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import { sidebarOptions } from "../constraints";
import Swal from "sweetalert2";

const {
  userState: { user },
  logout,
} = useAuthStore();

const handleLogout = async () => {
  const result = await Swal.fire({
    // title: "Yêu cầu đăng nhập",
    text: "Bạn có chắc chắn muốn đăng xuất không?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Có",
    cancelButtonText: "Không",
  });
  if (result.isConfirmed) {
    logout();
  }
};
</script>

<template>
  <ul
    class="w-1/6 bg-green-800 text-white h-[800px] pr-2 border-b-2 float-left"
  >
    <li class="border-b-[1px] pb-3">
      <div class="flex justify-center items-center flex-col">
        <h3 class="shadow-md italic my-4">{{ user.name }}</h3>
        <div class="">
          <img
            :src="user.image || 'https://picsum.photos/150/150'"
            class="object-cover w-[100px] h-[100px] rounded-full"
            alt=""
          />
        </div>
        <RouterLink
          to="/admin/profile"
          class="border-gray-200 my-2 hover:underline"
          >Chỉnh sửa</RouterLink
        >
      </div>
    </li>
    <li v-for="(option, index) in sidebarOptions" :key="index">
      <RouterLink
        :to="option.baseUrl"
        class="py-5 px-5 border-b-[1px] border-gray-200 hover:bg-primary block"
      >
        <i :class="option.icon"></i> {{ option.title }}
      </RouterLink>
    </li>
    <li @click="handleLogout">
      <p
        class="py-5 px-5 border-b-[1px] cursor-pointer border-gray-200 hover:bg-primary block"
      >
        <i class="fa-solid fa-right-from-bracket mr-3"></i>Logout
      </p>
    </li>
  </ul>
</template>
