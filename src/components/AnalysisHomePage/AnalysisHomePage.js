import React, {Component} from 'react';
import './AnalysisHomePage.css';
import { connect } from 'react-redux'
import { PieChart, Pie } from 'recharts'
import { parseAmount } from '../../helpers/utils'
import { findCategoryTotalSpentForMonth } from '../../helpers/category'
import { totalTransactionsForMonth } from '../../helpers/transaction'

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
        const {categories, transactions, month} = this.props
        const previousMonth = month - 1
        return (
            <div id="AnalysisHomePage">
                <div id="graphs">
                    <div id="lineGraph">
                        <p>Budget vs Spent for the year will go here</p>
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
        budgets: state.budgets,
        month: state.month,
        year: state.year
    }
}

export default connect(mapStateToProps, null)(AnalysisHomePage)