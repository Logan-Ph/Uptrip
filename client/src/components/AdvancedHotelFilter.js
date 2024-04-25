import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { useState } from 'react';

export function AdvancedHotelFilter(){
    return(
        <>
        <div className='flex-col space-y-6'>
            <PriceRange/>
            <hr className='md:w-3/4'/>
            <BedType/>
            <hr className='md:w-3/4'/>
            <AmenitiesFilter/>
            <hr className='md:w-3/4'/>
            <ProperStyleFilter/>
            
        </div>

        </>
    )
}

function PriceRange(){
    const [showPriceRang, setPriceRange] = useState(false);
    return(
        <>
        <div className='md:w-3/4 flex items-center justify-between'>
            <div className="font-bold text-md">PriceRange</div>
            {showPriceRang ? (
                 <ChevronUpIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true"/>
                ) : (
                    <ChevronDownIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true"/>
            )}
        </div>


        {showPriceRang && (
            <div className='flex-col'>
                <div>
                    <input type="range" min={50} max="1200" step="25" className="range-secondary w-full md:w-3/4"  />
                </div>
                <div className="md:w-3/4 flex justify-between">
                    <span>$50</span>
                    <span>$1200</span>
                </div>
            </div>
        )}


        </>
    )
}

function BedType(){
    const [showAmenities, setShowAmenities] = useState(true);

    const amenityCat = [
        {type: "1 Double Bed"},{type: "2 Beds"},{type: "1 Single Bed"},{type: "3 Beds"},
        {type: "King Bed"}, {type: "Multiple Beds"}
    ]
    return(   
    <>
        <div className="md:w-3/4 flex items-center justify-between">
            <div className="font-bold text-md">Bed Type</div>
            {showAmenities ?(
                <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
            ) : (
                <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
            )}
        </div>
        {showAmenities && (
            <div>
                {amenityCat.map((item, index) => (
                <div className="flex items-center space-x-2" key={index}>
                    <input type="checkbox" className="border-gray-900 rounded-sm valid:border-gray-900 " />
                    <label className="font-medium text-md">{item.type}</label>
                </div>
            ))}
            </div>
        )}        
        </>
    )
}

function AmenitiesFilter(){
    const [showAmenities, setShowAmenities] = useState(true);

    const amenityCat = [
        {type: "Wifi"},{type: "Swimming Pool"},{type: "Parking"},{type: "Elevator"},
        {type: "Meeting Room"}, {type: "Airport Pick-up Service"}, {type: "Barbecue"}, {type: "Smoking Area"},
        {type: "Airport Transfer"}
    ]
    return(   
    <>
        <div className="md:w-3/4 flex items-center justify-between">
            <div className="font-bold text-md">Property Facilities & Services</div>
            {showAmenities ?(
                <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
            ) : (
                <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
            )}
        </div>
        {showAmenities && (
            <div>
                {amenityCat.map((item, index) => (
                <div className="flex items-center space-x-2" key={index}>
                    <input type="checkbox" className="border-gray-900 rounded-sm valid:border-gray-900 " />
                    <label className="font-medium text-md">{item.type}</label>
                </div>
            ))}
            </div>
        )}        
        </>
    )
}

function ProperStyleFilter(){
    const [showAmenities, setShowAmenities] = useState(true);

    const amenityCat = [
        {type: "Balcony"},{type: "Bathtub"},{type: "TV"},{type: "Air conditioner"},{type: "Extra Beds Available"},
        {type: "Washing Machine"},{type: "Electric Kettle"},{type: "Garden/Yard"}
    ]

    return(   
    <>
        <div className="md:w-3/4 flex items-center justify-between">
            <div className="font-bold text-md">Room Facilities & Services</div>
            {showAmenities ?(
                <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
            ) : (
                <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
            )}
        </div>
        {showAmenities && (
            <div>
                {amenityCat.map((item, index) => (
                <div className="flex items-center space-x-2" key={index}>
                    <input type="checkbox" className="border-gray-900 rounded-sm valid:border-gray-900 " />
                    <label className="font-medium text-md">{item.type}</label>
                </div>
            ))}
            </div>
        )}        
        </>
    )
}