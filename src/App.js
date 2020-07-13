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
    .then(values => this.props.fetch(values))
    .catch(errors => console.log(errors))
  }

  render(){
    return (
      <div className="App">
        <header>
          <h1>Budget Tracker</h1>
        </header>
        <main>
          {/* <AnalysisHomePage />  */}
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetch: (combinedFetchResult) => dispatch({ type: "FETCH", payload: combinedFetchResult})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
