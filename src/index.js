import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route} from "react-router-dom";
import UserBox from './User';
import Home from './Home';
import Gain from './Gain';
import Expense from './Expense';
import Login from './Login';
import Dashboard from './Dashboard';

ReactDOM.render(
  (<Router>
  	<Route path="/" component={App}/>
  	<Route path="/user" component={UserBox}/>
  	<Route path="/gain" component={Gain}/>
  	<Route path="/expense" component={Expense}/>
  	<Route path="/login" component={Login}/>
  	<Route path="/dashboard" component={Dashboard}/>
  	<Route exact path="/" component={ Home } />
  </Router>),
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
