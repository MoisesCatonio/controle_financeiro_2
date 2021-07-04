import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import ManageErrors from './ManageErrors';

class ExpenseForm extends Component{
	constructor(){
		super();
		this.state = {lista: [], description:'', value:'', date:''};
		this.enviaForm = this.enviaForm.bind(this);
		this.setDescription = this.setDescription.bind(this);
		this.setValue = this.setValue.bind(this);
		this.setDate = this.setDate.bind(this);

		this.guardaDados = {};
	}

	enviaForm(evento){
    evento.preventDefault();
    console.log("dados sendo enviados");

    $.ajax({
      url: "https://controlefinanceiro-api-moises2.herokuapp.com/api/expenses",

      headers: {
      	"access-token": sessionStorage.getItem('token'),
      	"uid": sessionStorage.getItem('uid'),
      	"client": sessionStorage.getItem('client'),
      },

      contentType: 'application/json',
      dataType: 'json',
      accept: 'application/vnd.projetofase8.v2',
      

      type: 'post',
      data: JSON.stringify({description: this.state.description, value: this.state.value, date: this.state.date}),

      success: function(resposta){
        console.log("Success");
        console.log(resposta);

        $.each(resposta, function(index, value){
          this.guardaDados[index] = value;
        }.bind(this));

        setTimeout(function(){
        var novaLista = this.state.lista;
        novaLista.push(this.guardaDados);
        //this.setState({lista:novaLista});
        PubSub.publish('atualiza-lista-despesas', novaLista);
        alert("Despesa cadastrada com sucesso!");
        this.setState({description:'', value:'', date:''});
        this.guardaDados = {};
        }.bind(this),10);
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

        // var token = this.guardaDados.token;
        // var client = this.guardaDados.client;
        // var uid = this.guardaDados.uid;

        // PubSub.publish('access-token', token);
        // PubSub.publish('client', client);
        // PubSub.publish('uid', uid);
      }.bind(this),

      error: function(resposta){
        if(resposta.status === 401){
        	new ManageErrors().publishErrorsValidation(resposta.responseJSON);
        }

        if(resposta.status === 422){
        	new ManageErrors().publishErrorsGE(resposta.responseJSON);
        }
      },

    });
  }

  setDescription(evento){
  	this.setState({description:evento.target.value});
  }

  setValue(evento){
  	this.setState({value:evento.target.value});
  }

  setDate(evento){
  	this.setState({date:evento.target.value});
  }

	render(){
		return(
			<div>
				<h1 class="h2">Cadastro de Despesas</h1>
				<form onSubmit={this.enviaForm} method="post">
					<InputCustomizado type="text" id="description" name="description" value={this.state.description} onChange={this.setDescription} placeholder="Descrição" label="Descrição"/>
					<InputCustomizado type="number" id="value" name="value" value={this.state.value} onChange={this.setValue} placeholder="Valor" label="Valor"/>
					<InputCustomizado type="date" id="date" name="date" value={this.state.date} onChange={this.setDate} placeholder="Data" label="Data"/>
					<button type="submit" class="btn btn-primary">Cadastrar</button>
				</form>
			</div>

		);
	}
}

class ExpenseTable extends Component{

	constructor(){
		super();
		this.state = {lista:[]};
	}

	componentDidMount(){

		PubSub.subscribe('atualiza-lista-despesas', function(topico, novaLista){
			this.setState({lista:novaLista});
		}.bind(this))

		PubSub.subscribe('erro-validacao-GE', function(topico, erro){
			alert(erro);
		})
	}
	render(){
		return(
			<div className="table-responsive">
			<h2>Despesas</h2>
			<table className="table table-striped table-sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>Descrição</th>
						<th>Valor</th>
						<th>Data</th>
					</tr>
				</thead>
				<tbody>
					{
						this.state.lista.map(function(expense){
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

export default class Expense extends Component{
	render(){
		return(
			<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
				<br/>
				<ExpenseForm/>
				<br/>
				<ExpenseTable/>
			</main>
		);
	}
}