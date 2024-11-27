import { IconSwimming, IconGlassChampagne, IconHomeBolt, IconHorseToy, IconToolsKitchen2, IconMassage, IconBarbell, IconDoor, IconPool, IconDesk } from '@tabler/icons-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";
import { useState, useEffect } from "react";

export default function DetailedPageHotelInformation({ nearByHotels, hotelInfo, hotelComments, specificHotel, specificHotelPriceComparison, payload, isFetchingHotelComments, isFetchingNearByHotels }) {
    return (
        <>
            
            {hotelInfo ? 
                <div className="border-transparent bg-white border-2 p-4 rounded-lg space-y-2 shadow-md">
                    <div className="flex flex-col space-y-2 lg:flex-row md:items-center lg:space-x-4 mb-2">
                        <p className="font-extrabold text-2xl">{hotelInfo?.hotelInfo?.name}</p>

                        <div class="flex flex-row items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <div>
                                    <svg className="w-4 h-4 md:w-5 md:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path fill="#FFA732" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" /></svg>
                                </div>
                                <div className="border border-[#CDEAE1] px-1 md:px-2 bg-[#CDEAE1]">
                                    <p className="font-bold text-sm md:text-md">{hotelInfo?.hotelInfo?.aggregateRating?.ratingValue}<span className="text-sm md:text-md font-light">/5</span></p>
                                </div>
                            </div>
                            <p className="font-bold text-sm md:text-md">{hotelInfo?.hotelReviewComment}</p>
                            <p>{hotelInfo?.hotelInfo?.aggregateRating?.reviewCount} reviews</p>
                        </div>
                    </div>

                    {/* Hotel location */}
                    <div className="flex items-center mb-2">
                        <div className="pr-1">
                            <svg
                                className="w-[15px] h-[15px]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"

                            >
                                <path fill="red"
                                    d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z"
                                />
                            </svg>
                        </div>
                        <div className="font-light text-sm md:text-md">
                            <span className="font-medium text-gray-500 text-sm md:text-lg">{hotelInfo?.hotelInfo?.address?.streetAddress}</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <div className="pr-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-[15px] h-[15px]">
                                    <path fill="red" d="M560 64c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H16C7.2 0 0 7.2 0 16v32c0 8.8 7.2 16 16 16h16v384H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h240v-80c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v80h240c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-16V64h16zm-304 44.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm0 96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zm-128-96c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4zM179.2 256h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4c0 6.4-6.4 12.8-12.8 12.8zM192 384c0-53 43-96 96-96s96 43 96 96H192zm256-140.8c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-96c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4z" />
                                </svg>
                            </div>
                            <p className="font-bold text-black text-sm md:text-lg">About Accommodation</p>
                        </div>
                        <p>{hotelInfo?.hotelDescription}</p>
                    </div>
                </div>
            : <PriceComparisonSkeleton/>
            }
            <div className="my-6">
                {(specificHotelPriceComparison.isLoading || !specificHotelPriceComparison.data)
                ? <PriceComparisonSkeleton/>
                : <HotelPriceComparison specificHotel={specificHotel} specificHotelPriceComparison={specificHotelPriceComparison} payload={payload} />
                }
            </div>
            <div className="my-6">
                <HotelRelatedInformation />
            </div>
            <div className="my-6">
                {(!hotelInfo || isFetchingHotelComments || !hotelComments)  
                ? <ReviewsSkeleton/>
                : hotelComments ? <Reviews hotelComments={hotelComments} hotelInfo={hotelInfo} /> : null
                }
            </div>
            <div className="my-6">
                {(!hotelInfo || isFetchingNearByHotels || !nearByHotels)
                 ? <NearbyHotelSkeleton/>
                 : <NearbyHotel nearByHotels={nearByHotels} payload={payload} />
                }
            </div>
        </>
    )
}

