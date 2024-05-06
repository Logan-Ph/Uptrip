import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StayCard } from "../components/ItineraryCard";
import { AddItemButton } from "../components/ItineraryCard";
import { FlightCard } from "../components/ItineraryCard";
import { EmptySection } from "../components/ItineraryCard";
import { ActivityCard } from "../components/ItineraryCard";
import { BudgetCard } from "../components/ItineraryCard";

export default function DetailedItinerary() {
    const [activeTab, setActiveTab] = useState(1); // Default active tab is 1

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <>
            <div className="md:px-10 bg-[#FAFBFC]">
                <div className="mx-auto max-w-8xl px-6">
                    <div className="md:flex">
                        <div className="mx-auto max-w-8xl md:px-6 py-4 md:py-10">
                            <div className="flex justify-between mb-2">
                                <p className="font-bold text-3xl">
                                    Summer Vaction in Da Nang
                                </p>
                                <div>
                                    <button
                                        className=" p-4 text-2xl font-semibold border-none bg-transparent"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "edit_itinerary_modal"
                                                )
                                                .showModal()
                                        }
                                    >
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <dialog
                                        id="edit_itinerary_modal"
                                        className="modal"
                                    >
                                        <div className="modal-box px-10">
                                            <form method="dialog">
                                                {/* if there is a button in form, it will close the modal */}
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                    ✕
                                                </button>
                                            </form>
                                            <h3 className="font-bold text-2xl my-5">
                                                Edit itinerary details
                                            </h3>
                                            <div>
                                                <div className="mb-5 text-start">
                                                    <label
                                                        for="name"
                                                        className="block mb-2 text-base font-medium text-gray-900"
                                                    >
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full p-3 focus:ring-black focus:border-black"
                                                        placeholder="e.g., Summer vacation in Da Nang"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-5 text-start">
                                                    <label
                                                        for="destination"
                                                        className="block mb-2 text-base font-medium text-gray-900"
                                                    >
                                                        Destination
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                            <svg
                                                                className="w-4 h-4 text-gray-500"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type="search"
                                                            id="destination"
                                                            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                                                            placeholder="Where to?"
                                                            required
                                                        />
                                                        <div className="relative drop-shadow-md">
                                                            <ul className="absolute menu bg-white w-full rounded-lg mt-1">
                                                                <li>
                                                                    <div>
                                                                        <i
                                                                            class="fa-solid fa-location-dot"
                                                                            aria-hidden="true"
                                                                        ></i>{" "}
                                                                        Ho Chi
                                                                        Minh
                                                                        City
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div>
                                                                        <i
                                                                            class="fa-solid fa-location-dot"
                                                                            aria-hidden="true"
                                                                        ></i>{" "}
                                                                        Ho Chi
                                                                        Minh
                                                                        City
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-5 text-start">
                                                    <label
                                                        for="description"
                                                        className="block mb-2 text-base font-medium text-gray-900"
                                                    >
                                                        Description
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        id="description"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full p-2.5 focus:ring-black focus:border-black"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-5 text-start">
                                                    <label
                                                        for="date"
                                                        className="block mb-2 text-base font-medium text-gray-900"
                                                    >
                                                        Dates or Length of stay
                                                        (optional)
                                                    </label>

                                                    {/*  */}

                                                    <div className="max-w-md mx-auto">
                                                        <div className="flex border-b border-gray-200 rounded-full bg-gray-300">
                                                            <button
                                                                className={`px-4 py-2 text-base focus:outline-none w-1/2 ${
                                                                    activeTab ===
                                                                    1
                                                                        ? "text-gray-900 font-semibold bg-white m-[3px] rounded-full"
                                                                        : "text-black font-thin"
                                                                }`}
                                                                onClick={() =>
                                                                    handleTabClick(
                                                                        1
                                                                    )
                                                                }
                                                            >
                                                                Dates
                                                            </button>
                                                            <button
                                                                className={`px-4 py-2 text-base focus:outline-none w-1/2 ${
                                                                    activeTab ===
                                                                    2
                                                                        ? "text-gray-900 font-semibold bg-white m-[3px] rounded-full"
                                                                        : "text-black font-thin"
                                                                }`}
                                                                onClick={() =>
                                                                    handleTabClick(
                                                                        2
                                                                    )
                                                                }
                                                            >
                                                                Trip length
                                                            </button>
                                                        </div>
                                                        <div className="mt-4">
                                                            {activeTab ===
                                                                1 && (
                                                                <div>
                                                                    {/* Datepicker */}
                                                                </div>
                                                            )}
                                                            {activeTab ===
                                                                2 && (
                                                                <div className="flex justify-between my-6 mb-10">
                                                                    <p className="text-base">
                                                                        Number
                                                                        of days
                                                                    </p>
                                                                    <div className="flex space-x-3 items-center">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="w-6 h-6"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                                            ></path>
                                                                        </svg>
                                                                        <span className="text-lg">
                                                                            1
                                                                        </span>

                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="w-6 h-6"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                                            ></path>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/*  */}
                                                </div>
                                                <div className="divider"></div>
                                                <div className="mb-5">
                                                    <button
                                                        className="btn bg-transparent border-none shadow-none text-red-400 hover:text-red-500"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    "delete_modal"
                                                                )
                                                                .showModal()
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="w-6 h-6"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                            />
                                                        </svg>{" "}
                                                        Delete Trip
                                                    </button>

                                                    <dialog
                                                        id="delete_modal"
                                                        className="modal modal-bottom sm:modal-middle"
                                                    >
                                                        <div className="bg-white py-10 rounded-xl max-w-4xl px-10">
                                                            <h3 className="font-bold text-2xl mt-4">
                                                                Delete
                                                                Itinerary?
                                                            </h3>
                                                            <p className="pt-4 text-lg">
                                                                Are you sure you
                                                                want to delete
                                                                this Itinerary?
                                                                Deleting a
                                                                Itinerary will
                                                                delete all the
                                                                items and notes
                                                                you have added
                                                                to it. The
                                                                Itinerary cannot
                                                                be retrieved
                                                                once it is
                                                                deleted.
                                                            </p>
                                                            <div className="modal-action mt-3">
                                                                <form method="dialog">
                                                                    {/* if there is a button in form, it will close the modal */}
                                                                    <button className="btn rounded-3xl mx-2">
                                                                        Cancel
                                                                    </button>
                                                                    <button className="btn bg-black text-white rounded-3xl">
                                                                        Delete
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </dialog>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button className="flex btn btn-outline w-full justify-center">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 font-thin text-lg mb-4">
                                    Counting down the days until our family
                                    adventure in Danang this June! ☀️🌴 5 days
                                    of excitement await us as we explore the
                                    beautiful beaches, indulge in delicious
                                    local cuisine, and create unforgettable
                                    memories together. Let the countdown to
                                    summer vacation begin! 🏖️😎
                                </p>
                            </div>
                            {/* Cover Image */}
                            <div className="mb-14">
                                <figure className="relative">
                                    <img
                                        className="rounded-lg w-full h-[450px] object-cover"
                                        src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/428850473.jpg?k=2d17b2dd618528271d24068071f67168b6aa7179b9a5c812f48b2e13f97ab146&o=&hp=1"
                                        alt="image description"
                                    />

                                    <figcaption className="absolute px-8  text-white bottom-6">
                                        <div className="flex items-baseline flex-col md:flex-row">
                                            <div>
                                                <p class="text-white text-sm md:text-2xl">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                    &ensp; Ho Chi Minh City
                                                </p>
                                            </div>
                                            <div className="divider divider-horizontal"></div>

                                            <div>
                                                <p class="text-white text-sm md:text-2xl mt-4 mb-2">
                                                    <i class="fa-regular fa-calendar"></i>
                                                    &ensp; Mar 6{" "}
                                                    <i class="fa-solid fa-arrow-right"></i>{" "}
                                                    Mar 20, 2024
                                                </p>
                                            </div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>

                            {/* Stay */}
                            <div className="my-4 pb-10">
                                <p className="font-semibold text-2xl my-4">
                                    Stay(s)
                                </p>

                                {/*  Stays List */}
                                <StayCard/>
                        <StayCard/>
                                <EmptySection />
                            </div>

                            {/* Flight */}
                            <div className="my-4 pb-10">
                                <p className="font-semibold text-2xl my-4">
                                    Flight(s)
                                </p>

                                {/*  Flights List */}
                                <FlightCard />
                                <FlightCard />
                                <AddItemButton />
                            </div>

                            {/* Schedule */}
                            <div className="my-4 pb-10">
                                <p className="font-semibold text-2xl my-4">
                                    Schedule
                                </p>
                                <div className="ml-4">
                                    <p className="font-semibold text-xl py-4">
                                        Day one (19/03/2024)
                                    </p>
                                    <div className="flex flex-col">
                                        {/* Items */}
                                        <div className="flex items-center">
                                            <div className="mr-8 text-3xl">
                                                <i class="fa-solid fa-circle-check"></i>
                                            </div>
                                            {/*Schedule Item */}
                                            <ActivityCard />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-8  text-3xl">
                                                <i class="fa-regular fa-circle"></i>
                                            </div>
                                            {/*Schedule Item */}
                                            <ActivityCard />
                                        </div>
                                    </div>

                                    {/* Add items button */}
                                    <AddItemButton />
                                </div>

                                {/* Another day */}
                                <div className="ml-4">
                                    <p className="font-semibold text-xl py-4">
                                        Day two (20/03/2024)
                                    </p>
                                    <EmptySection />
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="md:hidden">
                                <p className="font-semibold text-2xl mt-4">
                                    Budget
                                </p>
                            </div>
                        </div>
                        <div className="md:w-5/12 mb-10">
                            <BudgetCard/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
