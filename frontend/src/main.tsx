import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, ScrollRestoration  } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { ScrollToTop } from "./components/scrollToTop.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <ScrollToTop/>
                    <App />
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
