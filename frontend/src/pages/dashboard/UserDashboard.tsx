// pages/dashboard/UserDashboard.tsx
import { SolverDashboardView } from "../../layout/SolverDashboardLayout";
import { ServiceDashboardView } from "../../layout/ServiceDashboardLayout";
import { useAuth } from "@/context/AuthContext";

export function UserDashboard() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    let roleSpecificView;
    switch (user.role) {
        case "solver":
            roleSpecificView = <SolverDashboardView />;
            break;
        case "service":
            roleSpecificView = <ServiceDashboardView />;
            break;
        default:
            roleSpecificView = <div>Unauthorized or unknown role</div>;
    }

    return (
        <div className="w-full flex text-left md:gap-y-4 flex-col gap-y-4">
            <div className="w-full text-left">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-normal">
                    Welcome, {user.first_name}!
                </h3>
                <span className="text-muted-foreground text-sm">
                    Here’s your dashboard overview.
                </span>
            </div>
            {roleSpecificView}
        </div>
    );
}
