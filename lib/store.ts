// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/features/users/userSlice";
import jewelryReducer from "@/lib/features/jewelry/jewelrySlice";
import orderReducer from "./features/orders/orderSlice";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import addressReducer from "./features/address/addressSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import userDashboardReducer from "./features/dashboard/userDashboardSlice";
import blogReducer from "./features/blog/blogSlice";
import cartReducer from "./features/cart/cartSlice"; 
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      jewelry: jewelryReducer,
      orders: orderReducer,
      dashboard: dashboardReducer,
      address: addressReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      userDashboard: userDashboardReducer,
      blogs: blogReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "user/register/pending",
            "user/updateProfile/pending",
          ],
          ignoredActionPaths: ["payload"],
          ignoredPaths: ["user.formData"],
        },
      }),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
