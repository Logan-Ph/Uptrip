import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SavedCollectionCard } from "./CollectionCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    addExperienceItinerary,
    addHotelItinerary,
    addFlightItinerary,
    deleteHotelFromItinerary,
    deleteFlightItinerary,
    deleteItinerary,
    fetchCollections,
    fetchHotelPriceComparison,
    fetchSpecificHotel,
    fetchFlightAdvancedSearch,
    fetchBayDepFlight,
    fetchTripComFlight,
    fetchMyTripFlight,
    deleteExperienceFromItinerary
} from "../api/fetch";
import successNotify from "../utils/successNotify";
import warningNotify from "../utils/warningNotify";

// Itinerary card for the itinerary page. list the itinerary info card
export function ItineraryCard({ itinerary, getItinerary }) {
    const modalId = `delete_itinerary_card_modal_${itinerary._id}`
    const convertDate = (date) => `${date.substring(6, 8)}-${date.substring(4, 6)}-${date.substring(0, 4)}`
    const handleDeleteItinerary = useMutation({
        mutationFn: () => deleteItinerary({ itineraryId: itinerary._id }),
        onSuccess: (data) => {
            successNotify(data.data)
            document
                .getElementById(modalId)
                .close()
            getItinerary.refetch()
        },
        onError: (error) => {
            warningNotify(error.response.data);
        }
    })

    const handleDelete = (e) => {
        e.preventDefault()
        handleDeleteItinerary.mutate()
    }

    return (
        <>
            <div class="card flex-col md:flex-row card-side rounded-md bg-white shadow-xl my-4">
                <Link>
                    <figure class="rounded-t-md md:rounded-tr-none md:rounded-l-md h-full">
                        <img
                            src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/228033379.jpg?k=5559966043302855e467dfa2c28ad78034f95b8ffaec437ca19004ba936c7b49&o=&hp=1"
                            alt="Itinerary Cover Pic"
                            className="w-full h-[150px] md:w-[380px] md:h-full object-cover"
                        />
                    </figure>
                </Link>

                <div class="card-body flex-1 px-5 p-7">
                    <Link to={`/detailed-itinerary?itineraryId=${itinerary._id}`}>
                        <h2 class="card-title text-base md:text-2xl hover:underline underline-offset-4">
                            {itinerary.name}
                        </h2>
                    </Link>
                    <div>
                        <p class="text-gray-500 text-sm md:text-lg mt-1 md:mt-4 mb-2">
                            {itinerary.startDate ?
                                (<span>
                                    <i class="fa-regular fa-calendar"></i>&ensp; {convertDate(itinerary.startDate)}{" "}
                                    <i class="fa-solid fa-arrow-right"></i> {convertDate(itinerary.endDate)}
                                </span>)
                                : (
                                    <span>
                                        <i class="fa-regular fa-calendar"></i>&ensp; {itinerary.tripLength} day(s)
                                    </span>)
                            }
                        </p>
                        <p class="text-gray-500 text-sm md:text-lg">
                            <i class="fa-solid fa-location-dot"></i>
                            &ensp; {itinerary.destination}
                        </p>
                    </div>
                    <div class="card-actions md:justify-between flex-col md:flex-row md:items-end flex-1 mt-4 md:mt-0">
                        <button
                            className="btn bg-transparent border-[1.5px] text-red-400 hover:text-red-500"
                            onClick={() =>
                                document
                                    .getElementById(modalId)
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
                            </svg>
                        </button>

                        <dialog
                            id={modalId}
                            className="modal modal-bottom sm:modal-middle"
                        >
                            <div className="modal-box w-11/12 max-w-5xl px-10">
                                <h3 className="font-bold text-2xl mt-4">
                                    Delete itinerary?
                                </h3>
                                <p className="pt-4 text-lg">
                                    Are you sure you want to delete {itinerary.name}?
                                </p>
                                <div className="modal-action mt-3">
                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn rounded-3xl mx-2">
                                            Cancel
                                        </button>
                                        <button
                                            className="btn bg-black text-white rounded-3xl"
                                            onClick={(e) => handleDelete(e)}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
            </div>
        </>
    );
}

// add item button in detailed itinerary page
export function AddItemButton({refetchItinerary, isAddingExperience, date}) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("main");
    const [selectedCollection, setSelectedCollection] = useState()
    const [items, setItems] = useState()
    const [selectedItems, setSelectedItems] = useState()

    const handleNextButtonClickMain = () => {
        if (!selectedCollection) {
            warningNotify("Please select a collection")
            return
        }
        setCurrentPage("chooseSavedItem");
    };

    const handleNextButtonClickSaved = () => {
        if (!selectedItems) {
            warningNotify("Please select an item")
            return
        }
        setCurrentPage("otherPage");
    };

    const handleBackButtonClick = () => {
        if (currentPage === "chooseSavedItem") {
            setCurrentPage("main");
        } else {
            setSelectedItems(null)
            setCurrentPage("chooseSavedItem");
        }
    };

    return (
        <>
            {/* Button */}
            <div className="flex justify-center my-4">
                <div
                    className="btn bg-[#9A9A9A] rounded-3xl text-white"
                    onClick={() => setIsOpen(true)}
                >
                    Add Items
                </div>
            </div>

            {isOpen && <div className="relative">
                {/* Drawer */}
                <div
                    className={`fixed top-0 right-0 h-full w-11/12 sm:w-1/2 lg:w-4/12   bg-white shadow-lg transition-all duration-300 ease-in-out z-50 px-2 md:px-6 ${isOpen ? "translate-x-0" : "translate-x-full"
                        } overflow-y-auto`}
                >
                    <div className="p-4 relative">
                        { currentPage === "main" ? (
                            <ChooseCollection
                                handleNextButtonClick={handleNextButtonClickMain}
                                setSelectedCollection={setSelectedCollection}
                                selectedCollection={selectedCollection}
                                setItems={setItems}
                            />
                        ) : currentPage === "chooseSavedItem" ? (
                            <ChooseSavedItem
                                handleNextButtonClick={handleNextButtonClickSaved}
                                handleBackButtonClick={handleBackButtonClick}
                                items={items}
                                setSelectedItems={setSelectedItems}
                                selectedItems={selectedItems}
                                isAddingExperience={isAddingExperience}

                            />
                        ) : (
                            <OtherPageContent
                                handleBackButtonClick={handleBackButtonClick}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                refetchItinerary={refetchItinerary}
                                date={date}
                            />
                        )}
                    </div>
                </div>

                {/* Overlay to close the drawer */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed top-0 left-0 h-full w-full bg-gray-800 opacity-50 transition-opacity duration-300 ease-in-out z-10"
                    ></div>
                </div>
            }
        </>
    );
}

// page 1 in the drawer, choose collection
function ChooseCollection({ handleNextButtonClick, setSelectedCollection, setItems, selectedCollection }) {
    const {
        data: collections,
    } = useQuery({
        queryKey: ["fetch-collections"],
        queryFn: () => fetchCollections(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    return (
        <>
            <div className="bg-white py-8 mt-10 sticky top-0 z-50 border-b">

                <h1 className="text-2xl text-center font-semibold mb-2">
                    Choose a collection
                </h1>
                <p className="text-gray-500 text-center">
                    Select the collection to pick the items from.
                </p>
            </div>
            <div className="my-4">
                {/* If no collection */}
                {collections?.length > 0
                    ?
                    collections.map((collection) => (
                        <div onClick={() => {
                            setSelectedCollection(prevSelected => {
                                // Update the items only if the collection changes
                                if (prevSelected?._id !== collection._id) {
                                    setItems({
                                        experience: collection.experience,
                                        hotel: collection.hotels,
                                        flight: collection.flights
                                    });
                                }
                                return { id: collection._id, collection: collection };
                            });
                        }}>
                            <SavedCollectionCard key={collection.id} collection={collection} isCollectionSelected={selectedCollection?.id === collection._id} />
                        </div>
                    ))
                    :
                    <div className="text-lg my-10">
                        <p className="font-thin text-xl">Your collection is empty.</p>
                        {/* Direct to the favorite collection page */}
                        <div href="" className="font-semibold underline">Let's create one!</div>
                    </div>
                }
            </div>
            {/* If no collection, hidden */}
            <div className="sticky bottom-[-10px] bg-white w-full py-6 flex justify-end border-t">
                <div
                    className="btn btn-outline bg-black text-white hover:bg-gray-900 rounded-full"
                    onClick={handleNextButtonClick}
                >
                    Next
                </div>
            </div>
        </>
    );
}

// page 2 in the drawer, choose item
function ChooseSavedItem({ handleNextButtonClick, handleBackButtonClick, items, setSelectedItems, selectedItems, isAddingExperience }) {
    return (
        <>
            <div className="bg-white py-6 sticky mt-10 top-0 z-50">
                {items.experience.length === 0 && items.hotel.length === 0 && items.flight.length === 0 ? (
                    <>
                        <h1 className="text-2xl text-center font-semibold mb-2">
                            No item found
                        </h1>
                    </>
                )
                : items.experience.length === 0 && isAddingExperience
                ?
                    <>
                        <h1 className="text-2xl text-center font-semibold mb-2">
                            No experience card found
                        </h1>
                    </>
                :
                    <>
                        <h1 className="text-2xl text-center font-semibold mb-2">
                            Add to your itinerary
                        </h1>
                    </>
                }
                <button
                    onClick={handleBackButtonClick}
                    className="mt-4 absolute top-0 left-[-30px] p-3 ml-4"
                >
                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                </button>
            </div>
            <div className="my-4">
                {isAddingExperience 
                    ? (
                        items.experience.map(item => <SavedExperienceCard key={item.id} item={item} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />)
                    )
                    :
                    (Object.keys(items).map(item => {
                        switch (item) {
                            case "hotel":
                                return items[item].map(item => <SavedStayCard key={item.id} item={item} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />)
                            case "flight":
                                return items[item].map(item => <SavedFlightCard key={item.id} item={item} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />)
                            default:
                                return null
                        }
                    }))
                }
            </div>
            {
                !(items.experience.length === 0 && items.hotel.length === 0 && items.flight.length === 0) &&
                (
                    <>
                        <div className="sticky bottom-[-10px] bg-white w-full py-6 flex justify-end border-t">
                            <div
                                className="btn btn-outline bg-black text-white hover:bg-gray-900 rounded-full"
                                onClick={handleNextButtonClick}
                            >
                                Next
                            </div>
                        </div>
                    </>
                )
            }

        </>
    );
}

// page 3 in the drawer, input details of the item
function OtherPageContent({ handleBackButtonClick, selectedItems, setSelectedItems, refetchItinerary, date }) {
    const [searchParams] = useSearchParams()

    const addHotel = useMutation({
        mutationFn: (item) => addHotelItinerary({ item: item, itineraryId: searchParams.get('itineraryId') }),
        retry: 0,
        onSuccess: () => {
            successNotify("Add to itinerary successfully")
            refetchItinerary()
        },
        onError: (e) => {
            console.log(e)
            warningNotify(e.response.data)
        }
    })

    const addFlight = useMutation({
        mutationFn: (item) => addFlightItinerary({itineraryId: searchParams.get('itineraryId'), flight: item }),
        retry:0,
        onSuccess: () => {
            successNotify("Add to itinerary successfully")
            refetchItinerary()
        }
    })

    const addExperience = useMutation({
        mutationFn: (item) => addExperienceItinerary({item: item.item, itineraryId: searchParams.get('itineraryId'), startDate: item.date, startTime: item.startTime, endTime: item.endTime, description: item.description}),
        retry: 0,
        onSuccess: () => {
            successNotify("Add to itinerary successfully")
            refetchItinerary()
        }
    })

    const handleAddToItinerary = (e) => {
        e.preventDefault()
        Object.keys(selectedItems).forEach(item => {
            if (selectedItems[item].type === "stay") {
                if (!selectedItems[item].tripPrice && !selectedItems[item].agodaPrice && !selectedItems[item].bookingPrice) {
                    warningNotify("Please select price")
                    return
                }
                addHotel.mutate(selectedItems[item])
            }
            
            if (selectedItems[item].type === "experience") {
                addExperience.mutate(selectedItems[item])
            }

            if (selectedItems[item].type === "flight") {
                if (!selectedItems[item].price) {
                    warningNotify("Please select price")
                    return
                }
                addFlight.mutate(selectedItems[item])
            }
        })
    }



    return (
        <>
            <div className="bg-white py-6 mt-10 sticky top-0 z-50 border-b">
                <h1 className="text-2xl text-center font-semibold mb-2">
                    Add to your itinerary
                </h1>
                <button
                    onClick={handleBackButtonClick}
                    className="mt-4 absolute top-0 left-[-30px] p-3 ml-4"
                >
                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                </button>
            </div>
            {/* For Stay */}
            {Object.keys(selectedItems).map(item => {
                switch (selectedItems[item].type) {
                    case 'stay':
                        return <ForDetailStay setSelectedItems={setSelectedItems} key={item.id} item={selectedItems[item].item} />
                    case "experience":
                        return <ForDetailExperience setSelectedItems={setSelectedItems} key={item.id} item={selectedItems[item].item} date={date}/>
                    case "flight":
                        return <ForDetailFlight setSelectedItems={setSelectedItems} key={item.id} item={selectedItems[item].item} />
                    default:
                        return null
                }
            })}


            {/* Add to itinerary button */}
            <div
                className="sticky bottom-[-10px] bg-white w-full py-6 flex justify-end border-t z-30"
                onClick={handleAddToItinerary}
            >
                {/* Add any other content or buttons */}
                <div className="btn btn-outline bg-black text-white hover:bg-gray-900 rounded-full">
                    Add to itinerary
                </div>
            </div>
        </>
    );
}

function ForDetailStay({ item, setSelectedItems }) {
    const [isOpen, setIsOpen] = useState(false)
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [childrenAges, setChildrenAges] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [agodaPrice, setAgodaPrice] = useState(false)
    const [bookingPrice, setBookingPrice] = useState(false)
    const [priceType, setPriceType] = useState("")

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

    const formattedDate = (date) => date.replace(/-/g, '');

    const hotel = useMutation({
        mutationFn: () => fetchSpecificHotel({
            resultType: "H",
            hotelId: item.hotelId,
            city: item.city,
            cityName: item.cityName,
            hotelName: item.hotelName,
            searchValue: item.searchValue,
            provinceId: item.provinceId,
            countryId: item.countryId,
            districtId: item.districtId,
            checkin: formattedDate(startDate),
            checkout: formattedDate(endDate),
            barCurr: "VND",
            cityType: "OVERSEA",
            latitude: item.latitude,
            longitude: item.longitude,
            searchCoordinate: item.searchCoordinate,
            crn: numberOfRooms,
            adult: numberOfAdults,
            children: numberOfChildren,
            domestic: true,
            preHotelIds: [item.hotelId],
            listFilters: `17~1*17*1*2`,
        }),
        retry: false,
        refetchOnWindowFocus: false,
    });

    const getSpecificHotelPriceComparison = useMutation({
        mutationFn: () => fetchHotelPriceComparison(
            {
                resultType: "H",
                hotelId: item.hotelId,
                city: item.city,
                cityName: item.cityName,
                hotelName: item.hotelName,
                searchValue: item.searchValue,
                provinceId: item.provinceId,
                countryId: item.countryId,
                districtId: item.districtId,
                checkin: formattedDate(startDate),
                checkout: formattedDate(endDate),
                barCurr: "VND",
                cityType: "OVERSEA",
                latitude: item.latitude,
                longitude: item.longitude,
                searchCoordinate: item.searchCoordinate,
                crn: numberOfRooms,
                adult: numberOfAdults,
                children: numberOfChildren,
                domestic: true,
                preHotelIds: [item.hotelId],
                listFilters: `17~1*17*1*2`,
                hotelNames: [item.hotelName]
            }),
        onSuccess: (data) => {
            const priceData = data[0]
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
                    ) /
                    (Number(numberOfAdults) *
                        Number(
                            daysBetween(
                                formattedDate(startDate),
                                formattedDate(endDate)
                            )
                        ))
                ).toLocaleString("vi-VN")
                : null;
            setAgodaPrice(agodaPrice)
            setBookingPrice(bookingPrice)
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const handleSearch = (e) => {
        e.preventDefault()
        if (!startDate || !endDate) {
            warningNotify("Please select date")
            return
        }
        hotel.mutate()
        getSpecificHotelPriceComparison.mutate()
    }

    return (
        <>
            <div className="my-4">
                <SavedStayCard item={item} setSelectedItems={false} />
                {/* Ask Date */}
                <div className="text-start font-semibold text-lg">Date</div>

                {/* Datepicker */}
                <div className="grid grid-cols-2 my-2 sm:gap-x-2">

                    <div className="relative h-[60px]">

                        <div className="flex items-center">
                            <div className="custom-datepicker-toggle w-full">
                                <span className="custom-datepicker-toggle-button">
                                    <i className="fa-regular fa-calendar"></i>
                                </span>
                                <input
                                    id="check-in"
                                    type="date"
                                    className="custom-datepicker-input px-5 pb-2.5 pt-5 rounded-lg border-gray-300 sm:w-[150px] xl:w-[185px] 2xl:w-[250px] focus:ring-black focus:border-black block "
                                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                                    max={endDate || ''} // Set max date to endDate if it exists
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStartDate(newStartDate);
                                    }}
                                />
                            </div>
                        </div>


                        <div>
                            <label
                                for="check-in"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-[11px] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto px-4"
                            >
                                Check-in
                            </label>
                        </div>
                    </div>

                    <div className="relative h-[60px] mx-auto">
                        <div className="flex items-center ">
                            <span className="datepicker-toggle">
                                <span className="datepicker-toggle-button"></span>
                                <input
                                    id="check-out"
                                    type="date"
                                    className="datepicker-input px-5 pb-2.5 pt-5 rounded-lg sm:w-[150px] xl:w-[185px] 2xl:w-[250px] border-gray-300 focus:ring-black focus:border-black"
                                    min={startDate || new Date().toISOString().split('T')[0]} // Ensure end date is not before start date
                                    onChange={(e) => {
                                        const newEndDate = e.target.value;
                                        if (newEndDate < startDate) {
                                            setStartDate(newEndDate);
                                        }
                                        setEndDate(newEndDate);
                                    }}
                                />
                            </span>
                        </div>
                        <div>
                            <label
                                for="check-out"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-[11px] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto px-4"
                            >
                                Check-out
                            </label>
                        </div>
                    </div>
                </div>
                {/*  */}

                {/* Ask Guest and Room */}
                <div className="text-start font-semibold text-lg">
                    Room information
                </div>
                <div className="relative my-2">
                    <button
                        id="dropdownDividerButton"
                        data-dropdown-toggle="dropdownDivider"
                        class="text-gray-500 bg-white focus:ring-1 focus:ring-black focus:border-black font-medium rounded-lg border border-gray-300 text-sm px-5 py-2.5 text-center inline-flex items-center h-[52px] relative p-2.5 mr-5 pt-5 ps-10 w-full justify-between"
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
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
                        {numberOfAdults} adult, {numberOfChildren} child, {numberOfRooms} room{" "}
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
                        className={`z-40 bg-white divide-y divide-gray-100 rounded-b-lg shadow absolute mt-[1.5px] w-full ${isOpen ? "block" : "hidden"}`}
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
                                        <span class="text-lg">{numberOfRooms}</span>
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
                                        <span class="text-lg">{numberOfAdults}</span>

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
                                    <div className="text-start">
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
                                        <span class="text-lg"> {numberOfChildren} </span>

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
                            <div
                                to="#"
                                class="block px-4 pb-2 text-[12px] text-gray-500 w-full"
                            >
                                Please enter your children's ages by the time of
                                check-in
                            </div>
                            <div class="overflow-y-scroll flex flex-wrap items-start px-5 mx-auto justify-between md:justify-normal w-full md:max-h-[150px]">
                                {Array.from(
                                    { length: numberOfChildren },
                                    (_, index) => {
                                        return (
                                            <form class="w-24 md:w-16 mb-3 md:mr-4">
                                                <label
                                                    for="number-input"
                                                    class="block mb-2 text-xs text-start font-medium text-gray-900"
                                                >
                                                    Child {index + 1}
                                                </label>
                                                <input
                                                    type="number"
                                                    id="number-input"
                                                    aria-describedby="helper-text-explanation"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    placeholder="Age"
                                                    required
                                                    onChange={(e) => {
                                                        setChildrenAges(
                                                            (prev) => {
                                                                const temp =
                                                                    [...prev];
                                                                temp[index] = e.target.value;
                                                                return temp;
                                                            }
                                                        );
                                                    }}
                                                />
                                            </form>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Search for price*/}
                <div
                    className="flex justify-center"
                    onClick={(e) => handleSearch(e)}
                >
                    <div
                        className="btn btn-sm text-center rounded-full text-sm text-gray-800"
                    >
                        Search
                    </div>
                </div>
                {/* Price */}
                <div className="my-10 ">
                    {/* Loading price */}
                    {
                        (getSpecificHotelPriceComparison.isPending || getSpecificHotelPriceComparison.isPending) ?
                            (
                                <div className="flex justify-center my-10">
                                    <span className="loading loading-dots loading-md"></span>
                                </div>
                            )
                            :
                            (getSpecificHotelPriceComparison.isSuccess && getSpecificHotelPriceComparison.isSuccess)
                                ?
                                (
                                    <>
                                        <div
                                            class={`border border-transparent rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer ${priceType === "trip" ? "bg-[#8DD3BB]" : "bg-[#CDEAE1]"} `}
                                            onClick={() => {
                                                setPriceType("trip");
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        checkin: formattedDate(startDate),
                                                        checkout: formattedDate(endDate),
                                                        tripPrice: Math.round(hotel?.data?.matchHotel?.price)?.toLocaleString("vi-VN") || "-",
                                                        agodaPrice: null,
                                                        bookingPrice: null
                                                    }
                                                }));
                                            }}
                                        >
                                            <div class="mx-auto">
                                                <img
                                                    src="https://ik.imagekit.io/Uptrip/trip.com?updatedAt=1712830814655"
                                                    alt="website logo"
                                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                                />
                                            </div>
                                            <div
                                                class="mx-auto"
                                            >
                                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                                    {Math.round(hotel?.data?.matchHotel?.price)?.toLocaleString("vi-VN") === '0' ? "-" : Math.round(hotel?.data?.matchHotel?.price)?.toLocaleString("vi-VN")} VND
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            class={`border border-transparent rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer ${priceType === "booking" ? "bg-[#8DD3BB]" : " bg-[#CDEAE1]"} duration-300`}
                                            onClick={() => {
                                                setPriceType("booking")
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        checkin: formattedDate(startDate),
                                                        checkout: formattedDate(endDate),
                                                        bookingPrice: bookingPrice === '0' ? "-" : bookingPrice,
                                                        agodaPrice: null,
                                                        tripPrice: null
                                                    }
                                                }))
                                            }}
                                        >
                                            <div class="mx-auto">
                                                <img
                                                    src="https://ik.imagekit.io/Uptrip/booking.com?updatedAt=1712829810252"
                                                    alt="website logo"
                                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                                />
                                            </div>
                                            <div
                                                class="mx-auto"
                                            >
                                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                                    {bookingPrice === '0' ? "-" : bookingPrice} VND
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            class={`border border-transparent rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer ${priceType === "agoda" ? "bg-[#8DD3BB]" : "bg-[#CDEAE1]"} duration-300`}
                                            onClick={() => {
                                                setPriceType("agoda");
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        checkin: formattedDate(startDate),
                                                        checkout: formattedDate(endDate),
                                                        agodaPrice: agodaPrice === '0' ? "-" : agodaPrice,
                                                        tripPrice: null,
                                                        bookingPrice: null
                                                    }
                                                }))
                                            }}
                                        >
                                            <div class="mx-auto">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png"
                                                    alt="website logo"
                                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                                />
                                            </div>
                                            <div
                                                class="mx-auto"
                                            >
                                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                                    {agodaPrice || "-"} VND
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )
                                : null
                    }
                </div>
            </div>
        </>
    );
}

