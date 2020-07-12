export const transactionReducer = (state = [], action) => {
    switch(action.type){
        case "FETCH": 
            return [...state, action.payload[2].data]
        default: 
            return state
    }
}
