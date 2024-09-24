import { useState, React } from "react";
import { SavedCollectionCard } from "./CollectionCard";
import {IconX} from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addExperienceToCollection, addHotelToCollection, fetchCollections, addFlightToCollection } from '../api/fetch';
import CollectionCardSkeleton from "./skeletonLoadings/CollectionCardSkeleton";
import { addNewCollection } from "../api/fetch";
import successNotify from "../utils/successNotify";
import warningNotify from "../utils/warningNotify";

export default function AddToFavorite({payload, hotel, experience, flight}){
    return(
        <>
            <div className="mt-10">
                <AddItemButton payload={payload} hotel={hotel} experience={experience} flight={flight}/>
            </div>
        </>
    )
}

function AddItemButton({payload, hotel, experience, flight}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [selectedCollection, setSelectedCollection] = useState();

    const {
        data: collections,
        isLoading: isLoadingCollections,
        isSuccess: isSuccessCollections,
        refetch: refetchCollections,
        isError: isErrorCollections,
    } = useQuery({
        queryKey: ["fetch-collections"],
        queryFn: () => fetchCollections(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const toggleDrawer = () => {
        if (isErrorCollections) {
            warningNotify("You are not logged in")
        }else{
            setIsOpen((prev) => !prev);
        }
    };

    const createCollection = useMutation({
        mutationFn: () => addNewCollection(name, description),
        onSuccess: (data) => {
            successNotify(data.data)
            refetchCollections()
            setDescription("")
            setName("")
            document.getElementById("create_collection_modal").close()
        },
        onError: (error) => {
            warningNotify(error.response.data);
        }
    })

    const addToCollectionHotel = useMutation({
        mutationFn: () => addHotelToCollection({
            city: payload.city,
            cityName: payload.cityName,
            provinceId: payload.provinceId,
            countryId: payload.countryId,
            districtId: payload.districtId,
            hotelName: hotel.hotelBasicInfo.hotelName || payload.hotelName,
            lat: hotel.positionInfo.coordinate.lat || payload.latitude,
            lon: hotel.positionInfo.coordinate.lng || payload.longitude,
            searchValue: payload.searchValue,
            searchCoordinate: payload.searchCoordinate,
            adult: payload.adult,
            ages: payload.ages,
            domestic: payload.domestic,
            children: payload.children,
            crn: payload.crn,
            address: `${hotel.hotelBasicInfo.hotelAddress}, ${hotel.positionInfo.cityName}`,
            rating: hotel.commentInfo.commentScore,
            imgSrc: hotel.hotelBasicInfo.hotelImg, 
            hotelId: hotel.hotelBasicInfo.hotelId,
            collectionId: selectedCollection._id
        }),
        onSuccess: (data) => {
            successNotify("Added to collection")
            refetchCollections()
        },
        onError: (error) => {
            warningNotify(error.response.data);
        }
    })

    const addToCollectionExperience = useMutation({
        mutationFn: () => addExperienceToCollection({
            name: experience?.content?.activity?.title || experience?.card?.poiName,
            description: experience?.content?.activity?.description || experience?.card?.description,
            imgSrc: experience?.content?.images[0]?.url || experience?.card?.coverImageUrl,
            price: experience?.activityRepresentativeInfo?.pricingSummary?.pricing?.[0]?.display?.perBook?.total?.allInclusive?.chargeTotal || experience?.card?.priceInfo?.price,
            rating: experience?.card?.commentInfo?.commentScore || experience?.content?.reviewSummary?.averageScore,
            collectionId: selectedCollection._id
        }),
        onSuccess: (data) => {
            successNotify("Added to collection")
            refetchCollections()
        },
        onError: (error) => {
            warningNotify(error.response.data);
        }
    })

    const addToCollectionFlight = useMutation({
        mutationFn: () => addFlightToCollection(payload, selectedCollection._id),
        onSuccess: () => {
            successNotify("Added to collection")
            refetchCollections()
        },
        onError: (e) => {
            console.log(e)
            warningNotify(e.message);
        }
    })

    const handleCreateCollection = (e) => {
        e.preventDefault()
        createCollection.mutate()
    }

    const handleAddToCollection = (e) => {
        e.preventDefault()
        if (!selectedCollection) {
            warningNotify("Please select a collection")
        }else{
            if (hotel) addToCollectionHotel.mutate()
            if (experience) addToCollectionExperience.mutate()
            if (flight) addToCollectionFlight.mutate()
        }
    }

    return (
        <>
            {/* Button */}
            <div className="flex items-center my-2 md:pr-0 shadow-sm">
                <div className="border-2 bg-[#8DD3BB] border-[#8DD3BB] w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-between rounded-md cursor-pointer py-2  max-md:rounded-full" onClick={toggleDrawer}>
                    <svg className="w-[20px] h-[20px] mx-auto hover:transition ease-in-out delay-150:-translate-y-1 hover:scale-110 duration-300 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                        fill="white">
                        <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"/>
                    </svg>   
                </div>
            </div>

            {(isOpen && !isErrorCollections) && (
                <div className="">
                {/* Drawer */}
                <div className={`fixed top-0 right-0 h-full w-11/12 sm:w-1/2 md:w-4/12 bg-white shadow-lg transition-all duration-300 ease-in-out z-50 px-2 md:px-6 
                    
                    ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-auto`}>
                    {/* close button */}
                    <div 
                        onClick={handleClose} className="material-icons cursor-pointer my-6 transition ease-in-out delay-150:-translate-y-1 hover:scale-110 duration-300" style={{ float: 'right' }}>
                        <IconX stroke={2} size={40}/>
                    </div>
                
                    {/* Content inside the drawer */}
                    
                    {/* create new collection if users require */}
                    <div className="border-b my-6 text-center">
                        <button
                            className="btn w-full border p-4 rounded-md font-semibold border-black bg-white"
                            onClick={() =>
                                document
                                .getElementById("create_collection_modal")
                                .showModal()
                            }
                            >
                            <i class="fa-solid fa-plus mr-2"></i> Create new
                            collection
                        </button>
                        <dialog id="create_collection_modal" className="modal">
                            <div className="modal-box">
                                <div method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button 
                                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                        onClick={() => {
                                            document
                                                .getElementById("create_collection_modal")
                                                .close()
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <h3 className="font-bold text-lg my-4">
                                    Create new collection
                                </h3>
                                <div>
                                    <div className="mb-5 text-start">
                                        <label
                                            for="name"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl w-full p-2.5 focus:ring-black focus:border-black"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            />
                                    </div>
                                    <div className="mb-5 text-start">
                                        <label
                                            for="description"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                            Description
                                        </label>
                                        <textarea
                                            type="text"
                                            id="description"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:ring-black focus:border-black"
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        className="flex btn btn-outline  justify-end"
                                        onClick={(e) => handleCreateCollection(e)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    </div>
                    
                    {/* Selection a collection to save your items */}
                    <div className=" ">
                        <div className="py-6 bg-white mb-6 text-center sticky top-0 z-50 border-b-2">
                            {isSuccessCollections && collections.length > 0 ?
                                <>
                                    <h1 className="text-2xl font-semibold mb-2">Choose a collection</h1>
                                    <p className="text-gray-500 text-center">Select the collection to save your favorite items</p>
                                </>
                                :
                                <>
                                    <h1 className="text-2xl font-semibold mb-2">No collection found</h1>
                                    <p className="text-gray-500 text-center">Create a new collection to save your favorite items</p>
                                </>
                            }
                        </div>

                        {isLoadingCollections && (
                            <>
                                <CollectionCardSkeleton />
                                <CollectionCardSkeleton />
                                <CollectionCardSkeleton />
                            </>
                        )}

                        {   
                            isSuccessCollections && collections.length > 0  &&      
                            collections.map((collection) => {
                                return (
                                    <div key={collection._id} onClick={() => setSelectedCollection(collection)}>
                                        <SavedCollectionCard key={collection._id} collection={collection} isCollectionSelected={selectedCollection?._id === collection._id} />
                                    </div>
                                )
                            })

                        }
                    </div>
                    
                    {/* If no collection, hidden */}
                    {isSuccessCollections && collections.length > 0
                        ? 
                            <div className="sticky bottom-[-10px] bg-white w-full py-6 flex justify-end border-t">
                                <div
                                    className="btn btn-outline bg-black text-white hover:bg-gray-900 rounded-full"
                                    onClick={(e) => handleAddToCollection(e) }    
                                >
                                    Save
                                </div>
                            </div>
                        :
                            null
                    }
                </div>

                {/* Overlay to close the drawer */}
                {isOpen && (
                    <div
                    onClick={toggleDrawer}
                    className="fixed top-0 left-0 h-full w-full bg-gray-800 opacity-50 transition-opacity duration-300 ease-in-out z-10"
                    ></div>
                )}
            </div>
            )}
        </>
    );
}

