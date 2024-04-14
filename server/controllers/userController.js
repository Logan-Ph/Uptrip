require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cheerio = require("cheerio");
const User = require("../models/user");
const {
    generateToken,
    generateRefreshToken,
    sendEmailVerification,
} = require("../utils/helper");
const jwt = require("jsonwebtoken");
const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const {
    tripQuickSearchURL,
    quickSearchHotelTripOptions,
    quickSearchAttractionsTripOptions,
    tripAutoCompletePayload,
    tripAutoCompleteHeaders,
    tripAutoCompleteURL,
    tripAdvancedSearchHeaders,
    tripGetHotelListURLPayload,
    tripGetHotelListIdURL,
} = require("../utils/requestOptions");
puppeteer.use(StealthPlugin());

let options = {
    args: ["--disabled-setuid-sandbox", "--no-sandbox"],
    executablePath:
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
};

exports.homePage = (req, res) => {
    res.send("This is homepage");
};

exports.getLogin = (req, res) => {
    res.send("This is login page");
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return res.status(400).send("Invalid credentials");

    const refreshToken = generateRefreshToken(user);

    const userToken = generateToken(user);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 30 * 60 * 1000,
        secure: true,
    }); // 30 minutes

    return res.status(200).json({
        success: true,
        roles: [2001],
        email,
        _id: user._id,
        accessToken: userToken,
    });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).send("You are not logged in");

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).send("Token is not valid");

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).send("User not found");

        const accessToken = generateToken(user);
        res.status(200).json({ accessToken: accessToken, roles: [2001] });
    });
};

exports.googleLogin = async (req, res) => {
    const { email, given_name, family_name, email_verified, sub, picture } =
        req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const newUser = new User({
            name: `${given_name} ${family_name}`,
            email,
            googleId: sub,
            verified: email_verified,
            img: picture,
        });
        await newUser.save();
        const userToken = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            maxAge: 30 * 60 * 1000,
            secure: true,
        }); // 30 minutes
        return res.status(200).json({
            success: true,
            roles: [2001],
            email: newUser.email,
            _id: newUser._id,
            accessToken: userToken,
        });
    } else if (!user.googleId) {
        return res.status(400).send("Email is already registered");
    } else {
        const userToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            maxAge: 30 * 60 * 1000,
            secure: true,
        }); // 30 minutes
        return res.status(200).json({
            success: true,
            roles: [2001],
            email: user.email,
            _id: user._id,
            accessToken: userToken,
        });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    }); // remove the cookies
    req.session.destroy();
    res.status(200).send("Logged out");
};

exports.signup = async (req, res) => {
    try {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = req.body.email;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address");
        }

        if (await User.findOne({ email: email })) {
            throw new Error("Email already exists.");
        }

        const userData = {
            email: email,
            password: req.body.password,
            name: `${req.body.firstName} ${req.body.lastName}`,
        };

        sendEmailVerification(userData, "10m", res);
        return res
            .status(200)
            .json(
                "Thank you for registering! A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, please check your spam folder."
            );
    } catch (error) {
        return res.status(500).send(error.message || "Error Occured");
    }
};

exports.verifyEmail = async (req, res) => {
    jwt.verify(
        req.params.token,
        process.env.VERIFY_EMAIL,
        async (err, userData) => {
            if (err) return res.status(500).json("Invalid Link");

            if (await User.findOne({ email: userData.email })) {
                return res.status(500).json("Email already exists.");
            }

            const newUser = new User({
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
                name: userData.name,
                verified: true,
            });
            await newUser.save();

            return res.status(200).json("Email verified successfully");
        }
    );
};

exports.quickSearchHotels = async (req, res) => {
    try {
        const { keyword, pageIndex } = req.params;
        const options = quickSearchHotelTripOptions(
            keyword,
            pageIndex || 1,
            18
        );
        const response = await axios.post(tripQuickSearchURL, options);
        const data = response.data.data[0]["itemList"];
        const pageTotal = response.data.total;
        const isLastPage = response.data.isLastPage;
        return res.status(200).json({
            hotels: data,
            pageTotal: pageTotal,
            isLastPage: isLastPage,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.quickSearchAttractions = async (req, res) => {
    try {
        const { keyword, pageIndex } = req.params;
        const options = quickSearchAttractionsTripOptions(
            keyword,
            pageIndex || 1,
            18
        );
        const response = await axios.post(tripQuickSearchURL, options);
        const data = response.data.data[0]["itemList"];
        const pageTotal = response.data.total;
        const isLastPage = response.data.isLastPage;
        return res.status(200).json({
            attractions: data,
            pageTotal: pageTotal,
            isLastPage: isLastPage,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.autocomplete = async (req, res) => {
    try {
        const { keyword } = req.body; // get keyword at body
        const options = tripAutoCompletePayload(keyword); // get the payload options
        const headers = tripAutoCompleteHeaders(); // get the headers
        const response = await axios.post(tripAutoCompleteURL, options, {
            headers: headers,
        }); // send the request
        return res.status(200).json(response.data); // return the response
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.advancedSearchHotels = async (req, res) => {
    const headers = tripAdvancedSearchHeaders();

    const queryParam = {
        city: 286,
        cityName: "Hanoi",
        provinceId: 0,
        countryId: 111,
        districtId: 0,
        checkin: "20240510",
        checkout: "20240518",
        barCurr: "USD",
        cityType : "OVERSEA",
        searchType: "CT",
        searchWord: "Hanoi",
        searchValue: "19|286_19_286_1",
        latitude : "21.030735",
        longitude: "105.852398",
        searchCoordinate:
            "BAIDU_-1_-1_0|GAODE_-1_-1_0|GOOGLE_-1_-1_0|NORMAL_21.030735_105.852398_0",
        crn: 1, // number of rooms 
        adult: 1,
        children: 0, // children=3&ages=0,15,4 -> decoded version
        searchBoxArg: "t",
        travelPurpose: 0,
        ctm_ref: "ix_sb_dl",
        domestic: false,
        listFilters: "80|0|1*80*0*2,29|1*29*1|2*2",
        locale: "en_US",
        curr: "USD",
    };

    const href = `https://us.trip.com/hotels/list?city=${queryParam.city}&cityName=${queryParam.cityName}&provinceId=${queryParam.provinceId}&countryId=${queryParam.countryId}&districtId=${queryParam.districtId}&checkin=${queryParam.checkin}&checkout=${queryParam.checkout}&barCurr=${queryParam.barCurr}&crn=${queryParam.crn}&adult=${queryParam.adult}&children=${queryParam.children}&searchBoxArg=${queryParam.searchBoxArg}&travelPurpose=${queryParam.travelPurpose}&ctm_ref=${queryParam.ctm_ref}&domestic=${queryParam.domestic}&listFilters=${queryParam.listFilters}&locale=${queryParam.locale}&curr=${queryParam.curr}`

    const payload = tripGetHotelListURLPayload(
        [],
        queryParam.checkin,
        queryParam.checkout,
        queryParam.countryId,
        queryParam.provinceId,
        queryParam.city,
        queryParam.districtId || 0,
        queryParam.cityType === "OVERSEA" ? true : false,
        queryParam.roomQuantity || 1,
        queryParam.latitude,
        queryParam.longitude,
        href
    );
    
    const response = await axios.post(tripGetHotelListIdURL, payload , {
        headers: headers,
    });

    return res.status(200).json({hotelList: response.data.hotelList});
};
