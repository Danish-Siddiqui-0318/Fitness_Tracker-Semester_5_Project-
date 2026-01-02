import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const closeMenu = () => setIsOpen(false);


    const handleLogout = () => {
        localStorage.removeItem("token");
        Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully",
            icon: "success",
        })

        navigate("/login")
    }
    return (
        <nav className="fixed top-0 left-0 w-full h-14 bg-black z-50 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative flex items-center h-16">

                    {/* Logo (Left) */}
                    <Link to="/" className="text-xl font-bold">
                        Fitness Tracker
                    </Link>

                    {/* Center Links (Desktop) */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex space-x-8">
                        <Link to="/" className="hover:text-slate-300">Home</Link>
                        <Link to="/workout" className="hover:text-slate-300">Workout</Link>
                        <Link to="/calories" className="hover:text-slate-300">Calories</Link>
                        <Link to="/profile" className="hover:text-slate-300"></Link>
                    </div>

                    {/* Right Buttons (Desktop) */}
                    <div className="ml-auto hidden md:flex space-x-4">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-1.5 rounded-md border border-slate-400 hover:bg-slate-800"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="ml-auto md:hidden"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-800">
                    <div className="flex flex-col items-center space-y-3 py-4">
                        <Link to="/" onClick={closeMenu} className="hover:text-slate-300">Home</Link>
                        <Link to="/about" onClick={closeMenu} className="hover:text-slate-300">About</Link>
                        <Link to="/services" onClick={closeMenu} className="hover:text-slate-300">Services</Link>
                        <Link to="/contact" onClick={closeMenu} className="hover:text-slate-300">Contact</Link>

                        <button
                            onClick={() => { handleLogout(); closeMenu(); }}
                            className="w-40 px-4 py-2 border border-slate-400 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
