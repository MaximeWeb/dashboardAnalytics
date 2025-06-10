import TopNavBar from "./topNavBar";
import LeftNavBar from "./leftNavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <TopNavBar />
      <div className="flex">
        <LeftNavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
