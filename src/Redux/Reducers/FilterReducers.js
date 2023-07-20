import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    price: 0,
    filterCategory: [],
    searchQuery: ""
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setPrice: (state , action)=>{
            state.price = action.payload;
        },
        addTofilterCategory: (state , action)=>{
            state.filterCategory.push(action.payload);
        },
        removeFromCategory: (state , action)=>{
            state.filterCategory = state.filterCategory.filter((item)=> item !== action.payload)
        },
        setSearchQuery: (state , action)=>{
            state.searchQuery = action.payload;
        }
    }
});

export const filterReducer = filterSlice.reducer;

export const filterActions = filterSlice.actions;

//selector
export const filterSelector = (state)=> state.filterReducer;