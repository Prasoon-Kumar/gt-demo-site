import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { baseUrl as API_BASE_URL } from "../config/key";

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post(`${API_BASE_URL}/api/users/register`, userData)
        .then(res => history.push("/login")) // redirect to login on succ register
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
            
};

// Login - get user token
// Login - get user token
export const loginUser = userData => dispatch => {
    console.log(`${API_BASE_URL}/api/users/login`);
  
    // Add a timestamp as a query parameter to bust the cache
    const timestamp = Date.now();
    const loginUrl = `${API_BASE_URL}/api/users/login?timestamp=${timestamp}`;
  
    axios
      .post(loginUrl, userData)
      .then(res => {
        // Save to localStorage
  
        // Set token to localStorage
        const { token } = res.data;
        console.log(res.data);
        localStorage.setItem("jwtToken", token);
  
        // Set token to auth header
        setAuthToken(token);
  
        // Decode token to get user data
        const decoded = jwt_decode(token, { complete: true });
        console.log(decoded);
        // set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requets
    setAuthToken(false);
    //set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};