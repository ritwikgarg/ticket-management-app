import { Routes, Route } from "react-router-dom";
import { Login } from "@/pages/login/Login";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { UserDashboard } from "@/pages/dashboard/UserDashboard";
import { PrivateRoute } from "./PrivateRoute";
import { RedirectHandler } from "./RedirectHandler";
import { MainLayout } from "@/layout/MainLayout";
import { Profile } from "@/pages/profile/Profile";

// Redirect logic after login based on role
export default function AppRoutes() {
    return (
        <>
            <RedirectHandler></RedirectHandler>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/admin">
                            <Route
                                path="dashboard"
                                element={<AdminDashboard />}
                            />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                        <Route path="/user">
                            <Route
                                path="dashboard"
                                element={<UserDashboard />}
                            />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}
