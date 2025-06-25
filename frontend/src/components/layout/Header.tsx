import logo from "@/assets/Merai_logo.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRoleNavigation } from "@/routes/RedirectHandler";
import { ModeToggle } from "../theme/mode-toggle";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function Header() {
    const { user, logout } = useAuth();
    const { goToProfile, goToDashboard } = useRoleNavigation();

    const avatarInitials = user
        ? user.first_name.charAt(0).toUpperCase() +
          user.last_name.charAt(0).toUpperCase()
        : "U";

    return (
        <header className="w-full p-4">
            <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-35 cursor-pointer"
                    onClick={goToDashboard}
                />
                <DropdownMenu>
                    <div className="flex gap-x-4 items-center">
                        <ModeToggle />
                        <DropdownMenuTrigger >
                            <Avatar className="cursor-pointer">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-900 text-lg font-semibold tracking-normal">
                                    {avatarInitials}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem
                                className="font-semibold cursor-pointer"
                                onClick={goToProfile}
                            >
                                My Account
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 font-semibold cursor-pointer"
                                onClick={logout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </div>
                </DropdownMenu>
            </div>
        </header>
    );
}
