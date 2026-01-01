import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LoginPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
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
            const apiUrl = "http://localhost:3000/auth/login";
            const response = await axios.post(apiUrl, formData);

            localStorage.setItem("token", response.data.token);

            Swal.fire({
                title: "Logged In Successfully",
                text: response.data.message,
                icon: "success",
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "Login Failed",
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
                                    Login Now
                                </h1>
                                <p className="text-slate-600 text-[15px] mt-6 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities.
                                    Your journey begins here.
                                </p>
                            </div>

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
                                        placeholder="Enter email "
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#bbb"
                                        stroke="#bbb"
                                        className="w-[18px] h-[18px] absolute right-4"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="10" cy="7" r="6"></circle>
                                        <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"></path>
                                    </svg>
                                </div>
                            </div>

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
                                        placeholder="Enter password"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#bbb"
                                        stroke="#bbb"
                                        className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                                        viewBox="0 0 128 128"
                                    >
                                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-3 block text-sm text-slate-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a
                                        href="jajvascript:void(0);"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </div> */}

                            <div className="!mt-12">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                                >
                                    Login Now
                                </button>
                                <button
                                    type="button"
                                    className="w-full shadow-xl py-2.5 my-4 px-4 text-[15px] font-medium tracking-wide rounded-lg
                                                 text-blue-600 border-2 border-blue-600
             hover:bg-blue-600 hover:text-white
             focus:outline-none cursor-pointer transition"
                                    onClick={() => { navigate("/signup") }}
                                >
                                    Sign Up
                                </button>
                            </div>

                        </form>
                    </div>

                    <div className="max-lg:mt-8">
                        <img
                            src="https://readymadeui.com/login-image.webp"
                            className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover"
                            alt="login img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
