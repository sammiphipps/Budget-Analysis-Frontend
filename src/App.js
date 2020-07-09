import React, {Component} from 'react';
import './App.css';

class App extends Component {
  state = {
    categories: [],
    budgets: [],
    transactions: []
  }

  componentDidMount(){
    Promise.all([
      fetch('http://localhost:3000/categories'),
      fetch('http://localhost:3000/budgets'),
      fetch('http://localhost:3000/transactions')
    ]).then(responses => Promise.all(responses.map(response => response.json())))
    .then(finalVals => {
      this.setState({categories: [...finalVals[0].data]})
      this.setState({budgets: [...finalVals[1].data]})
      this.setState({transactions: [...finalVals[2].data]})
    }).catch(errors => console.log(errors))
  }

  render(){
    return (
      <div className="App">
        <header>
          <h1>Budget Tracker</h1>
        </header>
        <main>

        </main>
      </div>
    )    
  }
}

export default App;
