// components/RedirectHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/enums/user/Role";

export function RedirectHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role === Role.ADMIN) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return null;
}

export function useRoleNavigation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const basePath = user?.role === Role.ADMIN ? "admin" : "user";

  const goToDashboard = () => navigate(`/${basePath}/dashboard`);
  const goToProfile = () => navigate(`/${basePath}/profile`);

  return { goToDashboard, goToProfile };
}

