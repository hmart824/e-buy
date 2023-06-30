//reducer function
export const reducer = (state , action)=>{
    const {payload} = action;
    switch(action.type){
        case "TOTAL":
        case "SET_DATA":
            return {
                ...state,
                [payload.state]: payload.value
            };
        case "ADD_DATA":
            return{
                ...state,
                [payload.state]: [payload.value , ...state[payload.state]]
            }
        case "REMOVE_DATA":
            return{
                ...state,
                [payload.state]: state[payload.state].filter((el)=> el.id !== payload.id)
            }
        case "SET_FILTER":
            return{
                ...state,
                ...state.filter,
                [payload.state]: payload.value
            }
        default: 
        return state;
    }
}

//Filter Reducer
export const filterReducer = (filterState , action) =>{
    const {payload} = action;
    switch(action.type){
        case "SET_PRICE":
            return {
                ...filterState,
                price: payload
            }
        case "SET_CATEGORY":
            return {
                ...filterState,
                category: payload
            }
        case "SET_SEARCHQUERY":
            return {
                ...filterState,
                searchQuery: payload
            }
        default:
            return filterState;
    }
}