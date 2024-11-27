require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const User = require("../models/user");
const { baseOrigin } = require("./url");

/**
 * Generates a JWT token for a user with a short expiration.
 * @param {Object} user - The user object containing user details.
 * @returns {string} A JWT token string.
 */
exports.generateToken = user => {
	return jwt.sign(
		{
			id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			verified: user.verified
		},
		process.env.JWT_SECRET,
		{ expiresIn: "15s" }
	);
};

/**
 * Generates a JWT refresh token for a user with a longer expiration.
 * @param {Object} user - The user object containing user details.
 * @returns {string} A JWT refresh token string.
 */
exports.generateRefreshToken = user => {
	return jwt.sign(
		{
			id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			verified: user.verified
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
};

/**
 * Generates a verification token for a user's email with a custom expiration.
 * @param {Object} userData - The user data containing name, email, and password.
 * @param {string} expiresIn - The duration for which the token is valid.
 * @returns {string} A JWT token string for email verification.
 */
exports.generateVerifyToken = (userData, expiresIn) => {
	return jwt.sign(
		{
			name: userData.name,
			email: userData.email,
			password: userData.password
		},
		process.env.VERIFY_EMAIL,
		{ expiresIn: expiresIn }
	);
};

/**
 * Sends an email verification link to the user's email.
 * @param {Object} userData - The user data containing name, email, and password.
 * @param {string} expiresIn - The duration for which the verification link is valid.
 * @param {Object} res - The response object to send back HTTP responses.
 */
exports.sendEmailVerification = (userData, expiresIn, res) => {
	try {
		let config = {
			service: "gmail",
			auth: {
				user: process.env.GOOGLE_USER,
				pass: process.env.GOOGLE_PASS
			}
		};

		let transporter = nodemailer.createTransport(config);

		let mailgenerator = new Mailgen({
			theme: "default",
			product: {
				name: "Uptrip",
				link: "https://up-trip.vercel.app/"
			}
		});
		const userToken = this.generateVerifyToken(userData, expiresIn);
		const url = `${baseOrigin}/user/${userToken}/verify-email`;

		let response = {
			body: {
				intro: "Email verification",
				outro: `Please click on this link to verify your email ${url}, This link will be expired in 10 minutes`
			}
		};

		let mail = mailgenerator.generate(response);

		let message = {
			from: '"Uptrip" <levelupyourtrip@gmail.com>',
			to: userData.email,
			subject: "Uptrip Email verification",
			html: mail
		};
		transporter.sendMail(message);
	} catch (err) {
		console.error(err);
	}
};

/**
 * Converts a date string from 'YYYYMMDD' format to 'YYYY/MM/DD' format.
 * @param {string} dateString - The date string in 'YYYYMMDD' format.
 * @returns {string} The formatted date string in 'YYYY/MM/DD' format.
 */
exports.convertDateFormat = dateString => {
	const year = dateString.slice(0, 4);
	const month = dateString.slice(4, 6);
	const day = dateString.slice(6, 8);

	// Construct the date string in the desired format
	const formattedDate = `${year}/${month}/${day}`;

	return formattedDate;
};

/**
 * Gets the current time formatted for display in Agoda's specific format and timezone.
 * @returns {string} The current time formatted and URL-encoded.
 */
exports.getDecodedCurrentTimeAgoda = () => {
	const now = new Date();
	const options = {
		weekday: "short",
		month: "short",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		timeZone: "Asia/Bangkok",
		hour12: false
	};

	const formatter = new Intl.DateTimeFormat("en-US", options);
	const formattedDate = formatter.format(now);

	const indochinaTime = `${formattedDate} (Indochina Time)`;

	return encodeURIComponent(indochinaTime);
};

/**
 * Gets the current UTC time minus 7 hours, formatted as an ISO string.
 * @returns {string} The adjusted current time in ISO format.
 */
exports.getCurrentTimeUTC = () => {
	const now = new Date();
	now.setHours(now.getHours() - 7); // Subtract 7 hours from the current time
	return now.toISOString();
};

/**
 * Converts a date string from 'YYYY-MM-DD' to an ISO string representing 17:00 UTC of that day.
 * @param {string} dateString - The date string in 'YYYY-MM-DD' format.
 * @returns {string} The UTC date in ISO format.
 */
exports.convertToUTCFormat = dateString => {
	const [year, month, day] = dateString.split("-");
	const utcDate = new Date(Date.UTC(year, month - 1, day, 17, 0, 0, 0));
	return utcDate.toISOString();
};

/**
 * Calculates the length of stay between two dates.
 * @param {string} checkInDate - The check-in date in 'YYYY-MM-DD' or 'YYYY/MM/DD' format.
 * @param {string} checkOutDate - The check-out date in 'YYYY-MM-DD' or 'YYYY/MM/DD' format.
 * @returns {number} The number of days between the check-in and check-out dates.
 */
exports.calculateLengthOfStay = (checkInDate, checkOutDate) => {
	// Normalize date strings to 'YYYY-MM-DD' format
	const normalizedCheckInDate = checkInDate.replace(/\//g, "-");
	const normalizedCheckOutDate = checkOutDate.replace(/\//g, "-");

	const checkIn = new Date(normalizedCheckInDate);
	const checkOut = new Date(normalizedCheckOutDate);
	const differenceInTime = checkOut.getTime() - checkIn.getTime();
	const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
	return Math.floor(differenceInDays); // Ensure the result is an integer
};

/**
 * Generates a list of property facilities and services.
 * @returns {Object} An object containing a list of property facilities and services.
 */
exports.propertyFacilitiesAndServices = () => {
	return {
		list: [
			{
				status: 0,
				filterId: "3|105",
				value: "105",
				text: "Airport Pick-up Service",
				type: "3",
				icon: "ic_new_fa_pickup",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|65",
				value: "65",
				text: "Spa",
				type: "3",
				icon: "ic_new_fa_spa",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|110",
				value: "110",
				text: "Elevator",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|60",
				value: "60",
				text: "Airport Shuttle Service",
				type: "3",
				icon: "ic_new_fa_shuttle_bus",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|6",
				value: "6",
				text: "Meeting Room",
				type: "3",
				icon: "ic_new_fa_business",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|42",
				value: "42",
				text: "Fitness Room",
				type: "3",
				icon: "ic_new_fa_gym",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|102",
				value: "102",
				text: "Wi-Fi in Public Areas",
				type: "3",
				icon: "ic_new_fa_wifi",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|140",
				value: "140",
				text: "24-Hour Front Desk",
				type: "3",
				icon: "ic_new_fa_24h_service",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|44",
				value: "44",
				text: "Sauna",
				type: "3",
				icon: "ic_new_fa_sauna",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|97",
				value: "97",
				text: "Luggage Storage",
				type: "3",
				icon: "ic_new_fa_baggage",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|147",
				value: "147",
				text: "Restaurant",
				type: "3",
				icon: "ic_new_fa_breakfast",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|656",
				value: "656",
				text: "Parking",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|142",
				value: "142",
				text: "Smoking Area",
				type: "3",
				icon: "ic_new_fa_smoking",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|11",
				value: "11",
				text: "Currency Exchange",
				type: "3",
				icon: "ic_new_conversion_line",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|124",
				value: "124",
				text: "Pets Allowed",
				type: "3",
				icon: "ic_new_fa_pet",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|123",
				value: "123",
				text: "Car Rental",
				type: "3",
				icon: "ic_new_car_rental",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|33",
				value: "33",
				text: "Golf Course",
				type: "3",
				icon: "ic_new_fa_golf",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|656001",
				value: "656001",
				text: "Free parking",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|19",
				value: "19",
				text: "Accessible Rooms Available",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|681",
				value: "681",
				text: "Charging station",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|605",
				value: "605",
				text: "Swimming Pool",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|98",
				value: "98",
				text: "Wake-up Call",
				type: "3",
				icon: "ic_new_fa_wake_up",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|375",
				value: "375",
				text: "Water Park",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|67",
				value: "67",
				text: "Barbecue",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|362",
				value: "362",
				text: "Guest Laundry",
				type: "3",
				icon: "",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|159",
				value: "159",
				text: "Snorkeling",
				type: "3",
				icon: "ic_new_fa_snorkeling",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|47",
				value: "47",
				text: "Sunbathing Area",
				type: "3",
				icon: "ic_new_fa_sunbath",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|146",
				value: "146",
				text: "Exclusive Beach Area",
				type: "3",
				icon: "ic_new_fa_beach",
				subType: "2"
			},
			{
				status: 0,
				filterId: "3|70",
				value: "70",
				text: "Diving",
				type: "3",
				icon: "ic_new_fa_diving",
				subType: "2"
			}
		],
		title: "Property Facilities & Services"
	};
};

/**
 * Generates a list of room facilities and services.
 * @returns {Object} An object containing a list of room facilities and services.
 */
exports.roomFacilitiesAndServices = () => {
	return {
		list: [
			{
				status: 0,
				filterId: "77|198",
				value: "198",
				text: "Kitchen",
				type: "77",
				subType: "2"
			},
			{
				status: 1,
				filterId: "77|247",
				value: "247",
				text: "Balcony",
				type: "77",
				subType: "2"
			},
			{
				status: 1,
				filterId: "77|228",
				value: "228",
				text: "Private Swimming Pool",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|207",
				value: "207",
				text: "Washing Machine",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|Smoking",
				value: "Smoking",
				text: "Smoking room",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|210",
				value: "210",
				text: "Terrace",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|91",
				value: "91",
				text: "Bathtub",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|87",
				value: "87",
				text: "Refrigerator",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|311",
				value: "311",
				text: "Smart Toilet",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|187",
				value: "187",
				text: "Computer",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|192",
				value: "192",
				text: "Coffee Machine",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|512",
				value: "512",
				text: "Chess/Cards Table",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|80",
				value: "80",
				text: "Electric Kettle",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|183",
				value: "183",
				text: "TV",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|236",
				value: "236",
				text: "Jacuzzi",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|107",
				value: "107",
				text: "Air Conditioning",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|635",
				value: "635",
				text: "Garden/Yard",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|445",
				value: "445",
				text: "Private Toilet",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|NoSmoking",
				value: "NoSmoking",
				text: "Non-smoking room",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|extraBed",
				value: "extraBed",
				text: "Extra Beds Available",
				type: "77",
				subType: "2"
			},
			{
				status: 0,
				filterId: "77|extraCrib",
				value: "extraCrib",
				text: "Cribs Available",
				type: "77",
				subType: "2"
			}
		],
		title: "Room Facilities & Services"
	};
};

/**
 * Provides a list of bed options available.
 * @returns {Object} An object containing a list of bed types and their details.
 */
exports.bedOptions = () => {
	return {
		title: "Bed Type",
		subItems: [
			{
				title: "1 Double Bed",
				data: {
					filterId: "4|1",
					type: "4",
					value: "1",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			},
			{
				title: "2 Beds",
				data: {
					filterId: "4|2",
					type: "4",
					value: "2",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			},
			{
				title: "1 Single Bed",
				data: {
					filterId: "4|4",
					type: "4",
					value: "4",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			},
			{
				title: "3 Beds",
				data: {
					filterId: "4|6",
					type: "4",
					value: "6",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			},
			{
				title: "King Bed",
				data: {
					filterId: "4|3",
					type: "4",
					value: "3",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			},
			{
				title: "Multiple Beds",
				data: {
					filterId: "4|5",
					type: "4",
					value: "5",
					subType: "2",
					childValue: "",
					propertyValue: "",
					parentType: "4"
				}
			}
		]
	};
};

/**
 * Generates a list of filters for trips based on the specified filter criteria.
 * @param {string} listFilters - A string identifier for the filter type (e.g., highest rating, lowest price).
 * @returns {Array} An array of filter objects, each containing properties like filterId, value, type, subType, and sceneType.
 */
exports.getListFiltersTrip = listFilters => {
	let baseFilters = [
		{
			filterId: "80|0|1",
			value: "0",
			type: "80",
			subType: "2",
			sceneType: "80"
		},
		{
			filterId: "19|1777",
			type: "19",
			value: "1777",
			subType: "1"
		},
		{
			filterId: "29|1",
			value: "1|2",
			type: "29"
		}
	];

	const filterItems = listFilters.split(",");
	for (let item of filterItems) {
		if (!item) continue;
		const listItem = item.split("*");
		const filter = listItem[0].split("~");
		if (filter[0] === "15") {
			const price = listItem[2].split("~");
			baseFilters.push({
				filterId: `${filter[0]}|${filter[1]}`,
				value: item.split("*")[2],
				type: filter[0],
				subType: listItem[3],
				priceBarMax: 4200000,
				value: `${price[0]}|${price[1] === "4200000"
					? "max"
					: price[1]}`
			});
		} else {
			baseFilters.push({
				filterId: `${filter[0]}|${filter[1]}`,
				value: listItem[2],
				type: listItem[1],
				subType: listItem[3],
				sceneType: listItem[1]
			});
		}
	}

	return baseFilters;
};

exports.formatMinutesToHoursAndMinutes = minutes => {
	// Calculate hours and minutes
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	// Build the formatted string
	let formattedString = "";

	if (hours > 0) {
		formattedString += hours + "h"; // Add hours with 'h' suffix
	}

	if (remainingMinutes > 0) {
		formattedString +=
			(formattedString.length > 0 ? "" : "") + remainingMinutes + "m"; // Add minutes with 'm' suffix
	}

	return formattedString;
};

exports.authenticateToken = async refreshToken => {
	return new Promise((resolve, reject) => {
		jwt.verify(
			refreshToken,
			process.env.JWT_SECRET,
			async (err, decoded) => {
				if (err) {
					reject(err); // Reject the promise if there's an error
				} else {
					try {
						const user = await User.findById(decoded.id);
						resolve(user); // Resolve with the user if found
					} catch (error) {
						reject(error); // Reject the promise if there's an error in fetching the user
					}
				}
			}
		);
	});
};

exports.getIDSessionTrip = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
