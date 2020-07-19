import { combineReducers } from 'redux'
import { categoryReducer } from './category'
import { budgetReducer } from './budget'
import { transactionReducer } from './transaction'
import { monthReducer } from './month'
import { yearReducer } from './year'


export const reducer = combineReducers({
    categories: categoryReducer,
    budgets: budgetReducer,
    transactions: transactionReducer,
    month: monthReducer, 
    year: yearReducer
})

