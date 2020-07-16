import { store } from '../store'
import { groupByCategory } from './category'
import { parseAmount } from './utils'

const getTransactionDate = (transactionsDate) => {
    const splitTransactionDate = transactionsDate.split('-')
    return new Date(splitTransactionDate[0], splitTransactionDate[1] - 1, splitTransactionDate[2])
}

const findTransactionsByMonth = (month) => {
    const transactions = store.getState().transactions
    return transactions.filter(transaction => {
        const transactionDate = getTransactionDate(transaction.attributes.date)
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

export const findTransactionsByYear = (year) => {
    const transactions = store.getState().transactions
    return transactions.filter(transaction => {
        const splitTransactionDate = transaction.attributes.date.split('-')
        const transactionYear = parseInt(splitTransactionDate[0])
        return transactionYear === year
    })
}

export const groupTransactionsByMonth = (transactionArray) => {
    return transactionArray.reduce((groupedTransactions, transaction) => {
        const transactionDate = getTransactionDate(transaction.attributes.date)
        const year = transactionDate.getFullYear()
        const month = transactionDate.toLocaleString("default", {month: "short"})
        const monthYear = month.concat(" ", year)
        
        if(!groupedTransactions[monthYear]){
            groupedTransactions[monthYear] = []
        }

        groupedTransactions[monthYear].push(transaction)

        return groupedTransactions

    }, {})    
}