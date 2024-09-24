import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AddToFavorite from "./AddToFavorite";
import useHandleNavigate from "../utils/useHandleNavigate";

export default function AdvancedHotelCard({ payload, hotel, agodaPrice, bookingPrice, isSuccess, isSpecific, priceData }) {
    return (
        <>
            <div className="relative">
                <HotelCard
                    hotel={hotel}
                    payload={payload}
                    priceData={priceData}
                    key={hotel?.hotelBasicInfo?.hotelId || hotel?.name}
                    imgSrc={hotel?.hotelBasicInfo?.hotelImg || hotel?.img}
                    hotelName={hotel?.hotelBasicInfo?.hotelName || hotel?.name}
                    district={hotel?.positionInfo?.positionDesc || hotel?.transportInfo[0]}
                    city={hotel?.positionInfo?.cityName || hotel?.transportInfo[1]}
                    price={hotel?.hotelBasicInfo?.price?.toLocaleString("vi-VN") || hotel?.price?.toLocaleString("vi-VN") || "-"}
                    starRating={hotel?.hotelStarInfo?.star || hotel?.starNum}
                    agodaPrice={agodaPrice}
                    bookingPrice={bookingPrice}
                    isSuccess={isSuccess}
                    isSpecific={isSpecific}
                />
                {isSpecific && (
                <div className="visible text-black">Popular hotels nearby</div>
            )}
                <div className="absolute top-0 right-0">
                    <AddToFavorite payload={payload} hotel={hotel}/>   
                </div>
            </div> 
        </>
    );
}

