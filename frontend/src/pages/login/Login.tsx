import { LoginForm } from "@/components/forms/login-form";
import logo from "@/assets/Merai_logo.png";

export function Login() {
    return (
        <>
            <img src={logo} alt="Logo" className="max-w-sm" />
            <div className="w-full flex justify-center px-5">
                <LoginForm className="md:w-xl pb-10 pt-10 sm:pt-4" />
            </div>
        </>
    );
}
