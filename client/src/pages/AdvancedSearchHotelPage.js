import UnderMaintenance from "../components/images/under-maintenance.png";
import { SortOption } from "../components/SortOption";
import { AdvancedHotelFilter } from "../components/AdvancedHotelFilter";
import {useInView} from "react-intersection-observer"
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import ASearchSkeleton from "../components/skeletonLoadings/ASearchSkeleton";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
    fetchHotelAdvancedSearch,
    fetchHotelPriceComparison,
    fetchSpecificHotel,
    getAppConfig,
} from "../api/fetch.js";
import ScrollUpButton from "../components/ScrollUpButton.js";

const AdvancedHotelCardLazy = lazy(() =>
    import("../components/AdvancedHotelCard.js")
);

export default function AdvancedSearchHotelPage() {
    const [searchParams] = useSearchParams();
    const {ref, inView} = useInView()
    const listSort = useRef(searchParams.get("listFilters")?.split(",")?.[0]);
    const listFilter = useRef(
        searchParams.get("listFilters")?.split(",")?.slice(1)
    );
    const [priceData, setPriceData] = useState({})
    const daysBetween = (checkin, checkout) =>
        (new Date(
            checkout.slice(0, 4),
            checkout.slice(4, 6) - 1,
            checkout.slice(6)
        ) -
            new Date(
                checkin.slice(0, 4),
                checkin.slice(4, 6) - 1,
                checkin.slice(6)
            )) /
        (1000 * 60 * 60 * 24);

    let payload = {
        resultType: searchParams.get("resultType"),
        hotelId: searchParams.get("hotelId"),
        city: searchParams.get("city"),
        cityName: searchParams.get("cityName"),
        hotelName: searchParams.get("hotelName"),
        searchValue: searchParams.get("searchValue"),
        provinceId: searchParams.get("provinceId"),
        countryId: searchParams.get("countryId"),
        districtId: searchParams.get("districtId"),
        checkin: searchParams.get("checkin"),
        checkout: searchParams.get("checkout"),
        barCurr: searchParams.get("barCurr"),
        cityType: searchParams.get("cityType"),
        latitude: searchParams.get("latitude"),
        longitude: searchParams.get("longitude"),
        searchCoordinate: searchParams.get("searchCoordinate"),
        crn: searchParams.get("crn"),
        adult: searchParams.get("adult"),
        children: searchParams.get("children"),
        ages: searchParams.get("ages"),
        domestic: searchParams.get("domestic"),
        preHotelIds: searchParams.getAll("preHotelIds"),
        listFilters: `${listSort.current},${listFilter.current}`,
    }

    const filterOptions = useQuery({
        queryKey: ["get-app-config"],
        queryFn: getAppConfig,
        
        refetchOnWindowFocus: false,
    });

    const {
        data: specificHotel,
        status: specificHotelStatus,
    } = useQuery({
        queryKey: ["advanced-search-specific", payload.hotelId], // Updated to include hotelId
        queryFn: () => fetchSpecificHotel(payload),
        
        refetchOnWindowFocus: false,
        enabled: !!(payload.resultType === "H" && payload.hotelId), // Ensure hotelId is present
    });

    const {
        data: hotelList,
        isFetching: hotelListLoading,
        status: hotelListStatus,
        fetchNextPage
    } = useInfiniteQuery({
        queryKey: ["advanced-search", "hotels", payload],
        queryFn: ({ pageParam = payload }) =>
            fetchHotelAdvancedSearch(pageParam),
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, allPages) => {
            const lastPageIds = lastPage.preHotelIds;
            if (lastPageIds && lastPageIds.length > 0) { // Check if lastPageIds is not empty
                const accumulatedIds = allPages.reduce((acc, page) => {
                    return acc.concat(page.preHotelIds || []);
                }, []);

                return {
                    ...payload,
                    preHotelIds: [
                        ...new Set([...accumulatedIds, ...lastPageIds]),
                    ],
                };
            }

            // Return undefined if there are no more pages
            return undefined;
        },
    });

    console.log(priceData)

    const getSpecificHotelPriceComparison = useQuery({
        queryKey: ["hotel-price-comparison", specificHotel],
        queryFn: () => fetchHotelPriceComparison({ ...payload, hotelNames: [specificHotel.matchHotel.name] }),
        
        refetchOnWindowFocus: false,
        enabled: !!(payload.resultType === "H"),
    });

    const hotelNames = useMemo(() => {
        const lastPage = hotelList?.pages?.[hotelList?.pages?.length - 1];
        if (!lastPage) return [];
        return lastPage.hotelName;
    }, [hotelList?.pages]);

    const getHotelPriceComparison = useQuery({
        queryKey: ["hotel-price-comparison", hotelNames],
        queryFn: () => fetchHotelPriceComparison({ ...payload, hotelNames }),
        
        refetchOnWindowFocus: false,
        enabled: !!(hotelNames?.length > 0),
    });

    useEffect(() => {
        if (getHotelPriceComparison.isSuccess && getHotelPriceComparison.data) {
            setPriceData(prevData => ({
                ...prevData,
                ...getHotelPriceComparison.data.reduce((acc, data, index) => {
                    acc[hotelNames[index]] = data; // Map price data to hotel names
                    return acc;
                }, {})
            }));
        }
    }, [getHotelPriceComparison.isSuccess, getHotelPriceComparison.data, hotelNames]);


    useEffect(() => {
        if (inView && !hotelListLoading && !getHotelPriceComparison.isLoading && !getHotelPriceComparison.isFetching) {
            fetchNextPage()
        }
    }, [inView, hotelListLoading, fetchNextPage, getHotelPriceComparison.isLoading, getHotelPriceComparison.isFetching])

    return (
        <>
            <div className="bg-[#FAFBFC] md:p-10">
                <section className="mx-auto max-w-8xl md:px-6 md:py-6 max-md:p-2 ">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        <div className="relative">
                            <div className="font-bold text-xl mb-4">
                                Filters
                            </div>
                            <AdvancedHotelFilter
                                filterOptions={filterOptions}
                                listFilter={listFilter}
                                payload={payload}
                                listSort={listSort}
                            />
                            <div className="lg:absolute inset-y-0 right-0 w-px bg-gray-500 hidden lg:block mr-10"></div>
                        </div>

                        <div className="col-span-2 max-md:mx-3">
                            {hotelListStatus !== "error" && (
                                <div className="flex items-center justify-between max-md:mt-5">
                                    <div className="w-1/2 md:mt-0 items-center">
                                        <p className="text-sm md:text-lg">
                                            Showing properties found in{" "}
                                            <span className="font-bold text-sm md:text-lg text-wrap md:text-nowrap text-[#EF4040]">
                                                {payload.cityName}
                                            </span>
                                        </p>
                                    </div>
                                
                                    <div>
                                        <SortOption
                                            payload={payload}
                                            listSort={listSort}
                                            listFilter={listFilter}
                                        />
                                    </div>
                                </div>
                            )}

                            {specificHotelStatus === "success" && payload.hotelId && (
                                <>
                                    <AdvancedHotel
                                        payload={payload}
                                        specificHotel={specificHotel}
                                        getSpecificHotelPriceComparison={getSpecificHotelPriceComparison}
                                    />
                                    <div className="text-sm md:text-lg md:mt-[30px]">
                                        You may also like: 
                                    </div>
                                </>
                            )}
                            
                            {hotelListStatus === "success" &&
                                hotelList.pages.map((page, pageIndex) => {
                                    return page.hotelList.map(
                                        (hotel, hotelIndex) => {
                                            const hotelName = hotel.hotelBasicInfo.hotelName;
                                            const hotelPriceInfo = priceData[hotelName];
                                            const agodaPrice = hotelPriceInfo?.agodaPrice?.price
                                                    ? Math.round(hotelPriceInfo.agodaPrice?.price?.[0]?.price?.perRoomPerNight?.exclusive?.display).toLocaleString("vi-VN")
                                                    : null;
                                            const bookingPrice = hotelPriceInfo?.bookingPrice?.price    
                                                    ? Math.round(hotelPriceInfo.bookingPrice?.price?.reduce((acc, curr) => acc + Number(curr.finalPrice.amount), 0) / (Number(payload.adult) *
                                                        Number(daysBetween(payload.checkin, payload.checkout)))
                                                        ).toLocaleString("vi-VN")
                                                    : null;
                                            return (
                                                <Suspense
                                                    fallback={<ASearchSkeleton />}
                                                >
                                                    <AdvancedHotelCardLazy
                                                        payload={payload}
                                                        priceData={hotelPriceInfo}
                                                        hotel={hotel}
                                                        agodaPrice={agodaPrice}
                                                        bookingPrice={bookingPrice}
                                                        isSpecific={false}
                                                        isSuccess={Boolean(hotelPriceInfo)}
                                                    />
                                                </Suspense>
                                            );
                                        });
                            })}
                            {hotelListStatus === "error" && (
                                <img src={UnderMaintenance} alt="error" className="w-full h-full object-contain" />
                            )}
                            {(hotelListLoading) && (
                                <>
                                    <ASearchSkeleton />
                                    <ASearchSkeleton />
                                    <ASearchSkeleton />
                                </>
                            )}
                        </div>
                    </div>
                    {hotelListStatus === "success" &&
                        <div ref={ref}/>
                    }
                    
                </section>
                <ScrollUpButton />
            </div>
        </>
    );
}

