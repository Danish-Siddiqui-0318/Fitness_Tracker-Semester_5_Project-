import axios from "axios";
import React, { useEffect, useState } from "react";

export function Hero() {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)


    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");

            var apiUrl = "http://localhost:3000/auth/profile"
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            setProfile(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch profile", error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) {
        return <div className="text-white mt-20">Loading...</div>;
    }

    return (
        <div className="relative w-full text-black mt-14">
            <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-24 xl:col-span-6">
                    <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl lg:text-6xl ">
                       Hi! {profile?.name
                            ? profile.name
                                .replace(/[0-9]/g, "")      // remove numbers
                                .trim()
                                .split(" ")
                                .filter(Boolean)
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")
                            : ""}
                    </h1>
                    <h1 className="mt-8 text-2xl font-bold tracking-tight md:text-4xl lg:text-4xl ">
                        Track Your Progress, Reach Your Peak Fitness.
                    </h1>
                    <p className="mt-8 text-lg ">
                        Monitor your daily activity, heart rate, and sleep patterns with precision.
                        Join thousands of users reaching their health goals every day.
                    </p>
                    <div className="mt-8 flex items-center space-x-4">
                        <button
                            type="button"
                            className="rounded-md bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Check Your Workout
                        </button>
                        <button
                            type="button"
                            className="rounded-md border border-black px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Check Your Calories
                        </button>
                    </div>
                </div>

                <div className="relative lg:col-span-5 lg:-mr-8 xl:col-span-6">
                    <img
                        className="aspect-[3/2] bg-gray-50 object-cover lg:aspect-[4/3] lg:h-[600px] xl:aspect-[16/9]"
                        src="https://i.ibb.co/qLgqVN3D/Gemini-Generated-Image-4oma7j4oma7j4oma.png"
                        alt="Fitness tracking dashboard and user"
                    />
                </div>
            </div>
        </div>
    );
}