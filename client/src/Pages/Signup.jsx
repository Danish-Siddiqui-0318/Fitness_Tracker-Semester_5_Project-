import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = "http://localhost:3000/auth/register";
            const response = await axios.post(apiUrl, formData);

            Swal.fire({
                title: "Registered Successfully",
                text: response.data.message,
                icon: "success",
            });

            navigate("/login");
        } catch (error) {
            Swal.fire({
                title: "Registration Failed",
                text: error.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };

    return (
        // Added bg-black and text-white to match LoginPage
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="py-6 px-4">
                <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div className="rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="mb-12">
                                <h1 className="text-3xl font-semibold">
                                    Sign up
                                </h1>
                                <p className="text-[15px] mt-6 leading-relaxed">
                                    Create your account and get started.
                                    Join us and explore new possibilities.
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Full name
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full text-sm border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 bg-transparent text-white"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Email
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full text-sm border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 bg-transparent text-white"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full text-sm border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 bg-transparent text-white"
                                        placeholder="Create password"
                                    />
                                </div>
                            </div>

                            <div className="!mt-12">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none cursor-pointer"
                                >
                                    Create account
                                </button>
                                <p className="text-sm !mt-6 text-center text-white">
                                    Already have an account?
                                    <Link to="/login"
                                        className="text-green-500 font-medium hover:underline ml-1 whitespace-nowrap"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="max-lg:mt-8">
                        <img
                            src="https://i.ibb.co/Fk4kpfbw/Gemini-Generated-Image-d8gbypd8gbypd8gb.png"
                            className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover"
                            alt="signup img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;