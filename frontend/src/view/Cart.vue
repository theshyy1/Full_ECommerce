<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../store/auth";
import { updateUserAPI } from "../services/http";
import { toast } from "vue3-toastify";
import { RouterLink } from "vue-router";
import { getNewestPrice } from "../ultil";
import Swal from "sweetalert2";

const {
  userState: { user },
} = useAuthStore();

// Discount price
const codeDiscount = ref("");
const shipPrice = ref(user.cart.length > 0 ? user.cart.length * 20 : 0);
const payFee = ref(shipPrice.value);

const getDiscount = computed(() => {
  let discount = 0;
  switch (codeDiscount.value) {
    case "hoangtrung":
      discount = 1;
      break;
    case "trung":
      discount = 0.5;
      break;
    case "manh":
      discount = 0.4;
      break;
    case "quynh":
      discount = 0.3;
      break;
    default:
      discount = 0;
  }
  return shipPrice.value * discount;
});

function getPriceDiscount() {
  const x = computed(() => shipPrice.value - getDiscount.value);
  payFee.value = x.value;
}

// Total price items
const totalPriceItems = computed(() => {
  const total = user.cart.reduce(
    (total, num) =>
      total + (num.quantity ? num.quantity : 1) * getNewestPrice(num.price),
    0
  );
  return total;
});

// Handle quantity
const handleDecrease = async (product) => {
  const index = user.cart.findIndex((item) => item._id == product._id);

  if (user.cart[index].quantity > 1) {
    user.cart[index].quantity--;
    await updateUserAPI(user);
    toast.error("-1 item", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  } else {
    const confirm = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (confirm) {
      user.cart.splice(index, 1);
      await updateUserAPI(user);
      toast.error("Removed -1", {
        autoClose: 1500,
        position: "bottom-right",
        theme: "colored",
      });
    }
  }
};

const handleIncrease = async (product) => {
  const index = user.cart.findIndex((item) => item._id == product._id);
  user.cart[index].quantity++;
  await updateUserAPI(user);
  toast.success("Added +1", {
    autoClose: 1500,
    position: "bottom-right",
    theme: "colored",
  });
};

const removeItem = async (product) => {
  const index = user.cart.findIndex((item) => item.id == product.id);
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy bỏ",
  });
  if (!result.isConfirmed) return;
  user.cart.splice(index, 1);
  await updateUserAPI(user);
};
</script>

<template>
  <div class="container my-[60px]">
    <h1 class="my-5 text-3xl border-l-4 border-orange-500 px-3 ml-6">
      My Cart
    </h1>
    <div
      class="border-[1px] shadow-md border-neutral-400 grid grid-cols-4 justify-between text-center py-6"
    >
      <span>Product</span>
      <span>Price</span>
      <span>Quantity</span>
      <span>Subtotal ($)</span>
    </div>
    <!-- Product Cart -->
    <div class="">
      <ul
        v-for="cart in user.cart"
        :key="cart._id"
        class="relative border-[1px] shadow-md border-neutral-400 grid grid-cols-4 justify-between text-center items-center py-3 my-[30px]"
      >
        <li class="flex items-center justify-center">
          <img
            :src="cart.image"
            class="object-cover mr-2 w-[70px] h-[70px]"
            alt=""
          />
          {{ cart.name }}
        </li>
        <li>${{ getNewestPrice(cart.price) }}</li>
        <li>
          <div
            class="flex justify-center items-center rounded py-2 px-3 w-[80px] border-[1px] mx-auto border-neutral-300"
          >
            <p class="mr-2">{{ cart.quantity || 1 }}</p>
            <div class="flex flex-col ml-1 items-center justify-start">
              <i
                class="fa-solid fa-chevron-up cursor-pointer"
                @click="handleIncrease(cart)"
              ></i>
              <i
                class="fa-solid fa-chevron-down cursor-pointer"
                @click="handleDecrease(cart)"
              ></i>
            </div>
          </div>
        </li>
        <li>${{ (cart.quantity || 1) * getNewestPrice(cart.price) }}</li>
        <span
          class="absolute top-[35px] right-[30px] text-base text-red-500 hover:text-red-300 cursor-pointer"
          @click="removeItem(cart)"
        >
          Xoá
          <i class="fa-solid fa-trash"></i>
        </span>
      </ul>
    </div>
    <!-- Checkout -->
    <div class="my-[80px] flex justify-between items-start">
      <div class="checkout-code">
        <input
          type="text"
          placeholder="Coupon Code"
          class="w-[300px] text-sm text-black py-4 px-5 border-[1px] border-neutral-300 rounded"
          v-model="codeDiscount"
          @keyup.enter="getPriceDiscount"
        />
        <button
          class="w-[210px] py-4 ml-4 bg-primary border-none text-white rounded hover:opacity-60"
        >
          Apply Coupon
        </button>
      </div>
      <div class="w-[470px] border-[1px] border-neutral-300 rounded">
        <div class="my-8 mx-6">
          <h3 class="text-xl mb-6">Cart Total</h3>
          <div class="">
            <p
              class="flex justify-between border-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Subtotal: <span class="totalPrice">$ {{ totalPriceItems }}</span>
            </p>
            <p
              class="flex justify-between border-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Shipping:
              <span>{{ payFee === 0 ? "Free" : `$ ${payFee}` }}</span>
            </p>
            <p
              class="flex justify-between border-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Total:
              <span class="totalPrice">$ {{ totalPriceItems + payFee }}</span>
            </p>
          </div>
          <RouterLink to="/checkout">
            <button
              class="w-[260px] py-4 ml-4 bg-primary border-none text-white rounded hover:opacity-60"
              id="checkout-done"
            >
              Procees to checkout
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
