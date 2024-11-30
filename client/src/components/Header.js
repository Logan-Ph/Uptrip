import { useEffect, useState } from "react";
import NavBar from "./Navbar";
import useHandleNavigate from "../utils/useHandleNavigate";
import { useQuery } from "@tanstack/react-query";
import { fetchAttractionsAutocomplete, fetchTripAutoComplete, fetchFlightAutocomplete } from "../api/fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import warningNotify from "../utils/warningNotify";

export default function Header() {
    const [keyword, setKeyword] = useState("");
    const [tab, setTab] = useState("stay");

    const handleNavigate = useHandleNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(null);
        handleNavigate(`/quick-search/?keyword=${keyword}`);
    };

    return (
        <>
            <div className="bg-[#8DD3BB] md:px-10">
                <NavBar />
                <form
                    onSubmit={handleSubmit}
                    className="static mx-auto max-w-7xl px-6 pb-10"
                >
                    <label
                        for="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                            placeholder="Search all"
                            onChange={(e) => setKeyword(e.target.value)}
                            value={keyword}
                            required
                        />
                    </div>
                </form>

                <div className="mx-auto max-w-8xl px-6">
                    <div className="">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                            <li className="" role="presentation">
                                <button
                                    className={`inline-block p-4 rounded-tl-lg ${tab === "stay"
                                            ? "bg-white text-black"
                                            : "text-white bg-[#231F20]"
                                        } `}
                                    type="button"
                                    onClick={() => setTab("stay")}
                                >
                                    <i class="fa-solid fa-hotel"></i> Stay
                                </button>
                            </li>
                            <li className="" role="presentation">
                                <button
                                    className={`inline-block p-4 ${tab === "flight"
                                            ? "bg-white text-black"
                                            : "text-white bg-[#231F20]"
                                        } `}
                                    type="button"
                                    onClick={() => setTab("flight")}
                                >
                                    <i class="fa-solid fa-plane"></i> Flight
                                </button>
                            </li>
                            <li className="" role="presentation">
                                <button
                                    className={`inline-block p-4 rounded-tr-lg ${tab === "experience"
                                            ? "bg-white text-black"
                                            : "text-white bg-[#231F20]"
                                        } `}
                                    type="button"
                                    onClick={() => setTab("experience")}
                                >
                                    <i class="fa-solid fa-umbrella-beach"></i>{" "}
                                    Experience
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="md:px-10 pb-5 bg-[#FAFBFC]">
                <div className="mx-auto max-w-8xl px-6">
                    <div id="default-tab-content">
                        <HandleSelection tab={tab} />
                    </div>
                </div>
            </div>
        </>
    );
}

function HandleSelection({ tab }) {
    switch (tab) {
        case "stay":
            return <AdvancedSearchHotel />;
        case "flight":
            return <AdvancedSearchFlight />;
        case "experience":
            return <AdvancedSearchExperience />;
        default:
            return null;
    }
}

