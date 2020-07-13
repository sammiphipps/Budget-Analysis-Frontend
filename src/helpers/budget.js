import { store } from '../store'
import { groupByCategory } from './category'

const filterBudgetsByMonth = (month) => {
    const budgets = store.getState().budgets
    return budgets.filter(budget => {
        const splitStartDate = budget.attributes.start_date.split('-')
        const startDate = new Date(splitStartDate[0], splitStartDate[1] - 1, splitStartDate[2])
        const startDateMonth = startDate.getMonth() + 1
        const splitEndDate = budget.attributes.end_date.split('-')
        const endDate = new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2])
        const endDateMonth = endDate.getMonth() + 1
        return startDateMonth === month && endDateMonth === month
    })
}

export const findBudgetsForMonthByCategory = (month) => {
    const monthBudgets = filterBudgetsByMonth(month)
    return groupByCategory(monthBudgets)
}
