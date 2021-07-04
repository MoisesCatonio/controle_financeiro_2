import React, { Component } from 'react';
import $ from 'jquery';
import ManageErrors from './ManageErrors';

var totalReceita = 0;
var totalDespesa = 0;

class GainDash extends Component{
	
	constructor(){
		super();
		this.state = {listaGain : []};

		this.guardaDados = {};
	}

	componentDidMount(){
		$.ajax({
		    url: "https://controlefinanceiro-api-moises2.herokuapp.com/api/gains?q[description_cont]=&q[s]=id+ASC",

		    contentType: 'application/json',
		    dataType: 'json',
		    accept: 'application/vnd.projetofase8.v2',

		    headers: {
		      	"access-token": sessionStorage.getItem('token'),
		      	"uid": sessionStorage.getItem('uid'),
		      	"client": sessionStorage.getItem('client'),
	     	},

	     	success: function(resposta){
	      	console.log("Success");
	      	console.log(resposta);

	      	this.setState({listaGain:resposta.data});

	      	var lista = this.state.listaGain;
	      	var listaValor = lista.map((valor) => valor.attributes.value);

	      	for(var i=0; i< listaValor.length; i++){
	      		totalReceita += parseInt(listaValor[i], 10);
	      	}

	      	console.log("Total receita:", totalReceita);
	      	}.bind(this),

		    complete: function(resposta){
	        console.log("Complete");
	        console.log(resposta.getAllResponseHeaders());

	        this.guardaDados.token = resposta.getResponseHeader('access-token');
	        this.guardaDados.client = resposta.getResponseHeader('client');
	        this.guardaDados.uid = resposta.getResponseHeader('uid');
	      
	        sessionStorage.setItem('token', this.guardaDados.token);
	        sessionStorage.setItem('client', this.guardaDados.client);
	        sessionStorage.setItem('uid', this.guardaDados.uid);
		  	}.bind(this),

			error: function(resposta){
				console.log("Error");
				console.log(resposta);

        		if(resposta.status === 401){
        			new ManageErrors().publishErrorsValidation(resposta.responseJSON);
        		}
    		}
	});
	}
	render() {
		return (
			<div class="table-responsive">
				<h2>Receitas</h2>
				<table class="table table-striped table-sm">
					<thead>
						<tr>
							<th>Id</th>
							<th>Descrição</th>
							<th>Valor</th>
							<th>Data</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.listaGain.map(function(gain){
								return(
									<tr key={gain.id}>
										<td>{gain.id}</td>
										<td>{gain.attributes.description}</td>
										<td>{gain.attributes.value}</td>
										<td>{gain.attributes.date}</td>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
		);
	}
}

class ExpenseDash extends Component{
	constructor(){
		super();
		this.state = {listaExpense : []};

		this.guardaDados = {};
	}

	componentDidMount(){
		setTimeout(function(){
			$.ajax({
			    url: "https://controlefinanceiro-api-moises2.herokuapp.com/api/expenses?q[description_cont]=&q[s]=id+ASC",

			    contentType: 'application/json',
			    dataType: 'json',
			    accept: 'application/vnd.projetofase8.v2',

			    headers: {
			      	"access-token": sessionStorage.getItem('token'),
			      	"uid": sessionStorage.getItem('uid'),
			      	"client": sessionStorage.getItem('client'),
		     	},

		     	success: function(resposta){
		      	console.log("Success");
		      	console.log(resposta);

		      	this.setState({listaExpense:resposta});

		      	var lista = this.state.listaExpense;
		      	var listaValor = lista.map((valor) => valor.value);

		      	for(var i=0; i< listaValor.length; i++){
		      		totalDespesa += parseInt(listaValor[i], 10);
		      	}

		      	console.log("Total despesa:", totalDespesa);
		      	}.bind(this),

			    complete: function(resposta){
		        console.log("Complete");
		        console.log(resposta.getAllResponseHeaders());

		        this.guardaDados.token = resposta.getResponseHeader('access-token');
		        this.guardaDados.client = resposta.getResponseHeader('client');
		        this.guardaDados.uid = resposta.getResponseHeader('uid');
		      
		        // sessionStorage.setItem('token', this.guardaDados.token);
		        // sessionStorage.setItem('client', this.guardaDados.client);
		        // sessionStorage.setItem('uid', this.guardaDados.uid);
			  	}.bind(this),

				error: function(resposta){
					console.log("Error");
					console.log(resposta);
					
	        		if(resposta.status === 401){
	        			new ManageErrors().publishErrorsValidation(resposta.responseJSON);
	        		}
	    		}
		});
	}.bind(this),10);
}
	render() {
		return (
			<div class="table-responsive">
				<h2>Receitas</h2>
				<table class="table table-striped table-sm">
					<thead>
						<tr>
							<th>Id</th>
							<th>Descrição</th>
							<th>Valor</th>
							<th>Data</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.listaExpense.map(function(expense){
								return(
									<tr key={expense.id}>
										<td>{expense.id}</td>
										<td>{expense.description}</td>
										<td>{expense.value}</td>
										<td>{expense.date}</td>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
		);
	}
}

export default class Dashboard extends Component{
	
	constructor(){
		super();
		this.state = {saldo:''};
	}

	componentDidMount(){
		setTimeout(function(){
			var teste = totalReceita - totalDespesa;
			this.setState({saldo:teste});
			console.log(this.state.saldo);
		}.bind(this),1000);
	}

	render(){
		return(
			<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
				<br/>
					<div class="container">
						<h1 class="display-4">Dashboard</h1>
						<div class="table-responsive">
							<h2>Saldo</h2>
							<table class="table table-striped table-sm">
							<thead>
								<tr>
									<td><b>{this.state.saldo}</b></td>
								</tr>
							</thead>
							</table>
						</div>
					</div>
					<br/>
					<GainDash/>
					<br/>
					<ExpenseDash/>
			</main>
		);
	}
}