function HotelPriceComparison({ specificHotel, specificHotelPriceComparison, payload }) {
    const daysBetween = (checkin, checkout) => (new Date(checkout.slice(0, 4), checkout.slice(4, 6) - 1, checkout.slice(6)) - new Date(checkin.slice(0, 4), checkin.slice(4, 6) - 1, checkin.slice(6))) / (1000 * 60 * 60 * 24);
    const formatDate = dateStr => dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    const priceData = specificHotelPriceComparison?.isSuccess ? specificHotelPriceComparison?.data?.[0] : null;
    const agodaPrice = priceData?.agodaPrice?.price ? Math.round(priceData.agodaPrice?.price?.[0]?.price?.perRoomPerNight?.exclusive?.display).toLocaleString("vi-VN") : null;
    const bookingPrice = priceData?.bookingPrice ? Math.round(priceData.bookingPrice?.price?.reduce((acc, curr) => acc + Number(curr.finalPrice.amount), 0) / (Number(payload.adult) * Number(daysBetween(payload.checkin, payload.checkout)))).toLocaleString("vi-VN") : null;
    const bookingURL = `https://www.booking.com/hotel/vn/${priceData?.bookingPrice?.pageName}.vi.html?checkin=${formatDate(payload.checkin)};checkout=${formatDate(payload.checkout)};dest_id=${specificHotelPriceComparison.data?.[0]?.booking?.matchHotel?.dest_id};dest_type=${specificHotelPriceComparison.data?.[0]?.booking?.matchHotel?.dest_type};group_adults=${payload.adult};group_children=${payload.children};no_rooms=${payload.crn}`
    const agodaURL = `https://www.agoda.com/vi-vn${priceData?.agodaPrice?.pageName}?finalPriceView=1&isShowMobileAppPrice=false&numberOfBedrooms=&familyMode=false&adults=${payload.adult}&children=${payload.children}&rooms=${payload.crn}&maxRooms=0&checkIn=${formatDate(payload.checkin)}&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=VND&los=${daysBetween(payload.checkin, payload.checkout)}`

    const website = [
        { imgSrc: "https://ik.imagekit.io/Uptrip/booking.com?updatedAt=1712829810252", price: `${bookingPrice} VND`, linkTo: bookingURL },
        {
            imgSrc: "https://ik.imagekit.io/Uptrip/trip.com?updatedAt=1712830814655",
            price: `${specificHotel?.matchHotel?.price?.toLocaleString("vi-VN")} VND`,
            linkTo: `https://us.trip.com/hotels/detail/?cityId=${payload.city}&hotelId=${payload.hotelId}&checkIn=${formatDate(payload.checkin)}&checkOut=${formatDate(payload.checkout)}&adult=${payload.adult}&children=0&subStamp=1479&crn=1&ages=&travelpurpose=0&curr=VND&detailFilters=17%7C1~17~1*80%7C0%7C1~80~0&hotelType=normal&barcurr=VND&locale=en-US`
        },
        { imgSrc: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png", price: `${agodaPrice} VND`, linkTo: agodaURL },
    ]

    return (
        <>
            {website.map((item, index) => (
                <div className="bg-[#CDEAE1] border-transparent grid grid-cols-3 rounded-lg my-2 shadow-md px-2 lg:px-10">

                    <div className="my-auto md:pl-5">
                        <img src={item.imgSrc} alt="website logo" className="w-[90px] h-[45px] md:w-[120px] md:h-[60px] object-cover" />
                    </div>

                    <div className="col-span-2">
                        <div className="grid grid-cols-2">
                            <div className="font-bold text-xs md:text-xl text-[#222160] my-auto">{item.price}</div>

                            <button onClick={() => window.open(item.linkTo, '_blank')}
                                className=" mr-2 md:mr-4  btn btn-accent hover:text-white my-2 bg-white bg-opacity-70 text-black shadow-sm cursor-pointer flex items-center rounded-lg">
                                <span className="mx-auto md:py-2 text-sm ">Book Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

function HotelRelatedInformation() {
    const amenities = [
        { IconComponent: IconSwimming, text: 'Outdoor Swimming Pool' },
        { IconComponent: IconGlassChampagne, text: 'Bar' },
        { IconComponent: IconHorseToy, text: "Kid's Club" },
        { IconComponent: IconHomeBolt, text: 'Sauna' },
        { IconComponent: IconToolsKitchen2, text: 'Restaurant' },
        { IconComponent: IconDesk, text: '24-Hour Front Desk' },
        { IconComponent: IconMassage, text: 'Spa' },
        { IconComponent: IconBarbell, text: 'Fitness Room' },
        { IconComponent: IconDoor, text: 'Meeting Room' },
        { IconComponent: IconPool, text: "Children's Pool" },
    ];

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-8">

                <div className="border-transparent border-2">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3731.862860055853!2d107.0471119759641!3d20.715792798452966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a45841b71f5e1%3A0x52df34f512ccce2f!2sH%C3%B4tel%20Perle%20d&#39;Orient%20Cat%20Ba%20-%20MGallery!5e0!3m2!1sen!2s!4v1714836200569!5m2!1sen!2s"
                        className="w-full h-[300px]  rounded-lg" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Cat Ba Hotel" />
                </div>

                <div className="border-transparent shadow-sm bg-white border-2 rounded-lg py-4 px-6">
                    <div className="pb-6 font-bold text-xl">Most Popular Amenities</div>
                    <div className="grid grid-cols-2 gap-4">
                        {amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center">
                                <amenity.IconComponent stroke={2} size={28} color="#9A9A9A" />
                                <p className="ml-2 font-semibold text-xs line-clamp-1 md:text-md xl:text-lg text-gray-900">{amenity.text}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}

function Reviews({ hotelComments, hotelInfo }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="border-transparent bg-white shadow-md border-2 p-4 rounded-lg">
                {/* Tittle */}
                <div className="text-xl font-bold mb-4">Guest Reviews <span className="font-light text-sm ml-1">({hotelInfo?.hotelInfo?.aggregateRating?.reviewCount})</span></div>

                {/* Rating points */}
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div>
                        {/* Total rating points of a hotel */}
                        <div className="flex items-center my-auto">
                            <div className="border-[#8DD3BB] bg-[#8DD3BB] rounded-full w-1/4 py-1 px-2 flex items-end justify-center">
                                <span className="text-3xl font-extrabold text-white ">{hotelInfo?.hotelInfo?.aggregateRating?.ratingValue}</span>
                                <span className="text-xl font-semibold text-[#CDEAE1]">/5</span>
                            </div>

                            <div className="text-2xl ml-2 font-bold">{hotelInfo?.hotelReviewComment}</div>
                        </div>
                    </div>

                    {/* Rating bar section */}
                    <div className="col-span-2">
                        <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10">
                            {hotelInfo && Object.keys(hotelInfo?.ratingsMap).map((key, index) => (
                                <div className="mt-6 lg:mt-0  ">
                                    <div className="w-[350px] md:w-[400px] flex items-center justify-between">
                                        <div className="font-semibold text-md">{key}</div>
                                        <div className="font-bold text-md text-[#222160]">{hotelInfo?.ratingsMap?.[key]}</div>
                                    </div>

                                    <div className="relative mt-2 h-4">
                                        <div className="absolute border-4 border-gray-200 w-[350px] md:w-[400px] rounded-xl"></div>
                                        <div className="absolute z-1 top-0 w-[350px] md:w-[400px] rounded-xl border-4 border-[#8DD3BB]" style={{
                                            width: `${hotelInfo?.ratingsMap?.[key] * (windowWidth < 768 ? 350 : 400) / 5}px`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rating comment */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                    {hotelComments?.map((comment, index) => (
                        <div>
                            {/* users information */}
                            <div className="flex items-center ">
                                {/* avatar */}
                                <div class="avatar">
                                    <div class="w-12 h-12 rounded-full">
                                        <img src={comment?.userInfo?.headPictureUrl} alt="ava" />
                                    </div>
                                </div>

                                {/* users information */}
                                <div className="mx-6 flex flex-col">
                                    <div className="font-bold text-lg">{comment?.userInfo?.nickName}</div>
                                    <div className="font-light text-md text-gray-500">{comment?.createDate?.split(" ")[0]}</div>
                                </div>
                            </div>

                            {/* comment section */}
                            <div className="mt-4 text-md font-medium text-[#9A9A9A] line-clamp-4">{comment?.content}</div>
                        </div> 
                     ))}
                </div>
            </div>
        </>
    )
}


function NearbyHotel({ nearByHotels, payload }) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: false,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    dots: false,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="border-transparent bg-white shadow-md border-2 p-4 rounded-lg">
            {/* Tittle */}
            <div className="text-xl font-bold mb-4">You may also like</div>

            <div className="slider-container pb-4">
                <Slider {...settings}>
                    {nearByHotels?.nearByHotels?.map((hotel) => {
                        return (
                            <div>
                                {/* nearby hotel card */}
                                <div
                                    onClick={() => window.open(`/hotel-detailed-page?resultType=H&hotelId=${hotel.base.hotelId}&city=${payload.city}&cityName=${payload.cityName}&hotelName=${hotel.base.hotelName}&searchValue=${payload.searchValue}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${hotel.position.lat}&longitude=${hotel.position.lng}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&preHotelIds=${payload.preHotelIds}&listFilters=${payload.listFilters}&domestic=${payload.domestic}`)}
                                    className="bg-white border-2 border-gray-100 space-y-4 shadow-md scale-95">

                                    <div>
                                        <img src={hotel.base.imageUrl} alt="hotel" className="w-full h-[165px] object-cover" />
                                    </div>

                                    {/* hotel information */}
                                    <div className="px-4 space-y-2">

                                        <div className="font-bold text-sm md:text-lg
                                        line-clamp-1">{hotel.base.hotelName}</div>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-1">
                                            <div>
                                                <svg
                                                    className="w-4 h-4 md:w-5 md:h-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 576 512"
                                                >
                                                    <path
                                                        fill="#FFA732"
                                                        d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="border border-[#CDEAE1] px-1 md:px-2 bg-[#CDEAE1]">
                                                <p className="font-bold text-sm md:text-md">
                                                    {hotel.comment.score}
                                                    <span className="text-sm md:text-md font-light">
                                                        /5
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="ml-2 text-sm font-light">{hotel.comment.totalReviews} reviews</p>
                                        </div>

                                        <div className="flex items-center">

                                            <div className="pr-1">
                                                <svg
                                                    className="w-[15px] h-[15px]"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 384 512"
                                                >
                                                    <path
                                                        fill="gray"
                                                        d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z"
                                                    />
                                                </svg>
                                            </div>
                                            
                                            <div className="font-light text-sm md:text-md">
                                                <span className="font-semibold text-sm md:text-md">{hotel.position.positionDesc.split("|")[0]}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-sm">{hotel.position.positionDesc.split("|")[1]}</div>
                                        

                                        {/* price */}
                                        <div className="flex flex-col justify-end items-end">
                                            <div className="flex items-end">
                                                {hotel.money.crossLinePrice && <div className="text-2xs line-through mr-1">{hotel.money.crossLinePrice.toLocaleString("vi-VN")} VND</div>}
                                                <div className="text-sm font-bold text-red-500">{Number(hotel.money.price).toLocaleString("vi-VN")} VND</div>
                                            </div>

                                            <div className="text-xs my-1">{hotel.money.priceNote}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Slider>
            </div>
        </div>
    );
}

function ReviewsSkeleton() {
    return <>
        <div className="card card-compact w-94 md:w-auto bg-white shadow-xl rounded-md">
                <figure className="skeleton w-94 h-72 rounded-t-md rounded-b-none"></figure>
        </div>
    </>;
}

function NearbyHotelSkeleton() {
    return <>
        <div className="card card-compact w-94 md:w-auto bg-white shadow-xl rounded-md">
                <figure className="skeleton w-94 h-72 rounded-t-md rounded-b-none"></figure>
        </div>
    </>;
}

function PriceComparisonSkeleton() {
    return <>
        <div className="card card-compact w-94 md:w-auto bg-white shadow-xl rounded-md">
                <figure className="skeleton w-94 h-72 rounded-t-md rounded-b-none"></figure>
        </div>
    </>;
}

