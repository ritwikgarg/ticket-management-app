import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRoleNavigation } from "@/routes/RedirectHandler";
import { IconHomeShare } from "@tabler/icons-react";

export function Profile() {
    const { user } = useAuth();
    const avatarInitials = user
        ? user.first_name.charAt(0).toUpperCase() +
          user.last_name.charAt(0).toUpperCase()
        : "U";

    const {goToDashboard } = useRoleNavigation();

    return (
        <div className="w-full md:w-xl flex flex-col items-center">
            <div className="w-full text-left pb-4">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-normal">
                    Profile
                </h3>
                <span className="text-muted-foreground text-sm">
                    Manage your profile settings here.
                </span>
            </div>
            <Card className="w-full">
                <CardContent className="w-full flex flex-col gap-y-4 items-center">
                    <Avatar className="w-25 h-25">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-900 text-4xl font-semibold tracking-normal">
                            {avatarInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h4 className="w-full scroll-m-20 text-lg font-semibold tracking-normal">
                            {user?.first_name + " " + user?.last_name}
                        </h4>
                        <span className="text-muted-foreground font-normal text-sm">
                            {user?.role.charAt(0).toUpperCase() +
                                user?.role.substring(1)!}
                        </span>
                    </div>
                    <Button className="w-full" onClick={goToDashboard}>
                        <IconHomeShare />
                        Back to Dashboard
                    </Button>
                    <div className="grid grid-cols-[auto_auto] grid-rows-3 gap-4 w-full pt-2 text-sm">
                        <div className="text-muted-foreground text-left">
                            Employee ID
                        </div>
                        <div className="text-right truncate max-w-full">
                            {user ? user.employee_id : ""}
                        </div>
                        <div className="text-muted-foreground text-left">
                            Contact
                        </div>
                        <div className="text-right truncate max-w-full">
                            {user ? user.contact_no : ""}
                        </div>
                        <div className="text-muted-foreground text-left">
                            Email
                        </div>
                        <div className="text-right truncate max-w-full">
                            {user ? user.email : ""}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
