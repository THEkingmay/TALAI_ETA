import { Routes, Route, Link, useLocation } from "react-router-dom";

import UserPage from "./User";
import DriverPage from "./Driver";

export default function Router() {
  const location = useLocation();
  return (
    <div>
      <nav className="border-b border-gray-300 p-4 px-10">
        <Link className="mr-5" to={"/"}>
          User
        </Link>
        <Link to={"/driver"}>Driver</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UserPage key={location.key} />} />
        <Route path="/driver" element={<DriverPage />} />
      </Routes>
    </div>
  );
}
