import NavBar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import Datepicker from "flowbite-datepicker/Datepicker";
import useHandleNavigate from "../utils/useHandleNavigate";
import { useQuery } from "@tanstack/react-query";
import {
    fetchAttractionsAutocomplete,
    fetchFlightAutocomplete,
    fetchTripAutoComplete,
} from "../api/fetch";
import { Link, useNavigate } from "react-router-dom";
import warningNotify from "../utils/warningNotify";

export default function Header() {
    const [tab, setTab] = useState("All");
    const [keyword, setKeyword] = useState("");

    return (
        <>
            <div class="bg-loginbackground bg-cover bg-center md:px-10">
                <NavBar />
                <div class="mx-auto max-w-8xl px-6 md:py-6 md:mt-32 mb-18">
                    <p class="text-white text-base md:text-lg mb-3 font-thin">
                        LEVEL UP YOUR TRIP
                    </p>
                    <p class="text-white text-3xl md:text-5xl font-semibold">
                        Life is a journey <br></br>Not a destinations.
                    </p>
                </div>

                <div class="pb-10 mx-auto max-w-8xl px-6 py-6">
                    <HandleSelection
                        tab={tab}
                        setTab={setTab}
                        setKeyword={setKeyword}
                        keyword={keyword}
                    />
                </div>
            </div>
        </>
    );
}

function HandleSelection({ tab, setTab, setKeyword, keyword }) {
    switch (tab) {
        case "Stay":
            return (
                <AdvancedSearchStay
                    setTab={setTab}
                    setKeyword={setKeyword}
                    keyword={keyword}
                />
            );
        case "Flight":
            return (
                <AdvancedSearchFlight
                    setTab={setTab}
                    setKeyword={setKeyword}
                    keyword={keyword}
                />
            );
        case "Experience":
            return (
                <QuickSearchExperience
                    setTab={setTab}
                    setKeyword={setKeyword}
                    keyword={keyword}
                />
            );
        default:
            return (
                <QuickSearchAll
                    setTab={setTab}
                    setKeyword={setKeyword}
                    keyword={keyword}
                />
            );
    }
}

