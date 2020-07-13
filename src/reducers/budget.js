export const budgetReducer = (state = [], action) => {
    switch(action.type){
        case "FETCH": 
            return [...action.payload[1].data]            
        default:
            return state
    }
}

