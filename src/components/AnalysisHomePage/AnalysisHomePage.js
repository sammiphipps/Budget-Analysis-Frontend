import React, {Component} from 'react';
import './AnalysisHomePage.css';
import { connect } from 'react-redux'
import { PieChart, Pie, ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell} from 'recharts'
import { parseAmount, sortByDate } from '../../helpers/utils'
import { findCategoryTotalSpentForMonth, groupByCategory, findCategoryColorByName} from '../../helpers/category'
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

        const sortedTransactionTimelineData = sortByDate(transactionTimelineData)
        
        return sortedTransactionTimelineData
    }

    pieChartData = (month) => {
        const totalTransactions = totalTransactionsForMonth(month)
        const categoryTotalSpent = findCategoryTotalSpentForMonth(month)
        return Object.entries(categoryTotalSpent).map(entry => {
            const pieChartData = {}
            pieChartData["category"] = entry[0]
            pieChartData["totalAmountPercentage"] = (entry[1] / totalTransactions) * 100
            pieChartData["color"] = findCategoryColorByName(entry[0])
            return pieChartData
        })
    }

    render(){
        const {categories, transactions, month} = this.props
        const previousMonth = month - 1
        
        return (
            <div id="AnalysisHomePage">
                <div id="graphs">
                    <div id="lineGraph">
                        {
                            transactions.length !== 0 && budgets.length !== 0
                                ? <ComposedChart
                                width={400}
                                height={400}
                                data={this.timelineData(2020)}
                                margin={{
                                  top: 20, right: 30, left: 20, bottom: 5,
                                }}
                              >
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip itemStyle={{color: 'black'}}/>
                                <Legend />
                                {

                                        categories.map(category => {
                                            return <Bar key={category.id} dataKey={category.attributes.name} stackId="a" fill={category.attributes.color}/>
                                        })
                                }
                              </ComposedChart>
                                : ''
                        }
                    </div>
                    <div id="pieChart">
                        {
                            transactions.length !== 0
                                ? <PieChart width={400} height={400}>
                                    <Pie 
                                        data={this.pieChartData(previousMonth)} 
                                        dataKey="totalAmountPercentage" 
                                        nameKey="category" 
                                        label={(entry) => entry.name} 
                                        outerRadius="52%"
                                        fill="#8884d8"
                                    >
                                        {
                                            this.pieChartData(6).map(category => {
                                                return <Cell fill={category.color} />
                                            })
                                        }
                                    </Pie>                                    
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
        budgets: state.budgets,
        month: state.month,
        year: state.year
    }
}

export default connect(mapStateToProps, null)(AnalysisHomePage)