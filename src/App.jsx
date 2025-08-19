import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Volunteer from "./pages/Volunteer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-purple-600 text-white p-4 flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/volunteer">Volunteer</Link>
        </nav>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/volunteer" element={<Volunteer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
