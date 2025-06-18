// layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function MainLayout() {
    return (
        <>
            <div className="flex flex-col justify-between w-full h-full gap-y-4 ">
                    <Header />
                    <main className="w-full p-4 flex-grow">
                        <div className="w-full h-full mx-auto md:max-w-7xl md:justify-center flex flex-col items-center ">
                        <Outlet />
                        </div>
                    </main>
                <Footer />
            </div>
        </>
    );
}
