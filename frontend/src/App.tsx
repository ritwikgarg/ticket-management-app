import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
function App() {
    return (
        <>
            <div className="flex flex-col w-full h-full">
                {/* Main content (centered) */}
                <main className="flex-grow flex flex-col justify-center items-center">
                    <AppRoutes></AppRoutes>
                    <Toaster />
                </main>
            </div>
        </>
    );
}

export default App;
