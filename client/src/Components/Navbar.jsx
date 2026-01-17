import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Logging Out",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#183D3D",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  const navLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/workout", label: "Workout", icon: "💪" },
    { path: "/calories", label: "Calories", icon: "🔥" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/feedback", label: "Feedback", icon: "💬" }, 
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-gradient-to-r from-[#040D12]/95 to-[#0a1a1a]/95 backdrop-blur-md shadow-lg border-b border-gray-800/50"
            : "bg-gradient-to-r from-[#040D12] to-[#0a1a1a]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={() => setActiveLink("/")}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FT</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-[#040D12]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Fitness Tracker
                </span>
                <span className="text-xs text-gray-400">
                  Stay Fit. Stay Healthy.
                </span>
              </div>
            </Link>

            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setActiveLink(link.path)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${activeLink === link.path
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </div>

                  {activeLink === link.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-800/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/feedback"
                onClick={() => setActiveLink("/feedback")}
                className={`relative p-2 rounded-lg transition-all duration-300 group ${activeLink === "/feedback"
                    ? "bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/30"
                    : "hover:bg-gray-800/50"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💬</span>
                  <span className={`text-sm font-medium ${activeLink === "/feedback" ? "text-purple-300" : "text-gray-400 group-hover:text-white"
                    }`}>
                    Feedback
                  </span>
                </div>

                <div className="absolute -top-1 -right-1">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">NEW</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>

              <button
                onClick={handleLogout}
                className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span className="text-gray-300 group-hover:text-white">
                  Logout
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-teal-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${isOpen ? "rotate-45 top-3" : "top-1"
                    }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${isOpen ? "opacity-0" : "top-3"
                    }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${isOpen ? "-rotate-45 top-3" : "top-5"
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden bg-gradient-to-b from-gray-900/95 to-[#040D12]/95 backdrop-blur-lg overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 border-t border-gray-800/50" : "max-h-0"
            }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  setActiveLink(link.path);
                  closeMenu();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group relative ${activeLink === link.path
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
                    : "hover:bg-gray-800/50"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{link.icon}</span>
                  <span
                    className={`font-medium ${activeLink === link.path ? "text-white" : "text-gray-300"
                      }`}
                  >
                    {link.label}
                  </span>
                  {link.path === "/feedback" && (
                    <div className="h-5 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">NEW</span>
                    </div>
                  )}
                </div>
                {activeLink === link.path && (
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"></div>
                )}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-800/50">
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span className="font-medium text-gray-300">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 transition-all duration-300"
          style={{
            width: `${scrolled
                ? (window.scrollY /
                  (document.body.scrollHeight - window.innerHeight)) *
                100
                : 0
              }%`,
          }}
        ></div>
      </div>

      <div className="h-16"></div>
    </>
  );
}