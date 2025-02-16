import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>

        <Link to="/">Home</Link>

        <Link to="/buttons">Buttons</Link>

      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
