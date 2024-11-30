import { AdvancedFlightFilter } from "../components/AdvancedFlightFilter";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useState, useEffect } from "react";
import ASearchSkeleton from "../components/skeletonLoadings/ASearchSkeleton";
import { useSearchParams } from "react-router-dom";
import { fetchFlightAdvancedSearch, fetchTripComFlight, fetchBayDepFlight, fetchMyTripFlight } from "../api/fetch.js";
import ScrollUpButton from "../components/ScrollUpButton.js";
import { FlightSortOption } from "../components/FlightSortOption.js";
import noFlight from "../components/images/no-results-found.png";
import AdvancedFlightCard from "../components/AdvancedFlightCard.js"

export default function AdvancedSearchFlightPage() {
    const [searchParams] = useSearchParams();
    const [sortField, setSortField] = useState("best");
    const [sortDir, setSortDir] = useState("asc");
    const [prefer, setPrefer] = useState([]);
    const [priceFilter, setPriceFilter] = useState([]);
    const [departureTime, setDepartureTime] = useState([0, 1440])
    const [arrivalTime, setArrivalTime] = useState([0, 1440])
    const payload = {
        year: searchParams.get("year"),
        month: searchParams.get("month"),
        day: searchParams.get("day"),
        from: searchParams.get("from"),
        to: searchParams.get("to"),
        adult: searchParams.get("adult"),
        child: searchParams.get("child"),
        infant: searchParams.get("infant"),
        seatClass: searchParams.get("seatClass"),
        sortField: sortField,
        sortDir: sortDir,
        prefer: prefer,
        priceFilter: priceFilter,
        departureTime: departureTime,
        arrivalTime: arrivalTime
    }

    const defaultSort = () => {
        setSortField("best");
        setSortDir("asc");
    }

    const priceAscSort = () => {
        setSortField("price");
        setSortDir("asc");
    }

    const priceDescSort = () => {
        setSortField("price");
        setSortDir("desc");
    }
    
    const agoda = useQuery({
        queryKey: ["advanced-search-flight", payload, sortField, sortDir, prefer, priceFilter, departureTime, arrivalTime],
        queryFn: () => fetchFlightAdvancedSearch(payload),
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (agoda.isSuccess && agoda.data.flights.length === 0) {
            agoda.refetch()
        }
    }, [agoda])

    const priceMax = agoda.isSuccess ? agoda.data.priceMax : 0;

    const tripCom = useQuery({
        queryKey: ["tripcom-flight", payload],
        queryFn: () => fetchTripComFlight(payload),
        retry: false,
        refetchOnWindowFocus: false,
    });


    const myTrip = useQuery({
        queryKey: ["mytrip-flight", payload],
        queryFn: () => fetchMyTripFlight(payload),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const bayDep = useQuery({
        queryKey: ["baydep-flight", payload],
        queryFn: () => fetchBayDepFlight(payload),
        retry: false,
        refetchOnWindowFocus: false,
    })


    return (
        <>
            <div className='bg-[#FAFBFC] md:p-10'>
                <section className="mx-auto max-w-8xl px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3">

                        <div className="relative">
                            <div className="font-bold text-xl mb-4">Filters</div>
                            <AdvancedFlightFilter setPrefer={setPrefer} setPriceFilter={setPriceFilter} setDepartureTime={setDepartureTime} setArrivalTime={setArrivalTime} priceMax={priceMax} priceStep={!agoda.isSuccess ? 0 : agoda.data.priceStep}/>
                            <div className="absolute inset-y-0 right-0 w-px bg-gray-500 hidden lg:block mr-10"></div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center justify-between mt-10 md:mt-0">
                                <div className="w-1/2">
                                    <p className="text-sm md:text-lg">Showing {!agoda.isSuccess ? 0 : agoda.data.flights.length} flights</p>
                                </div>

                                <div>
                                    <FlightSortOption defaultSort={defaultSort} priceAscSort={priceAscSort} priceDescSort={priceDescSort}/>
                                </div>
                            </div>
                            {!agoda.isSuccess && 
                                <>
                                    <ASearchSkeleton />
                                    <ASearchSkeleton />
                                    <ASearchSkeleton />
                                </>
                            }

                            {agoda.isSuccess &&
                                agoda.data.flights.map((flight) => {
                                    const tripComPrice = tripCom.isSuccess && tripCom.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)) ? Math.round(tripCom.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)).price) : null
                                    const myTripPrice = myTrip.isSuccess && myTrip.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)) ? Math.round(myTrip.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)).price) : null
                                    const bayDepPrice = bayDep.isSuccess && bayDep.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)) ? Math.round(bayDep.data.find(item => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo)).price) : null
                                    return (
                                    <Suspense fallback={<ASearchSkeleton />}> 
                                        <AdvancedFlightCard from={searchParams.get("from")} to={searchParams.get("to")} flight={flight} tripComPrice={tripComPrice} myTripPrice={myTripPrice} bayDepPrice={bayDepPrice} tripComSuccess={tripCom.isSuccess} myTripSuccess={myTrip.isSuccess} bayDepSuccess={bayDep.isSuccess}/>
                                    </Suspense>)
                                })
                            }

                            {
                                agoda.isSuccess && agoda.data.flights.length === 0 &&
                                <div className="flex justify-center items-center h-full">
                                    <img src={noFlight} alt="no flight" className="w-full"/>
                                </div>
                            }
                        </div>

                    </div>
                    <ScrollUpButton/>
                </section>
            </div>
        </>
    )
}
