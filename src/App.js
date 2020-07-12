import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux'

// import AnalysisHomePage from './components/AnalysisHomePage/AnalysisHomePage'

class App extends Component {

  componentDidMount(){
    Promise.all([
      fetch('http://localhost:3000/categories'),
      fetch('http://localhost:3000/budgets'),
      fetch('http://localhost:3000/transactions')
    ]).then(responses => Promise.all(responses.map(response => response.json())))
    // .then(finalVals => {
    //   this.setState({categories: [...finalVals[0].data]})
    //   this.setState({budgets: [...finalVals[1].data]})
    //   this.setState({transactions: [...finalVals[2].data]})
    // }).catch(errors => console.log(errors))
  }

  render(){
    return (
      <div className="App">
        <header>
          <h1>Budget Tracker</h1>
        </header>
        <main>
          {/* <AnalysisHomePage 
            // categories={this.state.categories}
            // budgets={this.state.budgets}
            // transactions={this.state.transactions}
          /> */}
        </main>
      </div>
    )    
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    budgets: state.budgets,
    transactions: state.transactions
  }
}

export default connect(mapStateToProps, null)(App);