function AdvancedHotel({payload, specificHotel, getSpecificHotelPriceComparison}) {
    const daysBetween = (checkin, checkout) =>
        (new Date(
            checkout.slice(0, 4),
            checkout.slice(4, 6) - 1,
            checkout.slice(6)
        ) -
            new Date(
                checkin.slice(0, 4),
                checkin.slice(4, 6) - 1,
                checkin.slice(6)
            )) /
        (1000 * 60 * 60 * 24);

    const priceData =
        getSpecificHotelPriceComparison.isSuccess
            ? getSpecificHotelPriceComparison.data[0]
            : null;
    const agodaPrice = priceData?.agodaPrice?.price
        ? Math.round(
            priceData.agodaPrice?.price?.[0]?.price
                ?.perRoomPerNight?.exclusive
                ?.display
        ).toLocaleString("vi-VN")
        : null;
    const bookingPrice = priceData?.bookingPrice
        ? Math.round(
            priceData.bookingPrice?.price?.reduce(
                (acc, curr) =>
                    acc +
                    Number(
                        curr.finalPrice.amount
                    ),
                0
            ) / (Number(payload.adult) *
                Number(
                    daysBetween(
                        payload.checkin,
                        payload.checkout
                    )
                ))
        ).toLocaleString("vi-VN")
        : null;
        return (
            <Suspense
                fallback={<ASearchSkeleton />}
            >
                <AdvancedHotelCardLazy
                    payload={payload}
                    hotel={specificHotel.matchHotel}
                    agodaPrice={agodaPrice}
                    bookingPrice={bookingPrice}
                    isSpecific={true}
                    priceData={priceData}
                    isSuccess={
                        getSpecificHotelPriceComparison.isSuccess
                    }
                />
            </Suspense>
        );
}
