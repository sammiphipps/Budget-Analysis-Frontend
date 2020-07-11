import React, {Component} from 'react';
import './AnalysisHomePage.css';

export default class AnalysisHomePage extends Component {

    parseAmount = (amount) => {
        return parseFloat(amount.replace(/(^\$|,)/g,''))
    }

    findThreeLargestCategoryAmounts = (categoryId) => {
        const categoryTransactions = this.props.transactions.filter(transaction => {
            return transaction.relationships.category.data.id === categoryId
        })

        const categoryTransactionSortedByAmount = categoryTransactions.sort((a,b) => {
            return this.parseAmount(b.attributes.amount) - this.parseAmount(a.attributes.amount)
        })
        
        if(categoryTransactionSortedByAmount.length > 3) {
            return categoryTransactionSortedByAmount.slice(0, 3)
        } else {
            return categoryTransactionSortedByAmount
        }
    }

    showThreeLargestCategoryAmounts = (categoryId) => {
        const largestItems = this.findThreeLargestCategoryAmounts(categoryId)
        return <table>
            <tbody>
            {
                largestItems.map(item => {
                    return <tr key={item.id}>
                        <td>{item.attributes.description}</td>
                        <td>{item.attributes.amount}</td>
                    </tr>
                })
            }
            </tbody>
        </table>
    }

    findCategoryTotalsForMonth = (month) => {
        const groupMonthTransationsByCategory = this.findTransactionsForMonthByCategory(month)
        const categoryTransactionTotals = Object.keys(groupMonthTransationsByCategory).map( category => {
            const categoryTransactions = groupMonthTransationsByCategory[category]
            const categoryTotal = categoryTransactions.reduce((total, transaction) => {
                return total += this.parseAmount(transaction.attributes.amount)
            }, 0)  
            return categoryTotal
        })
        return Object.keys(groupMonthTransationsByCategory).map((category, index) => {
            const categoryHash = {}
            categoryHash["category"] = category
            categoryHash["totalAmountSpent"] = categoryTransactionTotals[index]
            return categoryHash
        })
    }

    findTransactionsForMonthByCategory = (month) => {        
        const monthTransactions = this.filterTransactionsByMonth(month)
        return this.groupByCategory(monthTransactions)
    }

    filterTransactionsByMonth = (month) => {
        return this.props.transactions.filter(transaction => {
            const splitTransactionDate = transaction.attributes.date.split('-')
            const transactionDate = new Date(splitTransactionDate[0], splitTransactionDate[1] - 1, splitTransactionDate[2])
            return (transactionDate.getMonth() + 1) === month
        })
    }

    groupByCategory = (array) => {
        return  array.reduce((result, element) => {
            const categoryName = this.findCategoryName(element.relationships.category.data.id)
            if (!result[categoryName]) {
                result[categoryName] = [];
            }
            result[categoryName].push(element);
            return result
        }, {})
    }


    findCategoryName = (categoryId) => {
        const filteredCategory = this.props.categories.filter(category => category.id === categoryId)
        return filteredCategory[0].attributes.name
    }

    render(){
        const {categories, transactions} = this.props
        return (
            <div id="AnalysisHomePage">
                <div id="graphs">
                    <div id="lineGraph">
                        <p>Budget vs Spent for the year will go here</p>
                        {
                            transactions.length !== 0
                                ? console.log(this.findCategoryTotalsForMonth(6))
                                : ''
                        }
                    </div>
                    <div id="pieChart">Pie Chart detailing how much was spent for each category for the month will go here.</div>
                </div>
                <div id="categorySpending">
                    {
                        categories.filter(category => {
                            return category.relationships.transactions.data.length !== 0
                        }).map(category => {
                            return <div key={category.id} id={category.attributes.name}>
                                <h3>{category.attributes.name}</h3>
                                {this.showThreeLargestCategoryAmounts(category.id)}
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}