function ForDetailFlight({ item, setSelectedItems }) {
    const [adult, setAdult] = useState(1)
    const [child, setChild] = useState(0)
    const [infant, setInfant] = useState(0)
    const [dropdown, setDropdown] = useState(false)
    const [selectedFlight, setSelectedFlight] = useState([])

    const [agodaPrice, setAgodaPrice] = useState()
    const [tripComPrice, setTripComPrice] = useState()
    const [myTripPrice, setMyTripPrice] = useState()
    const [bayDepPrice, setBayDepPrice] = useState()

    const payload = {
        year: item.year,
        month: item.month,
        day: item.day,
        from: item.from,
        to: item.to,
        adult: adult,
        child: child,
        infant: infant,
        seatClass: item.seatClass,
        sortField: "best",
        sortDir: "asc",
        prefer: [],
        priceFilter: [],
        departureTime: [0, 1440],
        arrivalTime: [0, 1440]
    }

    useEffect(() => {
        if (adult * 2 < child) {
            setChild(adult * 2)
        }
        if (adult < infant) {
            setInfant(adult)
        }
    }, [adult])

    const fetchAgoda = useMutation({
        mutationFn: () => fetchFlightAdvancedSearch(payload),
        onSuccess: (data) => {
            setAgodaPrice(data.flights.find(flight => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo))?.agodaPrice)
        },
        onError: (e) => {
            console.log(e)
        }
    })

    const fetchTripCom = useMutation({
        mutationFn: () => fetchTripComFlight(payload),
        onSuccess: (data) => {
            setTripComPrice(data.find(flight => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo))?.price)
        }
    })

    const fetchMyTrip = useMutation({
        mutationFn: () => fetchMyTripFlight(payload),
        onSuccess: (data) => {
            setMyTripPrice(data.find(flight => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo))?.price)
        }
    })

    const fetchBayDep = useMutation({
        mutationFn: () => fetchBayDepFlight(payload),
        onSuccess: (data) => {
            setBayDepPrice(data.find(flight => JSON.stringify(item.flightNo) === JSON.stringify(flight.flightNo))?.price)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.preventDefault();

        const mutations = [
            fetchAgoda.mutateAsync(),
            fetchTripCom.mutateAsync(),
            fetchMyTrip.mutateAsync(),
            fetchBayDep.mutateAsync()
        ];

        Promise.all(mutations)
            .then()
            .catch((error) => {
                console.error(error);
            });
    }


    return (
        <>
            <div className="my-4">
                <SavedFlightCard item={item} setSelectedItems={false} />

                {/* Ask Flight Details */}
                <div class="text-start font-semibold text-lg">
                    Flight Information
                </div>
                <div className="relative w-full my-2 grow border-gray-300">
                    {/* Ask for number of passenger */}
                    <button
                        id="dropdownDefaultButton"
                        data-dropdown-toggle="dropdown"
                        class="text-gray-900 bg-white font-medium rounded-lg  border border-gray-300 focus:ring-1 focus:ring-black focus:border-black text-sm px-5 py-2.5 text-center inline-flex items-center h-[52px] relative p-2.5 pt-5 ps-10 w-full justify-between appearance-none"
                        type="button"
                        onClick={() => setDropdown(prev => !prev)}
                    >
                        <label
                            for="floating_filled"
                            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] start-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto font-medium"
                        >
                            No. of Passengers
                        </label>
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <i class="fa-regular fa-user w-4 h-4 text-gray-500"></i>
                        </div>
                        {adult} Adult, {child} Child, {infant} Infant{" "}
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
                        className={`z-40 bg-white divide-y divide-gray-100 rounded-b-lg shadow absolute mt-[1.5px] w-full ${dropdown ? "" : "hidden"}`}
                    >
                        <div
                            class="py-5 text-sm text-gray-700 my-3 mx-5 space-y-4"
                            aria-labelledby="dropdownDefaultButton"
                        >
                            <div class="flex justify-between">
                                <div class="flex flex-col">
                                    <div className="text-start">
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
                                                setAdult(
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
                                            ></path>
                                        </svg>
                                        <span class="text-lg"> {adult} </span>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                            onClick={() =>
                                                setAdult(
                                                    (prev) =>
                                                        prev +
                                                            1 +
                                                            child +
                                                            infant <=
                                                            6
                                                            ? prev + 1
                                                            : prev
                                                )}
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
                                    <div className="text-start">
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
                                                setChild(
                                                    (prev) =>
                                                        prev === 0
                                                            ? prev
                                                            : prev - 1
                                                )
                                            }
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            ></path>
                                        </svg>
                                        <span class="text-lg"> {child} </span>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                            onClick={() => setChild(
                                                (prev) =>
                                                    prev <
                                                        adult *
                                                        2 &&
                                                        prev +
                                                        1 +
                                                        adult +
                                                        infant <=
                                                        6
                                                        ? prev + 1
                                                        : prev
                                            )}
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
                                    <div className="text-start">
                                        <i class="fa-solid fa-baby"></i> Infant
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
                                                setInfant(
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
                                            ></path>
                                        </svg>
                                        <span class="text-lg"> {infant} </span>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                            onClick={() => setInfant(
                                                (prev) =>
                                                    prev + 1 <=
                                                        adult &&
                                                        prev +
                                                        1 +
                                                        adult +
                                                        child <=
                                                        6
                                                        ? prev + 1
                                                        : prev
                                            )}
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
                    </div>
                </div>
                {/* Search for price*/}
                <div className="flex justify-center">
                    <div
                        onClick={handleSubmit}
                        className="btn btn-sm text-center rounded-full text-sm text-gray-800">
                        Search
                    </div>
                </div>
                {/* Price */}
                <div className="my-4">
                    {/* Loading price */}
                    {/* If user choose this price, change to bg-[#8DD3BB] , otherwise bg-[#CDEAE1] */}
                    {fetchAgoda.isPending &&
                        (<div className="flex justify-center my-10">
                            <span className="loading loading-dots loading-md"></span>
                        </div>)}
                    {fetchAgoda.isSuccess && agodaPrice && (
                        <div
                            onClick={() => {
                                setSelectedFlight(
                                    (prev) => prev === 'agoda' ? null : 'agoda'
                                )
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [item._id]: {
                                        ...prev[item._id],
                                        price: agodaPrice * (adult + child)
                                    }
                                }));
                            }}
                            class={`border border-transparent ${selectedFlight === "agoda" ? 'bg-[#8DD3BB]' : 'bg-[#CDEAE1]'} rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer hover:bg-[#8DD3BB]`}>
                            <div class="mx-auto">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png"
                                    alt="website logo"
                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                />
                            </div>
                            <div class="mx-auto">
                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                    {agodaPrice?.toLocaleString("vi-VN")} VND
                                </p>
                            </div>
                        </div>
                    )}
                    {fetchMyTrip.isPending &&
                        (<div className="flex justify-center my-10">
                            <span className="loading loading-dots loading-md"></span>
                        </div>)
                    }
                    {fetchMyTrip.isSuccess && myTripPrice &&
                        (<div
                            onClick={() => {
                                setSelectedFlight(
                                    (prev) => prev === 'myTrip' ? null : 'myTrip'
                                )
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [item._id]: {
                                        ...prev[item._id],
                                        price: myTripPrice * (adult + child)
                                    }
                                }));
                            }}
                            class={`border border-transparent ${selectedFlight === "myTrip" ? 'bg-[#8DD3BB]' : 'bg-[#CDEAE1]'} rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer hover:bg-[#8DD3BB]`}>
                            <div class="mx-auto">
                                <img
                                    src="https://ik.imagekit.io/m1g1xkxvo/Uptrip/Mytrip_Logo_Colar_Pink.png?updatedAt=1714385168260"
                                    alt="website logo"
                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                />
                            </div>
                            <div class="mx-auto">
                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                    {myTripPrice?.toLocaleString("vi-VN")} VND
                                </p>
                            </div>
                        </div>)
                    }
                    {fetchTripCom.isPending &&
                        (<div className="flex justify-center my-10">
                            <span className="loading loading-dots loading-md"></span>
                        </div>)
                    }
                    {fetchTripCom.isSuccess && tripComPrice && (
                        <div
                            onClick={() => {
                                setSelectedFlight(
                                    (prev) => prev === 'tripCom' ? null : 'tripCom'
                                )
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [item._id]: {
                                        ...prev[item._id],
                                        price: tripComPrice * (adult + child)
                                    }
                                }));
                            }}
                            class={`border border-transparent ${selectedFlight === "tripCom" ? 'bg-[#8DD3BB]' : 'bg-[#CDEAE1]'} rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer hover:bg-[#8DD3BB]`}>
                            <div class="mx-auto">
                                <img
                                    src="https://ik.imagekit.io/Uptrip/trip.com?updatedAt=1712830814655"
                                    alt="website logo"
                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                />
                            </div>
                            <div class="mx-auto">
                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                    {tripComPrice?.toLocaleString("vi-VN")} VND
                                </p>
                            </div>
                        </div>
                    )}
                    {fetchBayDep.isPending &&
                        (<div className="flex justify-center my-10">
                            <span className="loading loading-dots loading-md"></span>
                        </div>)
                    }
                    {fetchBayDep.isSuccess && bayDepPrice &&
                        (<div
                            onClick={() => {
                                setSelectedFlight(
                                    (prev) => prev === 'bayDep' ? null : 'bayDep'
                                )
                                setSelectedItems((prev) => ({
                                    ...prev,
                                    [item._id]: {
                                        ...prev[item._id],
                                        price: bayDepPrice * (adult + child)
                                    }
                                }));
                            }}
                            class={`border border-transparent ${selectedFlight === "bayDep" ? 'bg-[#8DD3BB]' : 'bg-[#CDEAE1]'} rounded-md flex items-center space-y-1 w-full gap-2 my-2 cursor-pointer hover:bg-[#8DD3BB]`}>
                            <div class="mx-auto">
                                <img
                                    src="https://ik.imagekit.io/m1g1xkxvo/Uptrip/baydep.png?updatedAt=1714385150952"
                                    alt="website logo"
                                    class="w-[60px] h-[30px] md:w-[80px] md:h-[40px] object-cover cursor-pointer"
                                />
                            </div>
                            <div class="mx-auto">
                                <p class="text-xs md:text-lg text-[#222160] font-medium md:font-bold">
                                    {bayDepPrice?.toLocaleString("vi-VN")} VND
                                </p>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </>
    );
}

