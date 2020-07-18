import { store } from '../store'
// import { findBudgetsForMonthByCategory } from './budget'
import { findTransactionsForMonthByCategory } from './transaction'
import { parseAmount } from './utils'

const findCategoryName = (categoryId) => {
    const categories = store.getState().categories
    const filteredCategories = categories.filter(category => category.id === categoryId)
    return filteredCategories[0].attributes.name
}

export const groupByCategory = (array) => {
    return array.reduce((result, element) => {
        const categoryName = findCategoryName(element.relationships.category.data.id)
        
        if (!result[categoryName]) {
            result[categoryName] = []
        }

        result[categoryName].push(element)
        
        return result
    }, {})
}

const findCategoryTotal = (categoryObject) => {
    return Object.entries(categoryObject).reduce((newObject, [category, array]) => {
        newObject[category] = array.reduce((total, element) => {
            return total += parseAmount(element.attributes.amount)
        }, 0)
        return newObject
    }, {})
}

export const findCategoryTotalSpentForMonth = (month) => {
    const groupMonthTransactionsByCategory = findTransactionsForMonthByCategory(month)
    return findCategoryTotal(groupMonthTransactionsByCategory)
}

// const findCategoryBudgetTotalForMonth = (month) => {
//     const groupBudgetsForMonthByCategory = findBudgetsForMonthByCategory(month)
//     return findCategoryTotal(groupBudgetsForMonthByCategory)
// }

export const findCategoryColorByName = (name) => {
    const categories = store.getState().categories

    const filteredCategory = categories.filter(category => {
        return category.attributes.name.toLowerCase() === name.toLowerCase()
    })

    return filteredCategory[0].attributes.color
}


