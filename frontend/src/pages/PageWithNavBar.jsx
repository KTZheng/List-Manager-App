import { Outlet } from "react-router-dom";
import DocAppBar from "../layout/Appbar";

export default function PageWithNavbar() {
    return (
        <div className="container">
            <nav>
                <DocAppBar />
            </nav>

            <Outlet />
        </div>
    );
}