function ForDetailExperience({ item, setSelectedItems, date }) {
    const [startTime, setStartTime] = useState(item.startTime)
    const [endTime, setEndTime] = useState(item.endTime)
    const [description, setDescription] = useState("")
    return (
        <>
            <div className="my-4">
                <SavedExperienceCard item={item} setSelectedItems={false} />
            </div>
            {/* Additional Details */}
            <div className="my-4">
                <div className="toggleable-details">
                    <div className="details">
                        <form class="w-full mx-auto grid grid-cols-2 gap-4 my-2">
                            <div>
                                <label
                                    for="start-time"
                                    class="block mb-2 text-md font-medium text-gray-900 text-start"
                                >
                                    Start Time
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                        <svg
                                            class="w-4 h-4 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="time"
                                        id="start-time"
                                        class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        max={endTime}
                                        required
                                        value={startTime}
                                        onChange={(e) => {
                                            setStartTime(e.target.value);
                                            if (e.target.value && e.target.value >= endTime) {
                                                setEndTime('');
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        endTime: null,
                                                    }
                                                }))
                                            }
                                            setSelectedItems((prev) => ({
                                                ...prev,
                                                [item._id]: {
                                                    ...prev[item._id],
                                                    startTime: e.target.value,
                                                    date: date,
                                                }
                                            }))
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    for="end-time"
                                    class="block mb-2 text-md font-medium text-gray-900 text-start"
                                >
                                    End Time
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                        <svg
                                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="time"
                                        id="end-time"
                                        class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        min={startTime}
                                        value={endTime}
                                        onChange={(e) => {
                                            setEndTime(e.target.value);
                                            if (e.target.value && e.target.value <= startTime) {
                                                setStartTime('');
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        startTime: null,
                                                    }
                                                }))
                                            }
                                            setSelectedItems((prev) => ({
                                                ...prev,
                                                [item._id]: {
                                                    ...prev[item._id],
                                                    endTime: e.target.value,
                                                    date: date,
                                                }
                                            }))
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                        <div class="my-2 text-start">
                            <label
                                for="note"
                                class="block mb-2 text-base font-medium text-gray-900"
                            >
                                Note
                            </label>
                            <textarea
                                type="text"
                                id="note"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full p-2.5 focus:ring-black focus:border-black"
                                placeholder="Add an extra details."
                                required=""
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                    setSelectedItems((prev) => ({
                                        ...prev,
                                        [item._id]: {
                                            ...prev[item._id],
                                            description: e.target.value,
                                        }
                                    }))
                                }}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function EmptySection({refetchItinerary, isAddingExperience, date}) {
    return (
        <>
            <div className="shadow-lg rounded-lg border-gray-400 text-center p-8 pt-12">
                <p className="text-lg font-semibold">
                    Build your plan by adding items from your favorites or
                    customizing your trip day
                </p>
                <AddItemButton refetchItinerary={refetchItinerary} isAddingExperience={isAddingExperience} date={date}/>
            </div>
        </>
    );
}

