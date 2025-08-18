import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const LayoutWithSidebar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-[60px] md:w-[calc(100%-60px)] w-full m-0">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
