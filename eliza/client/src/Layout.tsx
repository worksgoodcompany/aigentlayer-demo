import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="w-full h-screen flex">
            <div className="w-[200px] shrink-0 border-r border-white/[0.08]">
                <AppSidebar />
            </div>
            <div className="flex-1 min-w-0">
                <Outlet />
            </div>
        </div>
    );
}
