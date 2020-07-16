import React, {Component} from 'react';
import './AnalysisHomePage.css';
import { connect } from 'react-redux'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { parseAmount } from '../../helpers/utils'
import { findCategoryTotalSpentForMonth, groupByCategory} from '../../helpers/category'
import { totalTransactionsForMonth, findTransactionsByYear, groupTransactionsByMonth} from '../../helpers/transaction'

class AnalysisHomePage extends Component {


    findThreeLargestCategoryAmounts = (categoryId) => {
        const categoryTransactions = this.props.transactions.filter(transaction => {
            return transaction.relationships.category.data.id === categoryId
        })

        const categoryTransactionSortedByAmount = categoryTransactions.sort((a,b) => {
            return parseAmount(b.attributes.amount) - parseAmount(a.attributes.amount)
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

    timelineData = (year) => {
        const yearTransactions = findTransactionsByYear(year)

        const transactionPerMonth = groupTransactionsByMonth(yearTransactions)

        const categoryGroupedTransactionPerMonth = Object.entries(transactionPerMonth).reduce((newTransactionHash, entry) => {
            newTransactionHash[entry[0]] = groupByCategory(entry[1])
            return newTransactionHash
        }, {})

        const transactionTimelineData = Object.entries(categoryGroupedTransactionPerMonth).map(entry => {
            const timelineData = {}

            timelineData["month"] = entry[0]

            Object.entries(entry[1]).forEach(categoryTransactionEntry => {
                const categoryTransactionTotal = categoryTransactionEntry[1].reduce((total, transaction) => {
                    return total += parseAmount(transaction.attributes.amount)
                }, 0)
                timelineData[categoryTransactionEntry[0]] = categoryTransactionTotal
            })

            return timelineData
        })

        const sortedTransactionTimelineData = transactionTimelineData.sort((a, b) => {
            const shortMonthName = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            const splitADate = a.month.split(" ")
            const splitBDate = b.month.split(" ")
            const newADate = new Date(splitADate[1], shortMonthName.indexOf(splitADate[0].toLowerCase()), 1)
            const newBDate = new Date(splitBDate[1], shortMonthName.indexOf(splitBDate[0].toLowerCase()), 1)
            return newADate > newBDate ? 1 : -1
        })
        
        return sortedTransactionTimelineData
    }

    pieChartData = (month) => {
        const totalTransactions = totalTransactionsForMonth(month)
        const categoryTotalSpent = findCategoryTotalSpentForMonth(month)
        return Object.entries(categoryTotalSpent).map(entry => {
            const pieChartData = {}
            pieChartData["category"] = entry[0]
            pieChartData["totalAmountPercentage"] = (entry[1] / totalTransactions) * 100
            return pieChartData
        })
    }

    render(){
        const {categories, transactions, budgets} = this.props
        return (
            <div id="AnalysisHomePage">
                <div id="graphs">
                    <div id="lineGraph">
                        <p>Budget vs Spent for the year will go here</p>
                        {
                            transactions.length !== 0 && budgets.length !== 0
                                ? <BarChart
                                width={400}
                                height={400}
                                data={this.timelineData(2020)}
                                margin={{
                                  top: 20, right: 30, left: 20, bottom: 5,
                                }}
                              >
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {

                                        categories.map(category => {
                                            return <Bar dataKey={category.attributes.name} stackId="a" />
                                        })
                                }
                              </BarChart>
                                : ''
                        }
                    </div>
                    <div id="pieChart">
                        {
                            transactions.length !== 0
                                ? <PieChart width={400} height={400}>
                                    <Pie 
                                        data={this.pieChartData(6)} 
                                        dataKey="totalAmountPercentage" 
                                        nameKey="category" 
                                        label={(entry) => entry.name} 
                                        outerRadius="52%"
                                        fill="#8884d8"
                                    />
                                </PieChart>
                                : ''
                        }
                    </div>
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

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        transactions: state.transactions,
        budgets: state.budgets
    }
}

export default connect(mapStateToProps, null)(AnalysisHomePage)