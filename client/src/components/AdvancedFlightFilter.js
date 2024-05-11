import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState, useRef } from 'react';
import Checkbox from '@mui/joy/Checkbox';
import Slider from '@mui/material/Slider';

export function AdvancedFlightFilter({ setPrefer, setPriceFilter, setDepartureTime, setArrivalTime, priceMax, priceStep }) {
    return (
        <>
            <div className='flex-col space-y-6'>
                <PriceRange priceMax={priceMax} priceStep={priceStep} setPriceFilter={setPriceFilter} />
                <hr className='w-full md:w-3/4' />
                <DepartureTime setDepartureTime={setDepartureTime}/>
                <hr className='w-full md:w-3/4' />
                <ArrivalTime setArrivalTime={setArrivalTime}/>
                <hr className='w-full md:w-3/4' />
                <Airlines setPrefer={setPrefer} />
            </div>

        </>
    )
}

function PriceRange({priceMax, priceStep, setPriceFilter}) {
    const [showPriceRange, setPriceRange] = useState(true);
    const [value, setValue] = useState([0, 0]);

    useEffect(() => {
        if (value[1] == 0) {
            setValue([0, priceMax]);
        }
    }, [priceMax]); 
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPriceFilter(value);
    };

    const valueLabelFormat = (value) => {
        return `₫${value}`;
    };

    return (
        <>

            <div className='md:w-3/4 flex items-center justify-between'>
                <div className="font-bold text-md">Price</div>

                {showPriceRange ? (
                    <ChevronUpIcon onClick={() => setPriceRange(!showPriceRange)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                ) : (
                    <ChevronDownIcon onClick={() => setPriceRange(!showPriceRange)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                )}
            </div>

            {showPriceRange && (
                <div className='md:w-3/4'>
                    <Slider
                        getAriaLabel={() => 'Price range'}
                        value={value}
                        onChangeCommitted={handleChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={valueLabelFormat}
                        min={0}
                        max={priceMax}
                        step={100000}
                        color="dark"
                    />
                </div>
            )}
        </>
    );
}

function DepartureTime({setDepartureTime}) {
    const [showPriceRang, setPriceRange] = useState(true);
    const [value, setValue] = useState([0, 24]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setDepartureTime(value.map(v => v * 60)); // convert
    };
    // Function to format the value for display
    const valueLabelFormat = (value) => {
        // const hour = Math.floor(value);
        // const amPm = hour >= 12 ? 'PM' : 'AM';
        // const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24h to 12h format
        return `${value}:00`;
    };


    return (
        <>
            <div className='md:w-3/4 flex items-center justify-between'>
                <div className="font-bold text-md">Departure Time</div>

                {showPriceRang ? (
                    <ChevronUpIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                ) : (
                    <ChevronDownIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                )}
            </div>

            {showPriceRang && (
                <div className='md:w-3/4'>
                    <Slider
                        getAriaLabel={() => 'Price range'}
                        value={value}
                        onChangeCommitted={handleChange}
                        valueLabelDisplay="auto" // Display the label on the slider thumb
                        valueLabelFormat={valueLabelFormat} // Format the label to show a dollar sign
                        min={0}
                        max={24}
                        step={1}
                    />
                </div>
            )}
        </>
    );
}

function ArrivalTime({setArrivalTime}) {
    const [showPriceRang, setPriceRange] = useState(true);
    const [value, setValue] = useState([0, 24]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setArrivalTime(value.map(v => v * 60));
    };
    // Function to format the value for display
    const valueLabelFormat = (value) => {
        return `${value}:00`;
    };


    return (
        <>
            <div className='md:w-3/4 flex items-center justify-between'>
                <div className="font-bold text-md">Arrival Time</div>

                {showPriceRang ? (
                    <ChevronUpIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                ) : (
                    <ChevronDownIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                )}
            </div>

            {showPriceRang && (
                <div className='md:w-3/4'>
                    <Slider
                        getAriaLabel={() => 'Price range'}
                        value={value}
                        onChangeCommitted={handleChange}
                        valueLabelDisplay="auto" // Display the label on the slider thumb
                        valueLabelFormat={valueLabelFormat} // Format the label to show a dollar sign
                        min={0}
                        max={24}
                        step={1}
                    />
                </div>
            )}
        </>
    );
}

function Airlines({ setPrefer }) {
    const [showAmenities, setShowAmenities] = useState(true);

    const [airlineState, setAirlineState] = useState([
        {
            type: "Vietnam Airlines",
            code: "VN",
            isChecked: false,
        },
        {
            type: "Vietjet Air",
            code: "VJ",
            isChecked: false,
        },
        {
            type: "Bamboo Airways",
            code: "QH",
            isChecked: false,
        },
        {
            type: "Vietravel Airlines",
            code: "VU",
            isChecked: false
        }
    ])

    const handleCheckboxChange = (index) => {
        const updatedAirlineState = [...airlineState];
        updatedAirlineState[index].isChecked = !updatedAirlineState[index].isChecked;
        setAirlineState(updatedAirlineState);
        const checkedItems = updatedAirlineState.filter(item => item.isChecked).map(item => item.code);
        setPrefer(checkedItems);
    };

    return (
        <>
            <div className="md:w-3/4 flex items-center justify-between">
                <div className="font-bold text-md">Property Sytle</div>
                {showAmenities ? (
                    <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
                ) : (
                    <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
                )}
            </div>
            {showAmenities && (
                <div>
                    {airlineState.map((item, index) => (
                        <div className="flex items-center space-x-2" key={index}>
                            <Checkbox
                                variant='outlined'
                                color='success'
                                checked={item.isChecked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <label className="font-medium text-md">{item.type}</label>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}