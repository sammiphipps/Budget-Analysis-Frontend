export const transactionReducer = (state = [], action) => {
    switch(action.type){
        case "FETCH": 
            return [...action.payload[2].data]
        default: 
            return state
    }
}