export function StayCard({ item, refetchItinerary }) {
    const convertDate = (date) => `${date.substring(6, 8)}.${date.substring(4, 6)}.${date.substring(0, 4)}`
    const [searchParams] = useSearchParams()

    const getURLImage = (item) => {
        if (item.tripPrice) return "https://ik.imagekit.io/Uptrip/trip.com?updatedAt=1712830814655"
        if (item.agodaPrice) return "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_transparent_logo.png"
        if (item.bookingPrice) return "https://ik.imagekit.io/Uptrip/booking.com?updatedAt=1712829810252"
    }

    const modalId = `delete_itinerary_item_card_modal_${item._id}`; 

    const deleteHotel = useMutation({
        mutationFn: () => deleteHotelFromItinerary({ itineraryId: searchParams.get("itineraryId"), hotelId: item._id }),
        onSuccess: () => {
            successNotify("Hotel deleted from itinerary")
            refetchItinerary()
            document.getElementById(modalId).close();
        }
    })

    const handleDelete = (e) => {
        e.preventDefault()
        deleteHotel.mutate()
    }

    return (
        <>
            <div class="card card-side flex-col md:flex-row rounded-lg bg-white shadow-xl my-4">
                <Link>
                    <figure className="rounded-t-lg md:rounded-tr-none md:rounded-l-lg h-full">
                        <img
                            src={item.imgSrc}
                            alt="Itinerary Cover Pic"
                            className="w-full h-[150px] md:w-[280px] md:h-[360px] object-cover"
                        />
                    </figure>
                </Link>

                <div class="card-body flex-1 px-5 p-7">
                    <div className="flex justify-between items-center">
                        <div>
                            <img
                                src={getURLImage(item)}
                                alt="Logo of platform"
                                className="w-[120px] h-[60px] object-cover"
                            />
                        </div>
                        <div>
                            <div className="dropdown dropdown-end">
                                <div>
                                    <button
                                        className="bg-transparent text-lg border-n"
                                        tabIndex={0}
                                    >
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                                >
                                    <li>
                                        <div
                                            className="text-red-600"
                                            onClick={() =>
                                                document
                                                    .getElementById(modalId)
                                                    .showModal()
                                            }
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                            Delete
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <dialog
                                id={modalId}
                                className="modal modal-bottom sm:modal-middle"
                            >
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg text-center pt-4 pb-1">
                                        Are you sure you want to delete this
                                        item?
                                    </h3>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn rounded-lg mx-2">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    handleDelete(e);
                                                }}
                                                className="btn bg-black text-white rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>
                    <Link>
                        <h2 class="card-title text-base md:text-2xl hover:underline underline-offset-4 mb-4">
                            {item.hotelName}
                        </h2>
                    </Link>
                    <div className="md:flex md:space-x-20 mb-4">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="text-xl text-gray-600">
                                <i class="fa-regular fa-calendar"></i>
                            </div>
                            <div>
                                <p className="text-gray-600">Check-out</p>
                                <p className="font-semibold">
                                    {convertDate(item.checkout)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-xl text-gray-600">
                                <i class="fa-regular fa-calendar"></i>
                            </div>
                            <div>
                                <p className="text-gray-600">Check-in</p>
                                <p className="font-semibold">
                                    {convertDate(item.checkin)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="text-xl text-gray-600">
                                <i class="fa-regular fa-user"></i>
                            </div>
                            <div>
                                <p className="text-gray-600">
                                    Guest(s) and Room(s)
                                </p>
                                <p className="font-semibold">
                                    {item.adult} adult(s), {item.child || 0}{" "}
                                    child(ren), {item.crn || 1} room(s)
                                </p>
                            </div>
                        </div>
                        <div className="font-bold text-2xl text-end">
                            {item.tripPrice ||
                                item.agodaPrice ||
                                item.bookingPrice}{" "}
                            {"VND"}
                        </div>
                    </div>
                    <div class="card-actions md:justify-between flex-col md:flex-row md:items-end flex-1"></div>
                </div>
            </div>
        </>
    );
}