function AdvancedSearchExperience() {
    const [keyword, setKeyword] = useState()
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
        }, 50); // Delay of 1 second

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
        <div
            className="px-5 py-2 rounded-r-lg rounded-bl-lg bg-white shadow-lg"
            id="experience"
            role="tabpanel"
            aria-labelledby="experience-tab"
        >
            <div className="flex flex-row">
                <div className="w-full border-gray-300 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <i className="fa-solid fa-parachute-box text-gray-500"></i>
                    </div>
                    <div>
                        <input
                            className="block rounded-lg  text-gray-900 bg-gray-100 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 w-full ps-10 p-2.5 pt-5 h-[52px] truncate"
                            placeholder="Search for activities in the location"
                            value={autocompletePayload?.districtPathNames}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    {isFetched && !autocompletePayload && (
                        <div class="relative z-40">
                            <ul class="absolute menu bg-white w-full rounded-b-lg overflow-y-auto max-h-40 flex-nowrap h-[400px] overflow-x-auto ">
                                {data.length === 0 ? (
                                    <li className="p-2 font-semibold">No results found</li>
                                ) : (
                                    data.map((item) => (
                                        <li
                                            onClick={() =>
                                                setAutocompletePayload(item)
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
                <div className="ml-2.5" onClick={handleSubmit}>
                    <button className="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

function AdvancedSearchFlight() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [from, setFrom] = useState({})
    const [to, setTo] = useState({})
    const [seatClass, setSeatClass] = useState("ECONOMY")
    const [numberOfAdult, setNumberOfAdult] = useState(1);
    const [numberOfChild, setNumberOfChild] = useState(0);
    const [numberOfInfant, setNumberOfInfant] = useState(0);
    const [keywordFrom, setKeywordFrom] = useState();
    const [keywordTo, setKeywordTo] = useState();
    const [fromEdit, setFromEdit] = useState(false);
    const [toEdit, setToEdit] = useState(false);
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
        }, 50); // Delay of 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [keywordFrom]);

    useEffect(() => {
        setToEdit(true)
        const handler = setTimeout(() => {
            setDebouncedKeywordTo(keywordTo);
        }, 50); // Delay of 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [keywordTo]);

    const fromAutocomplete = useQuery({
        queryKey: ['advanced-search', "flight", debouncedKeywordFrom],
        queryFn: () => fetchFlightAutocomplete(debouncedKeywordFrom),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!debouncedKeywordFrom,
    })

    const toAutocomplete = useQuery({
        queryKey: ['advanced-search', "flight", debouncedKeywordTo],
        queryFn: () => fetchFlightAutocomplete(debouncedKeywordTo),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!debouncedKeywordTo,
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!from) {
            warningNotify("PLease select your origin")
            return
        }

        if (!to) {
            warningNotify("PLease select your destination")
            return
        }

        if (!startDate) {
            warningNotify("Please select your departure date")
            return
        }

        if (!toAutocomplete || !fromAutocomplete) {
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

        setKeywordFrom()
        setKeywordTo()

        navigate(
            `advanced-flight-search?ori=${payload.fromCity}&des=${payload.toCity}&from=${payload.from}&to=${payload.to}&adult=${payload.adult}&child=${payload.child}&infant=${payload.infant}&seatClass=${payload.seatClass}&year=${payload.year}&month=${payload.month}&day=${payload.day}`
        );

    }

    return (
        <div
            className="px-5 py-2 rounded-r-lg rounded-bl-lg bg-white shadow-lg"
            id="flight"
            role="tabpanel"
            aria-labelledby="flight-tab"
        >
            <div className="my-4 md:my-0">
                <div className="">
                    <div className="flex flex-col md:flex-row items-center w-full">
                        <div className="relative w-full md:w-auto mb-2 md:mb-0 md:border-r border-gray-300">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <i className="fa-solid fa-plane-departure text-gray-500"></i>
                            </div>
                            <div>
                                <input
                                    name="origin"
                                    type="text"
                                    className="block rounded-t-lg  text-gray-900 appearance-none focus:outline-none focus:ring-0 pt-5  h-[52px] w-full input  bg-white border md:border-none border-gray-300 ps-10 p-2.5"
                                    placeholder="City or airport"
                                    value={
                                        fromEdit ? keywordFrom : from.cityName
                                    }
                                    onChange={(e) => {
                                        setKeywordFrom(e.target.value);
                                        setFromEdit(true);
                                    }}
                                />
                                <label
                                    for="floating_filled"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    Origin
                                </label>
                            </div>
                            {fromAutocomplete.isFetched && fromEdit && keywordFrom && fromAutocomplete?.data?.length > 0 && (
                                <div className="relative z-40">
                                    <ul className="absolute menu bg-base-200 w-full rounded-b-lg">
                                        {fromAutocomplete?.data?.map((item) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        setFrom(item);
                                                        setFromEdit(false);
                                                    }}
                                                >
                                                    <a>
                                                        <i class="fa-solid fa-plane"></i>{" "}
                                                        {item.cityName} -{" "}
                                                        {item.airportCode}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="relative w-full md:w-auto mb-2 md:mb-0 md:border-r border-gray-300">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <i className="fa-solid fa-plane-arrival text-gray-500"></i>
                            </div>
                            <div>
                                <input
                                    name="destination"
                                    type="text"
                                    className="block rounded-t-lg  text-gray-900 appearance-none focus:outline-none focus:ring-0 pt-5  h-[52px] w-full input  bg-white border md:border-none border-gray-300 ps-10 p-2.5"
                                    placeholder="City or airport"
                                    value={toEdit ? keywordTo : to.cityName}
                                    onChange={(e) => {
                                        setKeywordTo(e.target.value);
                                        setToEdit(true);
                                    }}
                                />
                                <label
                                    for="floating_filled"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    Destination
                                </label>
                            </div>

                            {toAutocomplete.isFetched && toEdit && keywordTo && toAutocomplete?.data?.length > 0 && (
                                <div class="relative z-40">
                                    <ul class="absolute menu bg-base-200 w-full rounded-b-lg overflow-y-hidden scor">
                                        {toAutocomplete?.data?.map((item) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        setTo(item);
                                                        setToEdit(false);
                                                    }}
                                                >
                                                    <a>
                                                        <i class="fa-solid fa-plane"></i>{" "}
                                                        {item.cityName} -{" "}
                                                        {item.airportCode}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="relative w-full md:w-auto mb-2 md:mb-0 md:border-r border-gray-300">
                            <div>
                                <input
                                    type="date"
                                    name="start"
                                    className="block rounded-t-lg  text-gray-900 appearance-none focus:outline-none focus:ring-0 pt-5  h-[52px] w-full input  bg-white border md:border-none border-gray-300 ps-4 p-2.5"
                                    placeholder="dd/mm/yyyy"
                                    id="datepickerId3"
                                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStartDate(newStartDate);
                                    }}
                                />
                                <label
                                    for="floating_filled"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    Departing
                                </label>
                            </div>
                        </div>

                        {/* Ask for number of passenger */}
                        <div className="relative mb-2 md:mb-0 grow md:border-none border-gray-300">
                            <button
                                id="dropdownDefaultButton"
                                data-dropdown-toggle="dropdown"
                                className="text-gray-900 focus:ring-0 focus:outline-none font-medium rounded-t-lg  text-sm px-5 py-2.5 text-start md:text-center inline-flex items-center  relative pt-5 justify-between appearance-none h-[80px] md:h-[52px] w-full input  bg-white border md:border-none border-gray-300 ps-10 p-2.5"
                                type="button"
                                onClick={() => setOpenMenu((prev) => !prev)}
                            >
                                <label
                                    for="floating_filled"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto font-medium"
                                >
                                    No. of Passengers and Seat Class
                                </label>
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <i className="fa-regular fa-user w-4 h-4 text-gray-500"></i>
                                </div>
                                {numberOfAdult} Adult, {numberOfChild} Child,{" "}
                                {numberOfInfant} Infant and Premium {seatClass}
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
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
                                className={`z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow absolute w-full mt-2 ${openMenu ? "" : "hidden"
                                    }`}
                            >
                                <div
                                    className="py-2 text-sm text-gray-700 my-3 mx-5 space-y-4"
                                    aria-labelledby="dropdownDefaultButton"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <div>
                                                <i className="fa-solid fa-child"></i>{" "}
                                                Adult
                                            </div>
                                            <div>(age 12 and over)</div>
                                        </div>
                                        <div>
                                            <div className="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                    onClick={() => {
                                                        setNumberOfAdult(
                                                            (prev) =>
                                                                prev +
                                                                    1 +
                                                                    numberOfChild +
                                                                    numberOfInfant <=
                                                                    6
                                                                    ? prev + 1
                                                                    : prev
                                                        );
                                                    }}
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>

                                                <span className="text-lg">
                                                    {" "}
                                                    {numberOfAdult}{" "}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfAdult(
                                                            (prev) =>
                                                                prev - 1 > 0
                                                                    ? prev - 1
                                                                    : 1
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <div>
                                                <i className="fa-solid fa-child-reaching"></i>{" "}
                                                Child
                                            </div>
                                            <div>(age 2 - 11)</div>
                                        </div>
                                        <div>
                                            <div className="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
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
                                                                    ? prev + 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>

                                                <span className="text-lg">
                                                    {" "}
                                                    {numberOfChild}{" "}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfChild(
                                                            (prev) =>
                                                                prev - 1 >= 0
                                                                    ? prev - 1
                                                                    : 0
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <div>
                                                <i className="fa-solid fa-baby"></i>{" "}
                                                Infant
                                            </div>
                                            <div>(below age 2)</div>
                                        </div>
                                        <div>
                                            <div className="flex space-x-3 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
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
                                                                    ? prev + 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>

                                                <span className="text-lg">
                                                    {" "}
                                                    {numberOfInfant}{" "}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                    onClick={() =>
                                                        setNumberOfInfant(
                                                            (prev) =>
                                                                prev - 1 >= 0
                                                                    ? prev - 1
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Choose seat class */}
                                    <div class="flex justify-between grow flex-wrap">
                                        <div
                                            className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                            onClick={() => setSeatClass("ECONOMY")}
                                        >
                                            Economy
                                        </div>
                                        <div
                                            className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                            onClick={() => setSeatClass("BUSINESS")}
                                        >
                                            Business
                                        </div>
                                        <div
                                            className="p-3 bg-gray-200 border rounded-md font-semibold hover:bg-black hover:text-white cursor-pointer duration-300 grow m-2 text-center"
                                            onClick={() => setSeatClass("FIRST")}
                                        >
                                            First
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:ml-1.5 w-full md:w-fit">
                            <button
                                onClick={(e) => handleSubmit(e)}
                                className="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full md:w-fit"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdvancedSearchHotel() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState("");
    const [autocompletePayload, setAutocompletePayload] = useState();
    const [dropdown, setDropdown] = useState(false);
    const [numberOfAdults, setNumberOfAdults] = useState(Number(searchParams.get("adult")) || 1);
    const [numberOfChildren, setNumberOfChildren] = useState(Number(searchParams.get("children")) || 0);
    const [numberOfRooms, setNumberOfRooms] = useState(Number(searchParams.get("crn")) || 1);
    const [childrenAges, setChildrenAges] = useState(searchParams.get("ages")?.split(",") || []);
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
    const [checkin, setCheckin] = useState(searchParams.get("checkin")?.slice(0, 4) + "-" + searchParams.get("checkin")?.slice(4, 6) + "-" + searchParams.get("checkin")?.slice(6));
    const [checkout, setCheckout] = useState(searchParams.get("checkout")?.slice(0, 4) + "-" + searchParams.get("checkout")?.slice(4, 6) + "-" + searchParams.get("checkout")?.slice(6));

    const { data, isFetched } = useQuery({
        queryKey: ["quick-search", "hotels", debouncedKeyword],
        queryFn: () => fetchTripAutoComplete(debouncedKeyword),
        refetchOnWindowFocus: false,
        enabled: !!debouncedKeyword,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 50);

        return () => {
            clearTimeout(handler);
        };
    }, [keyword]);

    useEffect(() => {
        setAutocompletePayload(null);
    }, [debouncedKeyword]);


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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!autocompletePayload && searchParams.get("resultType") === null) {
            warningNotify("Please select a location");
            return;
        }

        if (!checkin && searchParams.get("checkin") === null) {
            warningNotify("Please select checkin date")
            return
        }

        if (!checkout && searchParams.get("checkout") === null) {
            warningNotify("Please select checkout date")
            return
        }

        let payload = {
            checkin: checkin.replace(/-/g, '') ,
            checkout: checkout.replace(/-/g, ''),
            city: autocompletePayload?.city?.geoCode || searchParams.get("city"),
            resultType: autocompletePayload?.resultType || searchParams.get("resultType"),
            countryId: autocompletePayload?.country?.geoCode || searchParams.get("countryId"),
            districtId: 0 || searchParams.get("districtId"),
            provinceId: autocompletePayload?.province?.geoCode || searchParams.get("provinceId"),
            cityType: autocompletePayload?.cityType || searchParams.get("cityType"),
            latitude: autocompletePayload?.coordinateInfos[3]?.latitude || searchParams.get("latitude"),
            longitude: autocompletePayload?.coordinateInfos[3]?.longitude || searchParams.get("longitude"),
            searchCoordinate: autocompletePayload?.coordinateInfos
                .map(
                    (info) =>
                        `${info.coordinateType}_${info.latitude}_${info.longitude}_${info.accuracy}`
                )
                .join("|") || searchParams.get("searchCoordinate"),
            crn: numberOfRooms || searchParams.get("crn"),
            adult: numberOfAdults || searchParams.get("adult"),
            children: numberOfChildren || searchParams.get("children"),
            ages: childrenAges || searchParams.get("ages"),
            domestic: false || searchParams.get("domestic"),
            listFilters: "17~1*17*1*2" || searchParams.get("listFilters"),
        };

        console.log(payload.city);

        if (payload.resultType === "H") {
            payload = {
                ...payload,
                hotelName: autocompletePayload?.resultWord || searchParams.get("hotelName"),
                searchValue: `${autocompletePayload?.item?.data?.filterID}_${autocompletePayload?.item?.data?.type}_${autocompletePayload?.item?.data?.value}_${autocompletePayload?.item?.data?.subType}` || searchParams.get("searchValue"),
                cityName: autocompletePayload?.city?.currentLocaleName || searchParams.get("cityName"),
                preHotelIds: autocompletePayload?.code || searchParams.get("preHotelIds")
            }
            navigate(
                `/advanced-hotel-search/?resultType=${payload.resultType}&hotelId=${autocompletePayload.code}&city=${payload.city}&cityName=${payload.cityName}&hotelName=${payload.hotelName}&searchValue=${payload.searchValue}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=VND&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&ages=${renderAgesString(payload.ages)}&preHotelIds=${payload.preHotelIds}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`
            );
        } else {
            payload = {
                ...payload,
                cityName: autocompletePayload?.resultWord || searchParams.get("cityName"),
            };
            navigate(
                `/advanced-hotel-search/?resultType=${payload.resultType}&city=${payload.city}&cityName=${payload.cityName}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=VND&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&ages=${renderAgesString(payload.ages)}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`
            );
        }
        setDropdown(false)
    };

    return (
        <div
            className="rounded-br-lg  px-5 py-2 rounded-bl-lg bg-white shadow-lg"
            id="stay"
            role="tabpanel"
            aria-labelledby="stay-tab"
        >
            <div className="my-4 md:my-0">
                <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0">
                    <div className="relative grow md:border-r border-gray-300">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <i className="fa-solid fa-hotel text-gray-500"></i>
                        </div>
                        <input
                            className="h-[52px] w-full input  bg-white border md:border-none border-gray-300 ps-10 p-2.5 focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                            placeholder="Where are you going?"
                            value={autocompletePayload?.resultWord}
                            defaultValue={searchParams.get("resultType") !== "H" ? searchParams.get("cityName") : searchParams.get("hotelName")}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="relative z-40 drop-shadow-lg">
                            {isFetched && !autocompletePayload && (
                                <div class="relative z-40 drop-shadow-lg">
                                    <ul class="absolute menu bg-white w-full rounded-b-lg">
                                        {data?.keyWordSearchResults?.map(
                                            (element) => {
                                                switch (element?.resultType) {
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
                                                    default:
                                                        return (
                                                            <>
                                                                {
                                                                    element?.resultWord
                                                                }
                                                            </>
                                                        );
                                                }
                                            }
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative grow md:border-r border-gray-300">
                        <div>
                            <input
                                type="date"
                                name="start"
                                className="bg-white text-gray-900 text-sm border md:border-none rounded-lg block w-full ps-4 p-2.5 pt-5 md:rounded-none border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                placeholder="dd/mm/yyyy"
                                min={new Date().toISOString().split("T")[0]} // Set min date to today
                                max={checkout || ""} // Set max date to endDate if it exists
                                onChange={(e) => {
                                    const newStartDate = e.target.value;
                                    setCheckin(newStartDate);
                                }}
                                value={checkin}
                            />
                            <label
                                for="floating_filled"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                            >
                                Check-in
                            </label>
                        </div>
                    </div>
                    <div className="relative grow md:border-r border-gray-300">
                        <div>
                            <input
                                name="end"
                                type="date"
                                className="bg-white text-gray-900 text-sm border md:border-none rounded-lg block w-full ps-4 p-2.5 pt-5 md:rounded-none border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                                placeholder="dd/mm/yyyy"
                                min={
                                    checkin ||
                                    new Date().toISOString().split("T")[0]
                                } // Ensure end date is not before start date
                                onChange={(e) => {
                                    const newEndDate = e.target.value;
                                    if (newEndDate < checkin) {
                                        setCheckin(newEndDate);
                                    }
                                    setCheckout(newEndDate);
                                }}
                                value={checkout}
                            />
                            <label
                                for="floating_filled"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                            >
                                Check-out
                            </label>
                        </div>
                    </div>

                    <div className="grow border-gray-300 md:border-none rounded-lg">
                        <button
                            id="dropdownDividerButton"
                            data-dropdown-toggle="dropdownDivider"
                            className="text-gray-500 bg-white font-medium rounded-lg md:rounded-l-none border border-gray-300 md:border-none text-sm px-5 py-2.5 text-center inline-flex items-center h-[52px] relative p-2.5 pt-5 ps-10 w-full justify-between focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none"
                            type="button"
                            onClick={() => setDropdown((prev) => !prev)}
                        >
                            <label
                                for="floating_filled"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto font-medium"
                            >
                                Guest(s) and Room(s)
                            </label>
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <i className="fa-regular fa-user w-4 h-4 text-gray-500"></i>
                            </div>
                            {numberOfAdults} adult, {numberOfChildren} child,{" "}
                            {numberOfRooms} room{" "}
                            <svg
                                className="w-2.5 h-2.5 ms-3"
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
                            class={`z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow ${dropdown ? "" : "hidden"
                                }`}
                        >
                            {/* Ask user to input room information */}
                            <div
                                className="py-3 text-sm text-gray-700 my-3 mx-5 space-y-4"
                                aria-labelledby="dropdownDividerButton"
                            >
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <div>
                                            <i className="fa-solid fa-door-open"></i>{" "}
                                            Room(s)
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex space-x-3 items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    setNumberOfRooms((prev) =>
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
                                            <span className="text-lg">
                                                {" "}
                                                {numberOfRooms}{" "}
                                            </span>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                                onClick={() => {
                                                    setNumberOfRooms((prev) => {
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
                                                    });
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
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <div>
                                            <i
                                                className="fa-solid fa-person"
                                                aria-hidden="true"
                                            ></i>{" "}
                                            Adult(s)
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex space-x-3 items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    setNumberOfAdults((prev) =>
                                                        prev - 1 > 0 &&
                                                            prev > numberOfRooms
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
                                            <span className="text-lg">
                                                {" "}
                                                {numberOfAdults}{" "}
                                            </span>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
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
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <div>
                                            <i
                                                className="fa-solid fa-child-reaching"
                                                aria-hidden="true"
                                            ></i>{" "}
                                            Children
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            maximum 17 years old
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex space-x-3 items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    setNumberOfChildren(
                                                        (prev) => {
                                                            if (prev > 0) {
                                                                setChildrenAges(
                                                                    (prev) =>
                                                                        prev.slice(
                                                                            0,
                                                                            prev.length -
                                                                            1
                                                                        )
                                                                );
                                                                return prev - 1;
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
                                            <span className="text-lg">
                                                {" "}
                                                {numberOfChildren}{" "}
                                            </span>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    setNumberOfChildren(
                                                        (prev) =>
                                                            prev <
                                                                numberOfRooms * 6
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
                            <div className="py-2">
                                <div
                                    href="#"
                                    className="block px-4 pb-2 text-[12px] text-gray-500 md:max-w-72"
                                >
                                    Please enter your children's ages by the
                                    time of check-in
                                </div>
                                <div className="flex flex-wrap items-center mx-auto justify-between md:justify-normal md:max-w-72 px-5">
                                    {Array.from(
                                        { length: numberOfChildren },
                                        (_, index) => {
                                            return (
                                                <form className="w-24 md:w-16 mb-3 md:mr-4">
                                                    <label
                                                        for="number-input"
                                                        className="block mb-2 text-xs font-medium text-gray-900"
                                                    >
                                                        Child {index + 1}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="number-input"
                                                        aria-describedby="helper-text-explanation"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                                        placeholder="Age"
                                                        required
                                                        maxLength={2}
                                                        min={0}
                                                        max={17}
                                                        value={
                                                            childrenAges[index]
                                                        }
                                                        onChange={(e) => {
                                                            if (
                                                                e.target
                                                                    .value ===
                                                                ""
                                                            ) {
                                                                setChildrenAges(
                                                                    (prev) => {
                                                                        const temp =
                                                                            [
                                                                                ...prev,
                                                                            ];
                                                                        temp[
                                                                            index
                                                                        ] =
                                                                            null;
                                                                        return temp;
                                                                    }
                                                                );
                                                            }

                                                            const newValue =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                );
                                                            if (
                                                                newValue >= 0 &&
                                                                newValue <= 17
                                                            ) {
                                                                setChildrenAges(
                                                                    (prev) => {
                                                                        const temp =
                                                                            [
                                                                                ...prev,
                                                                            ];
                                                                        temp[
                                                                            index
                                                                        ] =
                                                                            newValue;
                                                                        return temp;
                                                                    }
                                                                );
                                                            }
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

                    <div className="md:ml-1.5">
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className="btn rounded-lg bg-[#FFA732] text-white border-none h-[52px] w-full md:w-fit"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