function AdvancedSearchFlight({ setTab }) {
    const navigate = useNavigate();
    const [from, setFrom] = useState({})
    const [to, setTo] = useState({})
    const [openMenu, setOpenMenu] = useState(false);
    const [seatClass, setSeatClass] = useState("ECONOMY")
    const [numberOfAdult, setNumberOfAdult] = useState(1);
    const [numberOfChild, setNumberOfChild] = useState(0);
    const [numberOfInfant, setNumberOfInfant] = useState(0);
    const [keywordFrom, setKeywordFrom] = useState("");
    const [keywordTo, setKeywordTo] = useState("");
    const [fromEdit, setFromEdit] = useState(true);
    const [toEdit, setToEdit] = useState(true);
    const [debouncedKeywordFrom, setDebouncedKeywordFrom] = useState(null)
    const [debouncedKeywordTo, setDebouncedKeywordTo] = useState(null)
    const [startDate, setStartDate] = useState()

    useEffect(() => {
        if (numberOfAdult * 2 < numberOfChild) {
            setNumberOfChild(numberOfAdult * 2)
        }
        if (numberOfAdult < numberOfInfant) {
            setNumberOfInfant(numberOfAdult)
        }
    }, [numberOfAdult])

    useEffect(() => {
        setFromEdit(true)
        const handler = setTimeout(() => {
            setDebouncedKeywordFrom(keywordFrom);
        }, 250); // Delay of 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [keywordFrom]);

    useEffect(() => {
        setToEdit(true)
        const handler = setTimeout(() => {
            setDebouncedKeywordTo(keywordTo);
        }, 250); // Delay of 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [keywordTo]);

    const fromAutocomplete = useQuery({
        queryKey: ['advanced-search', "flight", debouncedKeywordFrom],
        queryFn: () => fetchFlightAutocomplete(debouncedKeywordFrom),
        refetchOnWindowFocus: false,
        enabled: !!keywordFrom,
    })

    const toAutocomplete = useQuery({
        queryKey: ['advanced-search', "flight", debouncedKeywordTo],
        queryFn: () => fetchFlightAutocomplete(debouncedKeywordTo),
        refetchOnWindowFocus: false,
        enabled: !!keywordTo,
    })


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!from.airportCode) {
            warningNotify("Please select your origin")
            return
        }

        if (!to.airportCode) {
            warningNotify("Please select your destination")
            return
        }

        if (!startDate) {
            warningNotify("Please select your departure date")
            return
        }

        const payload = {
            from: from.airportCode,
            fromCity: from.cityName,
            to: to.airportCode,
            toCity: to.cityName,
            seatClass: seatClass,
            adult: numberOfAdult,
            child: numberOfChild,
            infant: numberOfInfant,
            year: startDate.substring(0, 4),
            month: startDate.substring(5, 7),
            day: startDate.substring(8, 10),
        }

        navigate(
            `advanced-flight-search?ori=${payload.fromCity}&des=${payload.toCity}&from=${payload.from}&to=${payload.to}&adult=${payload.adult}&child=${payload.child}&infant=${payload.infant}&seatClass=${payload.seatClass}&year=${payload.year}&month=${payload.month}&day=${payload.day}`
        );
    }

    return (
        <>
            <div
                id="flight-section"
                class="grid grid-cols-2 p-4 mx-auto md:my-8 bg-white rounded-xl bg-opacity-40"
            >
                <div class="col-span-full flex flex-col md:flex-row w-full space-y-2 md:space-y-0">
                    <div class="join join-vertical md:join-horizontal space-y-2 md:space-y-0 w-full">
                        <div class="join-item h-[52px]">
                            <div className="join join-horizontal w-full md:rounded-r-none">
                                <select
                                    id="form-selector-2"
                                    class="h-[52px] px-2 select select-bordered w-full md:w-[90px] pr-2 pl-3 md:rounded-r-none focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                    onChange={(e) => setTab(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Stay">Stay</option>
                                    <option value="Flight" selected="selected">
                                        Flight
                                    </option>
                                    <option value="Experience">
                                        Experience
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="join-item h-[52px]">
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <i class="fa-solid fa-plane-departure text-gray-500"></i>
                                </div>
                                <div>
                                    <input
                                        name="origin"
                                        type="text"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 pt-5 md:rounded-none h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                        placeholder="City or airport"
                                        value={
                                            fromEdit
                                                ? keywordFrom
                                                : from.cityName
                                        }
                                        onChange={(e) => {
                                            setKeywordFrom(e.target.value);
                                        }}
                                    />
                                    <label
                                        for="floating_filled"
                                        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        Origin
                                    </label>
                                </div>
                                {fromAutocomplete.isFetched &&
                                    fromEdit &&
                                    keywordFrom &&
                                    fromAutocomplete?.data?.length > 0 && (
                                        <div class="relative z-40">
                                            <ul class="absolute menu bg-white w-full rounded-b-lg overflow-y-auto">
                                                {fromAutocomplete?.data?.map(
                                                    (item) => {
                                                        return (
                                                            <li
                                                                onClick={() => {
                                                                    setFrom(
                                                                        item
                                                                    );
                                                                    setFromEdit(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <div>
                                                                    <i class="fa-solid fa-plane"></i>{" "}
                                                                    {
                                                                        item.cityName
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        item.airportCode
                                                                    }
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div class="join-item h-[52px]">
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <i class="fa-solid fa-plane-arrival text-gray-500"></i>
                                </div>
                                <div>
                                    <input
                                        name="destination"
                                        type="text"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 pt-5 md:rounded-none h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                        placeholder="City or airport"
                                        value={toEdit ? keywordTo : to.cityName}
                                        onChange={(e) =>
                                            setKeywordTo(e.target.value)
                                        }
                                    />
                                    <label
                                        for="floating_filled"
                                        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        Destination
                                    </label>
                                </div>
                                {toAutocomplete.isFetched &&
                                    toEdit &&
                                    keywordTo &&
                                    toAutocomplete?.data?.length > 0 && (
                                        <div class="relative z-40">
                                            <ul class="absolute menu bg-white w-full rounded-b-lg overflow-y-auto">
                                                {toAutocomplete?.data?.map(
                                                    (item) => {
                                                        return (
                                                            <li
                                                                onClick={() => {
                                                                    setTo(item);
                                                                    setToEdit(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <a>
                                                                    <i class="fa-solid fa-plane"></i>{" "}
                                                                    {
                                                                        item.cityName
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        item.airportCode
                                                                    }
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div class="join-item h-[52px]">
                            <div class="relative">
                                <div>
                                    <input
                                        name="start"
                                        type="date"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-4 p-2.5 pt-5 md:rounded-none h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                        placeholder="dd/mm/yyyy"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        } // Set min date to today
                                        onChange={(e) => {
                                            const newStartDate = e.target.value;
                                            setStartDate(newStartDate);
                                        }}
                                    />
                                    <label
                                        for="floating_filled"
                                        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        Departing
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="join-item h-[80px] md:h-[52px] grow">
                            <div className="relative mb-2 grow">
                                {/* Ask for number of passenger */}
                                <button
                                    id="dropdownDefaultButton"
                                    data-dropdown-toggle="dropdown"
                                    class="text-gray-900 bg-white border border-gray-300  outline-none font-medium rounded-lg md:rounded-l-none  md:border-l text-sm px-5 py-2.5 inline-flex items-center relative p-2.5 pt-5 ps-10 w-full justify-between appearance-none h-[80px] text-start md:text-center md:h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                    type="button"
                                    onClick={() => setOpenMenu((prev) => !prev)}
                                >
                                    <label
                                        for="floating_filled"
                                        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto font-medium"
                                    >
                                        No. of Passengers and Seat Class
                                    </label>
                                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <i class="fa-regular fa-user w-4 h-4 text-gray-500"></i>
                                    </div>
                                    {numberOfAdult} Adult, {numberOfChild}{" "}
                                    Child, {numberOfInfant} Infant and{" "}
                                    {seatClass}
                                    <svg
                                        class="w-2.5 h-2.5 ms-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>

                                {/* <!-- Dropdown menu --> */}
                                <div
                                    id="dropdown"
                                    class={`z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow w-full absolute mt-[1.5px] ${openMenu ? "" : "hidden"
                                        }`}
                                >
                                    <div
                                        class="py-2 text-sm text-gray-700 my-3 mx-5 space-y-4"
                                        aria-labelledby="dropdownDefaultButton"
                                    >
                                        <div class="flex justify-between">
                                            <div class="flex flex-col">
                                                <div>
                                                    <i
                                                        class="fa-solid fa-person text-gray-500"
                                                        aria-hidden="true"
                                                    ></i>{" "}
                                                    Adult(s)
                                                </div>
                                            </div>
                                            <div>
                                                <div class="flex space-x-3 items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfAdult(
                                                                (prev) =>
                                                                    prev - 1 > 0
                                                                        ? prev -
                                                                        1
                                                                        : 1
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                    <span class="text-lg">
                                                        {" "}
                                                        {numberOfAdult}{" "}
                                                    </span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfAdult(
                                                                (prev) =>
                                                                    prev +
                                                                        1 +
                                                                        numberOfChild +
                                                                        numberOfInfant <=
                                                                        6
                                                                        ? prev +
                                                                        1
                                                                        : prev
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="flex flex-col">
                                                <div>
                                                    <i class="fa-solid fa-child-reaching"></i>{" "}
                                                    Child
                                                </div>
                                                <div>(age 2 - 11)</div>
                                            </div>
                                            <div>
                                                <div class="flex space-x-3 items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfChild(
                                                                (prev) =>
                                                                    prev - 1 >=
                                                                        0
                                                                        ? prev -
                                                                        1
                                                                        : 0
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                    <span class="text-lg">
                                                        {" "}
                                                        {numberOfChild}{" "}
                                                    </span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfChild(
                                                                (prev) =>
                                                                    prev <
                                                                        numberOfAdult *
                                                                        2 &&
                                                                        prev +
                                                                        1 +
                                                                        numberOfAdult +
                                                                        numberOfInfant <=
                                                                        6
                                                                        ? prev +
                                                                        1
                                                                        : prev
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div class="flex flex-col">
                                                <div>
                                                    <i class="fa-solid fa-baby"></i>{" "}
                                                    Infant
                                                </div>
                                                <div>(below age 2)</div>
                                            </div>
                                            <div>
                                                <div class="flex space-x-3 items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfInfant(
                                                                (prev) =>
                                                                    prev - 1 >=
                                                                        0
                                                                        ? prev -
                                                                        1
                                                                        : prev
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                    <span class="text-lg">
                                                        {" "}
                                                        {numberOfInfant}{" "}
                                                    </span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-6 h-6"
                                                        onClick={() =>
                                                            setNumberOfInfant(
                                                                (prev) =>
                                                                    prev + 1 <=
                                                                        numberOfAdult &&
                                                                        prev +
                                                                        1 +
                                                                        numberOfChild +
                                                                        numberOfAdult <=
                                                                        6
                                                                        ? prev +
                                                                        1
                                                                        : prev
                                                            )
                                                        }
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex justify-between grow flex-wrap">
                                            <div
                                                className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                                onClick={() =>
                                                    setSeatClass("ECONOMY")
                                                }
                                            >
                                                Economy
                                            </div>
                                            <div
                                                className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                                onClick={() =>
                                                    setSeatClass("BUSINESS")
                                                }
                                            >
                                                Business
                                            </div>
                                            <div
                                                className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                                onClick={() =>
                                                    setSeatClass("FIRST")
                                                }
                                            >
                                                First
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="md:ml-1.5">
                        <button
                            onClick={(e) => handleSubmit(e)}
                            class="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full md:w-fit"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function QuickSearchExperience({ setTab, setKeyword, keyword }) {
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
    const [autocompletePayload, setAutocompletePayload] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        setAutocompletePayload(null);
    }, [debouncedKeyword]);

    const { data, isFetched } = useQuery({
        queryKey: ["attractions", "autocomplete", debouncedKeyword],
        queryFn: () => fetchAttractionsAutocomplete(debouncedKeyword),
        refetchOnWindowFocus: false,
        enabled: !!debouncedKeyword,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [keyword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!autocompletePayload) {
            warningNotify("Please select a location");
            return;
        }
        navigate(`/advanced-experience-search/?districtId=${autocompletePayload.districtId}&districtName=${autocompletePayload.districtName}`);
    };

    return (
        <>
            <div
                id="experience-section"
                class="grid grid-cols-2 p-4 mx-auto md:my-8 bg-white rounded-xl bg-opacity-40"
            >
                <div class="col-span-full flex flex-col md:flex-row space-y-2 md:space-y-0">
                    <div class="join w-full">
                        <select
                            id="form-selector-1"
                            class="px-2 select select-bordered join-item w-[125px] pr-2 pl-3 h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                            onchange="toggleSections(this)"
                            onChange={(e) => setTab(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Stay">Stay</option>
                            <option value="Flight">Flight</option>
                            <option value="Experience" selected="selected">
                                Experience
                            </option>
                        </select>
                        <div class="w-full">
                            <div>
                                <input
                                    class="w-full input input-bordered rounded-l-none h-[52px] bg-white focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                    placeholder="Search for activities in the location"
                                    value={
                                        autocompletePayload?.districtPathNames
                                    }
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            {isFetched && !autocompletePayload && (
                                <div class="relative z-40">
                                    <ul class="absolute menu bg-white w-full rounded-b-lg overflow-y-auto max-h-40 flex-nowrap ">
                                        {data.length === 0 ? (
                                            <li className="p-2 font-semibold">
                                                No results found
                                            </li>
                                        ) : (
                                            data.map((item) => (
                                                <li
                                                    onClick={() =>
                                                        setAutocompletePayload(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <div>
                                                        <i class="fa-solid fa-location-dot"></i>{" "}
                                                        {item.districtPathNames}
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="md:ml-1.5" onClick={handleSubmit}>
                        <button class="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function AdvancedSearchStay({ setTab, setKeyword, keyword }) {
    const navigate = useNavigate();
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
    const [dropdown, setDropdown] = useState(false);
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [childrenAges, setChildrenAges] = useState([]);
    const [autocompletePayload, setAutocompletePayload] = useState();
    const [checkin, setCheckin] = useState()
    const [checkout, setCheckout] = useState()

    const renderAgesString = (agesArray) => {
        if (agesArray.length === 0) return ''; // Return an empty string if the array is empty

        let agesString = '';
        agesArray.forEach((age, index) => {
            agesString += age;
            if (index < agesArray.length - 1) {
                agesString += ','; // Add a comma if it's not the last element
            }
        });

        return agesString;
    };

    const { data, isFetched } = useQuery({
        queryKey: ["advanced-search", "hotels", debouncedKeyword],
        queryFn: () => fetchTripAutoComplete(debouncedKeyword),
        refetchOnWindowFocus: false,
        enabled: !!debouncedKeyword,
    });

    useEffect(() => {
        if (numberOfChildren === 0) {
            setChildrenAges(new Array(numberOfChildren).fill(0));
        }
    }, [numberOfChildren]);

    useEffect(() => {
        setAutocompletePayload(null);
    }, [debouncedKeyword]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 250); // Delay of 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [keyword]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!autocompletePayload) {
            warningNotify("Please select a location");
            return;
        }

        if (!checkin) {
            warningNotify("Please select checkin date")
            return
        }

        if (!checkout) {
            warningNotify("Please select checkout date")
            return
        }

        let payload = {
            checkin: checkin.replace(/-/g, ''),
            checkout: checkout.replace(/-/g, ''),
            city: autocompletePayload.city.geoCode,
            resultType: autocompletePayload.resultType,
            countryId: autocompletePayload.country.geoCode,
            districtId: 0,
            provinceId: autocompletePayload.province.geoCode,
            cityType: autocompletePayload.cityType,
            latitude: autocompletePayload.coordinateInfos[3].latitude,
            longitude: autocompletePayload.coordinateInfos[3].longitude,
            searchCoordinate: autocompletePayload.coordinateInfos
                .map(
                    (info) =>
                        `${info.coordinateType}_${info.latitude}_${info.longitude}_${info.accuracy}`
                )
                .join("|"),
            crn: numberOfRooms,
            adult: numberOfAdults,
            children: numberOfChildren,
            ages:childrenAges,
            domestic: false,
            listFilters: "17~1*17*1*2",
        };

        if (payload.resultType === "H") {
            payload = {
                ...payload,
                hotelName: autocompletePayload.resultWord,
                searchValue: `${autocompletePayload.item.data.filterID}_${autocompletePayload.item.data.type}_${autocompletePayload.item.data.value}_${autocompletePayload.item.data.subType}`,
                cityName: autocompletePayload.city.currentLocaleName,
                preHotelIds: autocompletePayload.code,
            };
            navigate(
                `/advanced-hotel-search/?resultType=${payload.resultType}&hotelId=${autocompletePayload.code}&city=${payload.city}&cityName=${payload.cityName}&hotelName=${payload.hotelName}&searchValue=${payload.searchValue}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&ages=${renderAgesString(payload.ages)}&preHotelIds=${payload.preHotelIds}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`
            );
        } else {
            payload = {
                ...payload,
                cityName: autocompletePayload.resultWord,
            };
            navigate(
                `/advanced-hotel-search/?resultType=${payload.resultType}&city=${payload.city}&cityName=${payload.cityName}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&ages=${renderAgesString(payload.ages)}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`
            );
        }
        setDropdown(false)
    };

    return (
        <>
            <div
                id="stay-section"
                class="grid grid-cols-2 p-4 mx-auto md:my-8 bg-white rounded-xl bg-opacity-40"
            >
                <div class="col-span-full flex flex-col md:flex-row w-full space-y-2 md:space-y-0">
                    <div class="join join-vertical md:join-horizontal space-y-2 md:space-y-0 w-full">
                        <div class="join-item flex-1">
                            <div class="join join-horizontal w-full md:rounded-r-none">
                                <select
                                    id="form-selector-2"
                                    class="h-[52px] px-2 select select-bordered join-item w-[82px] pr-2 pl-3 focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                    onChange={(e) => setTab(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Stay" selected="selected">
                                        Stay
                                    </option>
                                    <option value="Flight">Flight</option>
                                    <option value="Experience">
                                        Experience
                                    </option>
                                </select>
                                <div class="w-full grow">
                                    <div>
                                        <input
                                            class="h-[52px] w-full input input-bordered join-item bg-white focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                            placeholder="Where are you going?"
                                            value={
                                                autocompletePayload?.resultWord
                                            }
                                            onChange={(e) =>
                                                setKeyword(e.target.value)
                                            }
                                        />
                                    </div>
                                    {isFetched && !autocompletePayload && (
                                        <div class="relative z-40 drop-shadow-lg">
                                            <ul class="absolute menu bg-white w-full rounded-b-lg">
                                                {data?.keyWordSearchResults?.map(
                                                    (element) => {
                                                        switch (
                                                        element.resultType
                                                        ) {
                                                            case "H":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-hotel"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "CT":
                                                            case "P":
                                                            case "D":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-location-dot"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "LM":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-map-pin"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "A":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-plane-departure"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "Z":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-map-pin"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "T":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-train"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            case "MT":
                                                                return (
                                                                    <>
                                                                        <li>
                                                                            <div
                                                                                onClick={() =>
                                                                                    setAutocompletePayload(
                                                                                        element
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i class="fa-solid fa-train"></i>{" "}
                                                                                {
                                                                                    element?.resultWord
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            default:
                                                                return null;
                                                        }
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div class="join-item">
                            <div class="flex items-center">
                                <div class="relative w-1/2">
                                    <div>
                                        <input
                                            name="start"
                                            type="date"
                                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-4 p-2.5 pt-5 rounded-r-none md:rounded-none border-l- focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                            placeholder="dd/mm/yyyy"
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            } // Set min date to today
                                            max={checkout || ""} // Set max date to endDate if it exists
                                            onChange={(e) => {
                                                const newStartDate =
                                                    e.target.value;
                                                setCheckin(newStartDate);
                                            }}
                                            value={checkin}
                                        />
                                        <label
                                            for="floating_filled"
                                            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto focus:ring-0 focus:ring-offset-0"
                                        >
                                            Check-in
                                        </label>
                                    </div>
                                </div>
                                <div class="relative w-1/2">
                                    <div>
                                        <input
                                            name="end"
                                            type="date"
                                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-4 p-2.5 pt-5 rounded-l-none border-l-0 md:rounded-none focus:ring-0 focus:ring-offset-0 focus:border-gray-300"
                                            placeholder="dd/mm/yyyy"
                                            min={
                                                checkin ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            } // Ensure end date is not before start date
                                            onChange={(e) => {
                                                const newEndDate =
                                                    e.target.value;
                                                if (newEndDate < checkin) {
                                                    setCheckin(newEndDate);
                                                }
                                                setCheckout(newEndDate);
                                            }}
                                            value={checkout}
                                        />
                                        <label
                                            for="floating_filled"
                                            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                        >
                                            Check-out
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="join-item relative">
                            <button
                                id="dropdownDividerButton"
                                data-dropdown-toggle="dropdownDivider"
                                class="text-gray-500 bg-white  font-medium rounded-lg md:rounded-l-none border border-gray-300 text-sm px-5 py-2.5 text-center inline-flex items-center h-[52px] relative p-2.5 mr-5 pt-5 ps-10 w-full justify-between focus:ring-0 focus:ring-offset-0 focus:border-gray-300"
                                type="button"
                                onClick={() => setDropdown((prev) => !prev)}
                            >
                                <label
                                    for="floating_filled"
                                    class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto font-medium"
                                >
                                    Guest(s) and Room(s)
                                </label>
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <i class="fa-regular fa-user w-4 h-4 text-gray-500"></i>
                                </div>
                                {numberOfAdults} adult, {numberOfChildren}{" "}
                                child, {numberOfRooms} room{" "}
                                <svg
                                    class="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>

                            {/* <!-- Dropdown menu --> */}
                            <div
                                id="dropdownDivider"
                                class={`z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow absolute mt-[1.5px] ${dropdown ? "block" : "hidden"
                                    }`}
                            >
                                {/* Ask user to input room information */}
                                <div
                                    class="py-5 text-sm text-gray-700 my-3 mx-5 space-y-4"
                                    aria-labelledby="dropdownDividerButton"
                                >
                                    <div class="flex justify-between">
                                        <div class="flex flex-col">
                                            <div>
                                                <i class="fa-solid fa-door-open"></i>{" "}
                                                Room(s)
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfRooms(
                                                            (prev) =>
                                                                prev > 1
                                                                    ? prev - 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                                <span class="text-lg">
                                                    {" "}
                                                    {numberOfRooms}{" "}
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() => {
                                                        setNumberOfRooms(
                                                            (prev) => {
                                                                if (prev >= 10)
                                                                    return prev;

                                                                if (
                                                                    prev ===
                                                                    numberOfAdults
                                                                ) {
                                                                    setNumberOfAdults(
                                                                        prev + 1
                                                                    );
                                                                }
                                                                return prev + 1;
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex flex-col">
                                            <div>
                                                <i
                                                    class="fa-solid fa-person"
                                                    aria-hidden="true"
                                                ></i>{" "}
                                                Adult(s)
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfAdults(
                                                            (prev) =>
                                                                prev - 1 > 0 &&
                                                                    prev >
                                                                    numberOfRooms
                                                                    ? prev - 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                                <span class="text-lg">
                                                    {" "}
                                                    {numberOfAdults}{" "}
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfAdults(
                                                            (prev) => prev + 1
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex flex-col">
                                            <div>
                                                <i
                                                    class="fa-solid fa-child-reaching"
                                                    aria-hidden="true"
                                                ></i>{" "}
                                                Children
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                maximum 17 years old
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfChildren(
                                                            (prev) => {
                                                                if (prev > 0) {
                                                                    setChildrenAges(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev.slice(
                                                                                0,
                                                                                prev.length -
                                                                                1
                                                                            )
                                                                    );
                                                                    return (
                                                                        prev - 1
                                                                    );
                                                                } else {
                                                                    return prev;
                                                                }
                                                            }
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                                <span class="text-lg">
                                                    {" "}
                                                    {numberOfChildren}{" "}
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfChildren(
                                                            (prev) =>
                                                                prev <
                                                                    numberOfRooms *
                                                                    6
                                                                    ? prev + 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="py-2">
                                    <Link
                                        to="#"
                                        class="block px-4 pb-2 text-[12px] text-gray-500 md:max-w-72"
                                    >
                                        Please enter your children's ages by the
                                        time of check-in
                                    </Link>
                                    <div class="overflow-y-scroll flex flex-wrap items-start px-5 mx-auto justify-between md:justify-normal md:max-w-80 md:max-h-[150px]">
                                        {Array.from(
                                            { length: numberOfChildren },
                                            (_, index) => {
                                                return (
                                                    <form class="w-24 md:w-16 mb-3 md:mr-4">
                                                        <label
                                                            for="number-input"
                                                            class="block mb-2 text-xs font-medium text-gray-900"
                                                        >
                                                            Child {index + 1}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="number-input"
                                                            aria-describedby="helper-text-explanation"
                                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blacl focus:border-black block w-full p-2.5"
                                                            placeholder="Age"
                                                            required
                                                            onChange={(e) => {
                                                                setChildrenAges(
                                                                    (prev) => {
                                                                        const temp =
                                                                            [
                                                                                ...prev,
                                                                            ];
                                                                        temp[
                                                                            index
                                                                        ] =
                                                                            e.target.value;
                                                                        return temp;
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </form>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="md:ml-1.5">
                        <button
                            onClick={(e) => handleSubmit(e)}
                            class="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full md:w-fit"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function QuickSearchAll({ setTab }) {
    const [keyword, setKeyword] = useState("");
    const handleNavigate = useHandleNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(null);
        handleNavigate(`/quick-search/?keyword=${keyword}`);
    };

    return (
        <>
            <div
                id="all-section"
                class="grid grid-cols-2 p-4 mx-auto md:my-8 bg-white rounded-xl bg-opacity-40"
            >
                <form class="col-span-full flex flex-row">
                    <div class="join w-full">
                        <select
                            id="form-selector-1"
                            class="px-2 select select-bordered join-item w-[70px] pr-2 pl-3 h-[52px] focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                            onChange={(e) => setTab(e.target.value)}
                        >
                            <option value="All" selected="selected">
                                All
                            </option>
                            <option value="Stay">Stay</option>
                            <option value="Flight">Flight</option>
                            <option value="Experience">Experience</option>
                        </select>
                        <div class="w-full">
                            <div>
                                <input
                                    class="w-full input input-bordered join-item h-[52px] bg-white focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                    placeholder="Search for destinations, activities, experiences..."
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="ml-1.5">
                        <button
                            class="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px]"
                            onClick={handleSubmit}
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
