// app/providers.tsx
"use client"; // <-- Sabse zaroori line, ise Client Component banati hai

import { AppProvider } from "@/app/context/AppContext"; // Aapka Context provider
import StoreProvider from "@/lib/StoreProvider"; // Aapka Redux provider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppProvider>

        {children}

        {/* Notifications ke liye ToastContainer */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AppProvider>
    </StoreProvider>
  );
}
