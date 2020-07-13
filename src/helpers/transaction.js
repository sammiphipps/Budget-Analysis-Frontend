import { store } from '../store'
import { groupByCategory } from './category'
import { parseAmount } from './utils'

const findTransactionsByMonth = (month) => {
    const transactions = store.getState().transactions
    return transactions.filter(transaction => {
        const splitTransactionDate = transaction.attributes.date.split('-')
        const transactionDate = new Date(splitTransactionDate[0], splitTransactionDate[1] - 1, splitTransactionDate[2])
        return (transactionDate.getMonth() + 1) === month
    })
}

export const findTransactionsForMonthByCategory = (month) => {
    const monthTransactions = findTransactionsByMonth(month)
    return groupByCategory(monthTransactions)
}

export const totalTransactionsForMonth = (month) => {
    const monthTransactions = findTransactionsByMonth(month)
    return monthTransactions.reduce((totalSpent, transaction) => {
        return totalSpent += parseAmount(transaction.attributes.amount)
    }, 0)
}