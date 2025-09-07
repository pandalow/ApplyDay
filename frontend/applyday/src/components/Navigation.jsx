import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/app", label: "Application" },
    { to: "/report", label: "Report" },
    { to: "/extract", label: "Data" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Left side Logo */}
          <div className="flex items-center space-x-3">
            <img src="logo.png" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-indigo-600">ApplyDay</h1>
          </div>
          {/* Right side navigation links */}
          <div className="flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors duration-200 
                  ${location.pathname === link.to
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600 hover:text-indigo-500"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
