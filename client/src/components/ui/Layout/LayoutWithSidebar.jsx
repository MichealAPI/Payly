import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const LayoutWithSidebar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="content-with-sidebar">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
