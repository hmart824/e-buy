import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./Reducers/ProductsReducer";
import { userReducer } from "./Reducers/UserReducer";
import { cartReducer } from "./Reducers/CartReducer";
import { ordersReducer } from "./Reducers/OrdersReducer";
import { filterReducer } from "./Reducers/FilterReducers";

export const store = configureStore({
    reducer: {
        productsReducer,
        userReducer,
        cartReducer,
        ordersReducer,
        filterReducer
    }
});