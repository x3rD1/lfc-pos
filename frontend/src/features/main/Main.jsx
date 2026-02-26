import { Outlet } from "react-router-dom";

function Main() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <h1>Main</h1>
    </div>
  );
}

export default Main;
