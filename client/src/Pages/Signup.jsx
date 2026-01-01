import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignupPage() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
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
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="py-6 px-4">
                <div className="grid lg:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-lg:mx-auto">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="mb-12">
                                <h1 className="text-slate-900 text-3xl font-semibold">
                                    Sign up
                                </h1>
                                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                                    Create your account and get started.
                                    Join us and explore new possibilities.
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">
                                    Full name
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">
                                    Email
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        onChange={handleChange}
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Create password"
                                    />
                                </div>
                            </div>

                            <div className="!mt-12">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                                >
                                    Create account
                                </button>
                                <p className="text-sm !mt-6 text-center text-slate-600">
                                    Already have an account?
                                    <Link to="/login"
                                        className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="max-lg:mt-8">
                        <img
                            src="https://readymadeui.com/login-image.webp"
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
