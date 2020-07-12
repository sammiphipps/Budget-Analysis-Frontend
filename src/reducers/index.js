import { combineReducers } from 'redux'
import { categoryReducer } from './category'
import { budgetReducer } from './budget'
import { transactionReducer } from './transaction'

export const reducer = combineReducers({
    categories: categoryReducer,
    budgets: budgetReducer,
    transactions: transactionReducer
})

