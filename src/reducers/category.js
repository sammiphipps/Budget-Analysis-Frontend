export const categoryReducer = (state=[], action) => {
    switch(action.type){
        case "FETCH": 
            return [...action.payload[0].data]
        default:
            return state
    }
}
