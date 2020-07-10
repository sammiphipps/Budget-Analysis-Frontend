import React, {Component} from 'react';
import './AnalysisHomePage.css';

export default class AnalysisHomePage extends Component {
    findThreeLargestCategoryAmounts = (transactions, categoryId) => {
        const categoryTransactions = transactions.filter(transaction => {
            return transaction.relationships.category.data.id === categoryId
        })

        const categoryTransactionSortedByAmount = categoryTransactions.sort((a,b) => {
            return parseFloat(b.attributes.amount.replace(/(^\$|,)/g,'')) - parseFloat(a.attributes.amount.replace(/(^\$|,)/g,''))
        })
        
        if(categoryTransactionSortedByAmount.length > 3) {
            return categoryTransactionSortedByAmount.slice(0, 3)
        } else {
            return categoryTransactionSortedByAmount
        }
    }

    showThreeLargestCategoryAmounts = (transactions, categoryId) => {
        const largestItems = this.findThreeLargestCategoryAmounts(transactions, categoryId)
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

    render(){
        const {categories, transactions} = this.props
        return (
            <div id="AnalysisHomePage">
                <div id="lineGraph">Budget vs Spent for the year will go here</div>
                <div id="pieChart">Pie Chart detailing how much categories were spent will go here.</div>
                <div id="categorySpending">
                    {
                        categories.map(category => {
                            return <div key={category.id} id={`#${category.attributes.name}`}>
                                <h3>{category.attributes.name}</h3>
                                {this.showThreeLargestCategoryAmounts(transactions, category.id)}
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}