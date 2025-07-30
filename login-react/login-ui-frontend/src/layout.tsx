import { Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function Layout() {
  const { /* logout */ } = useAuth();

  return (
    // This component provides the main structure for your pages.
    // The <Outlet> below is where your different page components will be rendered.
    <main>
      <Outlet />
    </main>
  );
}