export function HotelCard({
    imgSrc,
    hotelName,
    district,
    city,
    price,
    starRating,
    agodaPrice,
    bookingPrice,
    isSuccess,
    isSpecific, 
    hotel,
    payload,
    priceData
}) {
    const handleNavigate = useHandleNavigate()
    const [searchParams] = useSearchParams()
    const daysBetween = (checkin, checkout) => (new Date(checkout.slice(0, 4), checkout.slice(4, 6) - 1, checkout.slice(6)) - new Date(checkin.slice(0, 4), checkin.slice(4, 6) - 1, checkin.slice(6))) / (1000 * 60 * 60 * 24);
    const formatDate = dateStr => dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    const bookingURL = `https://www.booking.com/hotel/vn/${priceData?.bookingPrice?.pageName}.vi.html?checkin=${formatDate(payload.checkin)};checkout=${formatDate(payload.checkout)};dest_id=${priceData?.booking?.matchHotel?.dest_id};dest_type=${priceData?.booking?.matchHotel?.dest_type};group_adults=${payload.adult};group_children=${payload.children};no_rooms=${payload.crn}`
    const agodaURL = `https://www.agoda.com/vi-vn${priceData?.agodaPrice?.pageName}?finalPriceView=1&isShowMobileAppPrice=false&numberOfBedrooms=&familyMode=false&adults=${payload.adult}&children=${payload.children}&rooms=${payload.crn}&maxRooms=0&checkIn=${formatDate(payload.checkin)}&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=VND&los=${daysBetween(payload.checkin, payload.checkout)}`
    const tripURL = `https://us.trip.com/hotels/detail/?cityId=${payload.city}&hotelId=${payload?.hotelId || hotel?.hotelBasicInfo?.hotelId}&checkIn=${formatDate(payload.checkin)}&checkOut=${formatDate(payload.checkout)}&adult=${payload.adult}&children=0&subStamp=1479&crn=${payload.crn}&ages=&travelpurpose=0&curr=VND&detailFilters=17%7C1~17~1*80%7C0%7C1~80~0&hotelType=normal&barcurr=VND&locale=en-US`
    const websiteLogo = useMemo(() => [
        {
            imgLogo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png",
            price: agodaPrice ? agodaPrice : null,
            link: agodaURL
        },
        {

            imgLogo: "https://ik.imagekit.io/Uptrip/booking.com?updatedAt=1712829810252",
            price: bookingPrice ? bookingPrice : null,
            link: bookingURL
        },
        {
            imgLogo: "https://ik.imagekit.io/Uptrip/trip.com?updatedAt=1712830814655",
            price: price ? price : null,
            link: tripURL
        },
    ], [agodaPrice, bookingPrice, price, agodaURL, bookingURL, tripURL]);

    const [hearts, setHearts] = useState(
         websiteLogo.map((logo) => ({
            isFilled: false,
            imgLogo: logo.imgLogo,
            price: logo.price,
            link: logo.link
        }))
    );

    useEffect(()=> {
        setHearts(websiteLogo.map((logo) => ({
            isFilled: false,
            imgLogo: logo.imgLogo,
            price: logo.price,
            link: logo.link
        })))
    },[agodaPrice, bookingPrice, price, websiteLogo])

    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            { rootMargin: "0px" }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [isIntersecting]);

    const visibilityClass = isIntersecting
        ? "opacity-100 translate-y-10 transition ease-in-out"
        : "opacity-0 translate-y-10";

    return (
        <>
            <div
                ref={ref}
                className={`bg-white rounded-md grid grid-cols-3 gap-4 md:gap-8 mb-4 shadow-md  ${isSpecific ? "border-8 p-2 border-[#8DD3BB]" : ""} ${visibilityClass}`}
            >
                <Link 
                onClick={() => handleNavigate(`/hotel-detailed-page?resultType=${payload.resultType}&hotelId=${hotel?.hotelBasicInfo?.hotelId || payload.hotelId}&city=${payload.city}&cityName=${payload.cityName}&hotelName=${hotel?.hotelBasicInfo?.hotelName || payload.hotelName}&searchValue=${searchParams.get("searchValue")}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&preHotelIds=${payload.preHotelIds}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`)}
                >
                    <img
                        src={imgSrc}
                        alt="hotel cover"
                        className="w-[400px] object-cover"
                    />
                </Link>


                <div className="flex-col space-y-4 py-4 col-span-2">
                    <p 
                        className="text-lg md:text-xl font-bold hover:underline cursor-pointer mt-2"
                        onClick={() => handleNavigate(`/hotel-detailed-page?resultType=${payload.resultType}&hotelId=${hotel?.hotelBasicInfo?.hotelId || payload.hotelId}&city=${payload.city}&cityName=${payload.cityName}&hotelName=${hotel?.hotelBasicInfo?.hotelName || payload.hotelName}&searchValue=${searchParams.get("searchValue")}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&preHotelIds=${payload.preHotelIds}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`)}
                    >
                        {hotelName}
                    </p>

                    {/* Star rating */}
                    <div class="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div>
                                <svg className="w-4 h-4 md:w-5 md:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="#FFA732" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
                            </div>
                            <div className="border border-[#CDEAE1] px-1 md:px-2 bg-[#CDEAE1]">
                                <p className="font-bold text-sm md:text-md">{starRating}<span className="text-sm md:text-md font-light">/5</span></p>
                            </div>
                        </div>
                        {/* No rating */}
                    </div>

                    {/* district, city */}
                    <div className="flex items-center">
                        <div className="pr-1">
                            <svg
                                className="w-[15px] h-[15px]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"
                            >
                                <path
                                    d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z"
                                />
                            </svg>
                        </div>
                        <div className="font-light text-sm md:text-md">
                            <span className="font-bold text-[#FF8682] text-sm md:text-md">{city}</span> - {district}
                        </div>
                    </div>

                    {/* price tracking among three websites */}
                    <div>
                        
                        { !(isSuccess) ? (
                            <div>
                                <div className=" flex items-center pr-6 my-2">
                                <div className="border-[#DDDDDD] bg-[#DDDDDD] rounded-md flex items-center space-y-1  w-full">
                                    <div className="mx-auto border-[#F3F3F3] bg-[#F3F3F3] h-[34px]"></div>
                                    <div className="mx-auto">
                                        <div className="border-[#F3F3F3] bg-[#F3F3F3]"></div>
                                    </div>
                                </div>
                                </div>

                                <div className=" flex items-center pr-6 my-2">
                                    {/* Placeholder for the rest of the div content */}
                                    <div className="border-[#DDDDDD] bg-[#DDDDDD] rounded-md flex items-center space-y-1  w-full">
                                        <div className="mx-auto border-[#F3F3F3] bg-[#F3F3F3] h-[34px]"></div>
                                        <div className="mx-auto">
                                            <div className="border-[#F3F3F3] bg-[#F3F3F3]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className=" flex items-center pr-6 my-2">
                                    {/* Placeholder for the rest of the div content */}
                                    <div className="border-[#DDDDDD] bg-[#DDDDDD] rounded-md flex items-center space-y-1  w-full">
                                        <div className="mx-auto border-[#F3F3F3] bg-[#F3F3F3] h-[34px]"></div>
                                        <div className="mx-auto">
                                            <div className="border-[#F3F3F3] bg-[#F3F3F3]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {hearts.map((heart, index) => {
                                    return(
                                        <div
                                        key={index}
                                        className="flex items-center pr-4 md:pr-6 my-2"
                                        onClick={() => window.open(heart.link, '_blank')}
                                        >
                                            <div className="border border-transparent bg-[#CDEAE1] hover:bg-[#8DD3BB] rounded-md flex items-center space-y-1 w-full">
                                                <div className="mx-auto">
                                                    <img
                                                        src={heart.imgLogo}
                                                        alt="website logo"
                                                        className="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                                    />
                                                </div>
                                                <div className="mx-auto">
                                                    <p className="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                                        {(heart.price !== null) ?  heart.price : "-"} VND
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}


