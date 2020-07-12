export const categoryReducer = (state=[], action) => {
    switch(action.type){
        case "FETCH": 
            return [...state, action.payload[0].data]
        default:
            return state
    }
}
