import axios from "axios";
import { baseUrl as API_BASE_URL } from "../config/key";

import {
    GET_ERRORS,
    BUY_STOCK,
    SELL_STOCK,
    UPDATE_STOCKS
} from "./types";

const url = "https://www.alphavantage.co/query?";
const func = "function=TIME_SERIES_DAILY&symbol=";
let symbol = "";
const apiKey = "&apikey=6298Z3RV8EEIG05O"
// API ACCESS KEY:  
export const buyStock = (userData, tradeInfo) => dispatch => {
    console.log("userdata",userData);
    console.log("tradeInfo",tradeInfo)
    axios
        .post(`${API_BASE_URL}/api/users/stockRequest`, tradeInfo)
        .then(res => {
            console.log("POST REQUEST")
            symbol = tradeInfo.symbol;
            console.log("endpoint",url + func + symbol + apiKey)
            return axios.get(url + func + symbol + apiKey);
        })
        .then(res => {
            if(!res.data) throw("Improper symbol")
            console.log("POST API CALL")
            const obj = res.data["Time Series (Daily)"];
            console.log("POST OBJ")
            const dateStr = Object.keys(obj)[0];
            console.log("POST DATESTR")
            let info = res.data["Time Series (Daily)"][dateStr];
            if(!info) { 
                console.log("WHOOPS")
                throw("STOCK INFO ERROR"); }

                console.log("UD: " + JSON.stringify(userData))
            const tradeData = {
                userId: userData.id,
                symbol: symbol,
                quantity: tradeInfo.quantity,
                stockInfo: info
            }
            console.log("tD userID: " + tradeData.userId    )
            console.log("BEFORE buyStock")
            axios.post(`${API_BASE_URL}/api/users/buyStock`, tradeData)
            .then(res => {
                console.log("Returning Purchase")
                console.log("response: " + JSON.stringify(res))
                dispatch(returnPurchase(res));
            })

            
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        )
}

export const sellStock = (userData, tradeInfo) => dispatch => {
    axios
        .post(`${API_BASE_URL}/api/users/stockRequest`, tradeInfo)
        .then(res => {
            symbol = tradeInfo.symbol;
            return axios.get(url + func + symbol + apiKey);
        })
        .then(res => {
            const obj = res.data["Time Series (Daily)"];
            const dateStr = Object.keys(obj)[0];
            let info = res.data["Time Series (Daily)"][dateStr];
            if(!info) { throw("STOCK INFO ERROR"); }

            const tradeData = {
                userId: userData.id,
                symbol: symbol,
                quantity: tradeInfo.quantity,
                stockInfo: info
            }
            axios.post(`${API_BASE_URL}/api/users/sellStock`, tradeData)
            .then(res => {
                console.log("res",res);
                dispatch(returnSale(res));
            })
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        )
}

export const returnPurchase = userData => {
    return {
        type: BUY_STOCK,
        payload: userData 
    }
}

export const returnSale = userData => {
    return {
        type: SELL_STOCK,
        payload: userData
    }
}

export const updateStocks = (userData,tradeInfo) => dispatch => {

    const data = {
        id: userData.id,
        ticker_symbol:tradeInfo.symbol,
        quantity:tradeInfo.quantity
    }
    console.log("postRequest",`${API_BASE_URL}/api/users/updateStocks`)
    axios
    .post(`${API_BASE_URL}/api/users/updateStocks`, {data})
    .then(res => {
        dispatch(returnUpdate(res));
    })

}

export const returnUpdate = userData => {
    console.log("returnUpdate is called with data",userData)
    return {
        type: UPDATE_STOCKS,
        payload: userData
    }
}