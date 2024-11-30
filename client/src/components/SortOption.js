import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function SortOption({payload, listSort, listFilter}) {
    const navigate = useNavigate()

    const updateFiltersAndNavigate = (filters) => {
        listSort.current = filters;
        let listFilters = `${listSort.current},${listFilter.current}`
        let url = `/advanced-hotel-search/?resultType=${payload?.resultType}&city=${payload?.city}&cityName=${payload?.cityName}&provinceId=${payload?.provinceId}&countryId=${payload?.countryId}&districtId=${payload?.districtId}&checkin=${payload?.checkin}&checkout=${payload?.checkout}&barCurr=USD&cityType=${payload?.cityType}&latitude=${payload?.latitude}&longitude=${payload?.longitude}&searchCoordinate=${payload?.searchCoordinate}&crn=${payload?.crn}&adult=${payload?.adult}&children=${payload?.children}&listFilters=${listFilters}&domestic=${payload?.domestic}`;
        if (payload.hotelId) {
            url = `/advanced-hotel-search/?resultType=${payload?.resultType}&hotelId=${payload?.hotelId}&city=${payload?.city}&cityName=${payload?.cityName}&provinceId=${payload?.provinceId}&countryId=${payload?.countryId}&districtId=${payload?.districtId}&checkin=${payload?.checkin}&checkout=${payload?.checkout}&barCurr=USD&cityType=${payload?.cityType}&latitude=${payload?.latitude}&longitude=${payload?.longitude}&searchCoordinate=${payload?.searchCoordinate}&crn=${payload?.crn}&adult=${payload?.adult}&children=${payload?.children}&listFilters=${listFilters}&domestic=${payload?.domestic}`;
        }
        navigate(url);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort by
                    <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    onClick={() => updateFiltersAndNavigate("17~1*17*1*2")}
                                    className={classNames(
                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    Recommended
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    onClick={() => updateFiltersAndNavigate("17~3*17*3*2")}
                                    className={classNames(
                                        active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    Price Low to High
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    onClick={() => updateFiltersAndNavigate("17~4*17*4*2")}
                                    className={classNames(
                                        active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    Price High to Low
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    onClick={() => updateFiltersAndNavigate("17~6*17*6*2")}
                                    className={classNames(
                                        active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    Most popular
                                </Link>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
