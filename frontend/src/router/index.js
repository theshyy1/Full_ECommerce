import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";

const routes = [
  {
    path: "/",
    name: "BaseLayout",
    component: () => import("../layouts/BaseLayout.vue"), //lazy loading route
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("../view/HomePage.vue"),
        meta: { title: "Home" },
      },
      {
        path: "products",
        name: "Home Products",
        component: () => import("../view/HomePage.vue"),
        meta: { title: "Home" },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("../view/Profile.vue"),
        meta: { title: "Profile" },
      },
      {
        path: "profile/:id/edit",
        name: "Edit Profile",
        component: () => import("../view/EditProfile.vue"),
        meta: { title: "Edit Profile" },
      },
      {
        path: "products/:id",
        name: "Product Detail",
        component: () => import("../view/DetailPage.vue"),
        meta: { title: "Product Detail" },
      },
      {
        path: "about",
        name: "About",
        component: () => import("../view/About.vue"),
        meta: { title: "About" },
      },
      {
        path: "wishlist",
        name: "Wishlist",
        component: () => import("../view/Wishlist.vue"),
        meta: { title: "Wishlist" },
      },
      {
        path: "cart",
        name: "Cart",
        component: () => import("../view/Cart.vue"),
        meta: { title: "My Cart" },
      },
      {
        path: "checkout",
        name: "Checkout",
        component: () => import("../view/Checkout.vue"),
        meta: { title: "Checkout" },
      },
      {
        path: "history",
        name: "History Buy",
        component: () => import("../view/HistoryBuy.vue"),
        meta: { title: "History" },
        children: [
          {
            path: ":id",
            name: "Detail Buy",
            component: () => import("../view/DetailHistoryBuy.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../view/Signup.vue"),
    meta: { title: "Sign Up" },
    hidden: true,
  },
  {
    path: "/signin",
    name: "Signin",
    component: () => import("../view/Signin.vue"),
    meta: { title: "Sign In" },
    hidden: true,
  },
  {
    path: "/404",
    name: "Not Found",
    component: () => import("../view/404.vue"),
  },
  {
    path: "/admin",
    name: "AdminLayout",
    component: () => import("../layouts/AdminLayout.vue"),
    redirect: { name: "Dashboard" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../view/Admin/Dashboard.vue"),
        meta: { title: "Dashboard" },
      },
      {
        path: "products",
        name: "Products",
        component: () => import("../view/Admin/Products.vue"),
        meta: { title: "Product Management" },
      },
      {
        path: "products/create",
        name: "Create Product",
        component: () => import("../view/Admin/CreateForm.vue"),
        meta: { title: "Create Product" },
      },
      {
        path: "users",
        name: "User",
        component: () => import("../view/Admin/User.vue"),
        meta: { title: "User Management" },
      },
      {
        path: "profile",
        name: "Ad Profile",
        component: () => import("../view/Profile.vue"),
        meta: { title: "Profile" },
      },
      {
        path: "profile/:id/edit",
        name: "Ad EditProfile",
        component: () => import("../view/EditProfile.vue"),
        meta: { title: "Edit Profile" },
      },
    ],
  },
  { path: "/:CatchAll(.*)", redirect: "/404", hidden: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return {
        el: "#page",
        top: 10,
      };
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.userState.isLoggin) {
    if (
      to.name === "Profile" ||
      to.name === "Checkout" ||
      to.name === "Cart" ||
      to.name === "Wishlist" ||
      to.name === "Dashboard" ||
      to.name === "History Buy" ||
      to.name === "Detail Buy" ||
      to.path.includes("/admin")
    ) {
      try {
        localStorage.setItem("requestedPath", to.fullPath);

        const result = await Swal.fire({
          title: "Yêu cầu đăng nhập",
          text: "Bạn cần đăng nhập để truy cập trang này",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Đăng nhập",
          cancelButtonText: "Hủy bỏ",
        });
        if (result.isConfirmed) {
          next({ name: "Signin" });
        } else {
          next({ name: from.name });
        }
      } catch (error) {
        next(false);
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

// if (!authStore.userState.isLoggin) {
//   if (to.name === "Signin" || to.name === "Signup") {
//     next();
//   } else {
//     next({ name: "Signin" });
//   }
// } else {
//   if (to.name === "Signup" || to.name === "Signin") {
//     next({ name: from.name });
//   } else {
//     next();
//   }
// }