export function FlightCard({item, refetchItinerary}) {
    const [searchParams] = useSearchParams()

    const modalId = `delete_itinerary_item_card_modal_${item._id}`; 

    const deleteFLight = useMutation({
        mutationFn: () => deleteFlightItinerary({itineraryId: searchParams.get("itineraryId"), flightId: item._id}),
        onSuccess: () => {
            successNotify("Flight deleted from itinerary")
            refetchItinerary()
            document.getElementById(modalId).close(); 
        },
        onError: (e) => {
            console.log(e)
        }
    })

    const handleDelete = (e) => {
        e.preventDefault()
        deleteFLight.mutate()
    }

    return (
        <>
            <div class="card card-side rounded-lg py-4 md:py-0 bg-white shadow-xl my-4">
                <div class="card-body flex-1 p-0 px-5 md:p-7">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-thin text-xl">
                            <p>{item.departureTime.substring(0, 10)}</p>
                        </div>
                        <div>
                            <div className="dropdown dropdown-end">
                                <div>
                                    <button
                                        className="bg-transparent text-lg border-n"
                                        tabIndex={0}
                                    >
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                                >
                                    <li>
                                        <div
                                            className="text-red-600"
                                            onClick={() =>
                                                document
                                                    .getElementById(modalId)
                                                    .showModal()
                                            }
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                            Delete
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <dialog
                                id={modalId}
                                className="modal modal-bottom sm:modal-middle"
                            >
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg text-center pt-4 pb-1">
                                        Are you sure you want to delete this
                                        item?
                                    </h3>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn rounded-lg mx-2">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="btn bg-black text-white rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <Link>
                            <img
                                src={item.imgSrc}
                                alt="Logo of platform"
                                className="w-[100px] md:w-[180px]"
                            />
                        </Link>
                        <div className="w-full flex flex-row items-start m-4 md:items-center justify-around md:px-2 flex-1">
                            <p className="font-semibold text-lg flex justify-end">
                                {item.departureTime.substring(11, 16)}
                            </p>
                            <p className="font-thin text-lg flex justify-end">
                                {item.from}
                            </p>
                            <div className="mx-4">
                                <i class="fa-solid fa-plane"></i>
                            </div>
                            <p className="font-thin text-lg">{item.to}</p>
                            <p className="font-semibold text-lg">
                                {item.arrivalTime.substring(11, 16)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="font-bold text-2xl">
                            {item.price.toLocaleString("vi-VN")} VND
                        </div>
                    </div>
                    <div class="card-actions md:justify-between flex-col md:flex-row md:items-end flex-1"></div>
                </div>
            </div>
        </>
    );
}

export function ActivityCard({experience, refetchItinerary}) {
    const [searchParams] = useSearchParams()

    const modalId = `delete_itinerary_item_card_modal_${experience._id}`; 

    const deleteExperience = useMutation({
        mutationFn: () => deleteExperienceFromItinerary({itineraryId: searchParams.get("itineraryId"), experienceId: experience._id}),
        onSuccess: () => {
            successNotify("Activity deleted from itinerary")
            refetchItinerary()
            document.getElementById(modalId).close(); 
        },
        onError: (e) => {
            console.log(e)
        }
    })

    const handleDelete = (e) => {
        e.preventDefault()
        deleteExperience.mutate()
    }

    return (
        <>
            <div class="flex-1 card card-side flex-col md:flex-row rounded-lg bg-white shadow-md my-4">
                <Link>
                    <figure className="rounded-t-lg md:rounded-tr-none md:rounded-l-lg h-full">
                        <img
                            src={experience.imgSrc}
                            alt="Itinerary Cover Pic"
                            className="w-full h-[150px] md:w-[280px] md:h-[280px] object-cover"
                        />
                    </figure>
                </Link>

                <div class="card-body flex-1 px-5 p-7">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 class="card-title text-base md:text-2xl mb-4">
                                {experience.name}
                            </h2>
                        </div>
                        <div>
                            <div className="dropdown dropdown-end">
                                <div>
                                    <button
                                        className="bg-transparent text-lg border-n"
                                        tabIndex={0}
                                    >
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                                >
                                    <li>
                                        <div
                                            className="text-red-600"
                                            onClick={() =>
                                                document
                                                    .getElementById(modalId)
                                                    .showModal()
                                            }
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                            Delete
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <dialog
                                id={modalId}
                                className="modal modal-bottom sm:modal-middle"
                            >
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg text-center pt-4 pb-1">
                                        Are you sure you want to delete this
                                        item?
                                    </h3>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn rounded-lg mx-2">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="btn bg-black text-white rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>

                    {experience.description ? (
                        <div className="mb-2">
                            <p className="text-gray-600">
                                {experience.description}
                            </p>
                        </div>
                    ) : null}

                    <div className="md:flex justify-between items-center">
                        <div className="flex flex-col md:flex-row md:space-x-20 mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="text-xl text-gray-600">
                                    <i class="fa-regular fa-calendar"></i>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        Estimated Time
                                    </p>
                                    <p className="font-semibold">
                                        {experience.startTime} -{" "}
                                        {experience.endTime}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="font-bold text-2xl text-end">
                            {experience.price
                                ? `${experience.price.toLocaleString(
                                      "vi-VN"
                                  )} VND`
                                : "Free"}
                        </div>
                    </div>
                    <div class="card-actions md:justify-between flex-col md:flex-row md:items-end flex-1"></div>
                </div>
            </div>
        </>
    );
}

export function BudgetCard({itinerary}) {
    const numericValue = (price) => price ? Number(price?.replace(/\./g, '')?.replace(/,/g, '')) : 0;
    const stayExpenses = Math.round(itinerary?.hotels.reduce((total, item) => total + (numericValue(item.tripPrice) || numericValue(item.agodaPrice) || numericValue(item.bookingPrice)), 0))
    const flightExpenses = itinerary?.flights.reduce((total, item) => total + (item?.price), 0)
    const experienceExpenses = itinerary?.experiences.reduce((total, item) => total + (item.price ? item.price : 0), 0)
    
    return (
        <>
            <div className="py-8 px-2 shadow-md border rounded-lg md:ml-4 drop-shadow-xl">
                <div className="px-3 md:px-8 font-semibold text-xl">
                    Estimated Total Spent
                </div>
                <div className="divider px-3 md:px-8"></div>
                <div className="flex justify-between px-3 md:px-8 my-2 text-xl space-x-16">
                    <div>Accomodation</div>
                    <div>{stayExpenses?.toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="flex justify-between px-3 md:px-8 my-2 text-xl">
                    <div>Transport</div>
                    <div>{flightExpenses?.toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="flex justify-between px-3 md:px-8 my-2 text-xl">
                    <div>Activities</div>
                    <div>{experienceExpenses?.toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="divider px-3 md:px-8"></div>
                <div className="flex justify-between px-3 md:px-8 my-2 text-xl font-semibold">
                    <div>Subtotal</div>
                    <div>{Math.round(stayExpenses + flightExpenses + experienceExpenses)?.toLocaleString('vi-VN')} VND</div>
                </div>
            </div>
        </>
    );
}

export function SavedStayCard({ item, setSelectedItems, selectedItems }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleCardClick = () => {
        if (!setSelectedItems) return
        setIsSelected((prev) => {
            const newState = !prev;
            setSelectedItems((prevSelectedItems) => {
                const updatedItems = { ...prevSelectedItems };
                if (newState) {
                    updatedItems[item._id] = { item, type: "stay" };
                } else {
                    delete updatedItems[item._id];
                }
                return updatedItems;
            });
            return newState;
        });
    };

    return (
        <>
            <div
                className={`card card-side bg-white p-3 border-[2px] ${isSelected
                    ? "border-black"
                    : "border-gray-300 hover:border-black duration-300"
                    } rounded-md items-start my-4`}
                onClick={handleCardClick}
            >
                <figure className="w-1/3">
                    <img
                        src={item.imgSrc}
                        className="w-full h-20 rounded-md"
                        alt="Hotel"
                    />
                </figure>
                <div className="flex space-y-1 flex-col items-start px-4 w-full">
                    <h2 className="text-lg md:text-xl font-semibold text-start">
                        {item.hotelName}
                    </h2>
                    <div class="flex space-x-1">
                        {Array.from({ length: Math.round(item.rating) }, (e, i) => (
                            <svg
                                class="w-4 h-4 text-[#ffa732]"
                                key={i}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        ))}
                    </div>
                    <p class="text-gray-500 text-sm md:text-base">
                        <i class="fa-solid fa-location-dot"></i> {item.cityName}
                    </p>
                </div>
            </div>
        </>
    );
}

export function SavedFlightCard({ item, setSelectedItems, selectedItems }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleCardClick = () => {
        if (!setSelectedItems) return
        setIsSelected((prev) => {
            const newState = !prev;
            setSelectedItems((prevSelectedItems) => {
                const updatedItems = { ...prevSelectedItems };
                if (newState) {
                    updatedItems[item._id] = { item, type: "flight" };
                } else {
                    delete updatedItems[item._id];
                }
                return updatedItems;
            });
            return newState;
        });
    };

    return (
        <>
            <div
                className={`card flex-col card-side bg-white p-3 border-[2px] ${isSelected
                    ? "border-black"
                    : "border-gray-300 hover:border-black duration-300"
                    } rounded-md items-start my-4`}
                onClick={handleCardClick}
            >
                <figure className="flex w-full">
                    <img
                        src={item.imgSrc}
                        className="w-6 h-6 rounded-md"
                        alt="Airline"
                    />
                    <div className="text-gray-500 text-start ml-2">
                        {item.carrier}
                    </div>
                </figure>
                <div className="flex space-y-1 flex-col items-start px-4 w-full">
                    <div className="flex justify-between w-full">
                        <div className="flex flex-col">
                            <div className="font-semibold">{item.departureTime.substring(11, 16)}</div>
                            <div className="text-gray-500">{item.from}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-semibold">{item.departureTime.substring(0, 10)}</div>
                            <div className="text-gray-500">Departure</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-gray-500 pb-1 font-thin">
                                {item.duration}
                            </div>
                            <hr className="text-gray-500"></hr>
                            <div className="text-gray-500 mt-1 font-thin">
                                {item.flightNo.length === 1 ? "non-stop" : item.flightNo.length + 1 + "stop(s)"}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-semibold">{item.arrivalTime.substring(0, 10)}</div>
                            <div className="text-gray-500">Arrival</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-semibold">{item.arrivalTime.substring(11, 16)}</div>
                            <div className="text-gray-500">{item.to}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function SavedExperienceCard({ item, setSelectedItems }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleCardClick = () => {
        if (!setSelectedItems) return
        setIsSelected((prev) => {
            const newState = !prev;
            setSelectedItems((prevSelectedItems) => {
                const updatedItems = { ...prevSelectedItems };
                if (newState) {
                    updatedItems[item._id] = { item, type: "experience" };
                } else {
                    delete updatedItems[item._id];
                }
                return updatedItems;
            });
            return newState;
        });
    };

    return (
        <>
            <div
                className={`card card-side bg-white p-3 border-[2px] ${isSelected
                    ? "border-black"
                    : "border-gray-300 hover:border-black duration-300"
                    } rounded-md items-start my-4`}
                onClick={handleCardClick}
            >
                <figure className="w-1/3">
                    <img
                        src={item.imgSrc}
                        className="w-full h-20 rounded-md"
                        alt="Hotel"
                    />
                </figure>
                <div className="flex space-y-1 flex-col items-start px-4 w-full">
                    <h2 className="text-lg md:text-xl font-semibold text-start">
                        {item.name}
                    </h2>
                    <div class="flex space-x-1">
                        {Array.from({ length: Math.round(item.rating) }, (e, i) => (
                            <svg
                                class="w-4 h-4 text-[#ffa732]"
                                key={i}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        ))}
                    </div>
                    <div className="text-base font-semibold">
                        {item?.price
                            ? (`from ${item?.price?.toLocaleString('vi-VN')} VND`)
                            : ( "free" )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
