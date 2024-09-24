import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react';
import Checkbox from '@mui/joy/Checkbox';
import Slider from '@mui/material/Slider';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AdvancedHotelFilter({filterOptions, listFilter, payload, listSort}){
    return(
        <>
        <div className='flex-col space-y-6 max-md:px-3'>
            <PriceRange listFilter={listFilter} payload={payload} listSort={listSort}/>
            <hr className='lg:w-3/4'/>
            <AmenitiesFilter amenities={filterOptions?.data?.propertyFacilitiesAndServices} listFilter={listFilter} payload={payload} listSort={listSort}/>
            <hr className='lg:w-3/4'/>
            <ProperStyleFilter properties={filterOptions?.data?.roomFacilitiesAndServices} listFilter={listFilter} payload={payload} listSort={listSort}/>
        </div>
        </>
    )
}

function valuetext(value) {
    return `${value}$`;
}

function PriceRange({listFilter, payload, listSort}) {
    const [searchParams] = useSearchParams();
    const [showPriceRang, setPriceRange] = useState(true);
    const [value, setValue] = useState(searchParams.get("listFilters")?.split(',')?.filter(filter => filter.includes("15~Range*15"))[0]?.split("*")[2]?.split("~") || [0, 4200000]);
    const navigate = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toggleListFilter = () => {
        const oldFilters = String(listFilter.current).split(',');
        const oldFilter = oldFilters.filter(filter => filter.includes("15~Range*15"));
        for (let i = 0; i < oldFilter.length; i++) {
            const index = oldFilters.indexOf(oldFilter[i]);
            oldFilters.splice(index, 1);
        }
        const newListFilter = `15~Range*15*${value[0]}~${value[1]}*2`;
        listFilter.current = `${oldFilters.join(',')},${newListFilter}`;
        let listFilters = `${listSort.current},${listFilter.current}`
        navigate(
            `/advanced-hotel-search/?resultType=${payload.resultType}&city=${payload.city}&cityName=${payload.cityName}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&listFilters=${listFilters}&domestic=${payload.domestic}`
        );
    }

    const valueLabelFormat = (value) => {
        return `VND ${value.toLocaleString("vi-VN")}`;
    };
  
    return (
        <>
     
        <div className='lg:w-3/4 flex items-center justify-between'>
            <div className="font-bold text-md">Price (VND {value[0].toLocaleString("vi-VN")} - VND {value[1].toLocaleString("vi-VN")}+)</div>
             {showPriceRang ? (
                <ChevronUpIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true"/>
            ) : (
                <ChevronDownIcon onClick={() => setPriceRange(!showPriceRang)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true"/>
            )}
        </div>
        
        {showPriceRang && (
            <div className='lg:w-3/4'>
                <Slider
                    getAriaLabel={() => 'Price range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto" // Display the label on the slider thumb
                    valueLabelFormat={valueLabelFormat} // Format the label to show a dollar sign
                    getAriaValueText={valuetext}
                    onChangeCommitted={() => {
                        toggleListFilter()
                    }}
                    min={0}
                    max={4200000}
                    step={100000}
                    color = "dark"
                />
            </div>
        )}
    </>
    );
}

function AmenitiesFilter({amenities, listFilter, payload, listSort}){
    const [showAmenities, setShowAmenities] = useState(false);
    const navigate = useNavigate();
    const toggleListFilter = (item) => {
        const newListFilter = `${item.filterId.split("|")[0]}~${item.filterId.split("|")[1]}*${item.type}*${item.value}*${item.subType}`;
        const filters = String(listFilter.current).split(',');
        const index = filters.indexOf(newListFilter);
        if (index === -1) {
            // Not found, add it
            listFilter.current = filters.length > 0 && filters[0] !== "" ? `${listFilter.current},${newListFilter}` : newListFilter;
        } else {
            // Found, remove it
            filters.splice(index, 1);
            listFilter.current = filters.join(',');
        }
        let listFilters = `${listSort.current},${listFilter.current}`
        navigate(
            `/advanced-hotel-search/?resultType=${payload.resultType}&city=${payload.city}&cityName=${payload.cityName}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&listFilters=${listFilters}&domestic=${payload.domestic}`
        );
    }
    return(   
    <>
        <div className="lg:w-3/4 flex items-center justify-between">
            <div className="font-bold text-md">{amenities?.title}</div>
            {showAmenities ?(
                <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
            ) : (
                <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
            )}
        </div>
        {showAmenities && (
            <div>
                {amenities?.list.map((item, index) => (
                <div key={index}>
                    <Checkbox 
                        color='success'
                        onClick={() => toggleListFilter(item)} 
                        label={item.text}
                        checked={String(listFilter.current).includes(`${item.filterId.split("|")[0]}~${item.filterId.split("|")[1]}*${item.type}*${item.value}*${item.subType}`)}
                        />
                </div>
            ))}
            </div>
        )}        
        </>
    )
}

function ProperStyleFilter({properties, listFilter, payload, listSort}){
    const [showAmenities, setShowAmenities] = useState(false);
    const navigate = useNavigate();

    const toggleListFilter = (item) => {
        const newListFilter = `${item.filterId.split("|")[0]}~${item.filterId.split("|")[1]}*${item.type}*${item.value}*${item.subType}`;
        const filters = String(listFilter.current).split(',');
        const index = filters.indexOf(newListFilter);
        if (index === -1) {
            // Not found, add it
            listFilter.current = filters.length > 0 && filters[0] !== "" ? `${listFilter.current},${newListFilter}` : newListFilter;
        } else {
            // Found, remove it
            filters.splice(index, 1);
            listFilter.current = filters.join(',');
        }
        let listFilters = `${listSort.current},${listFilter.current}`
        navigate(
            `/advanced-hotel-search/?resultType=${payload.resultType}&city=${payload.city}&cityName=${payload.cityName}&provinceId=${payload.provinceId}&countryId=${payload.countryId}&districtId=${payload.districtId}&checkin=${payload.checkin}&checkout=${payload.checkout}&barCurr=USD&cityType=${payload.cityType}&latitude=${payload.latitude}&longitude=${payload.longitude}&searchCoordinate=${payload.searchCoordinate}&crn=${payload.crn}&adult=${payload.adult}&children=${payload.children}&listFilters=${listFilters}&domestic=${payload.domestic}`
        );
    }

    return(   
    <>
        <div className="lg:w-3/4 flex items-center justify-between">
            <div className="font-bold text-md">{properties?.title}</div>
            {showAmenities ?(
                <ChevronUpIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer ml-20" aria-hidden="true" />
            ) : (
                <ChevronDownIcon onClick={() => setShowAmenities(!showAmenities)} className="h-5 w-5 flex-shrink-0 text-gray-900 group-hover:text-gray-500 cursor-pointer" aria-hidden="true" />
            )}
        </div>
        {showAmenities && (
            <div>
                {properties?.list.map((item, index) => (
                <div key={index}>
                    <Checkbox 
                        variant='outlined'
                        color='success'
                        onClick={() => toggleListFilter(item)}
                        label={item.text}
                        checked={String(listFilter.current).includes(`${item.filterId.split("|")[0]}~${item.filterId.split("|")[1]}*${item.type}*${item.value}*${item.subType}`)}
                    />
                </div>
            ))}
            </div>
        )}        
        </>
    )
}