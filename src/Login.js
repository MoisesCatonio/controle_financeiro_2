import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import ManageErrors from './ManageErrors';

export default class Login extends Component{

	constructor(){
		super();
		this.state = {email:'', password:''};
		this.enviaForm = this.enviaForm.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setPassword = this.setPassword.bind(this);

		this.guardaDados = {}
	}

	enviaForm(evento){
    evento.preventDefault();
    console.log("dados sendo enviados");

    $.ajax({
      url: "https://controlefinanceiro-api-moises2.herokuapp.com/api/auth/sign_in",

      contentType: 'application/json',
      dataType: 'json',
      accept: 'application/vnd.projetofase8.v2',

      type: 'post',
      data: JSON.stringify({email: this.state.email, password: this.state.password}),

      success: function(resposta){
        console.log("Success");
        console.log(resposta);
        alert("Login efetuado com sucesso");
      },

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
      },

    });
  }

	setEmail(evento){
		this.setState({email:evento.target.value}); 
	}

	setPassword(evento){
	    this.setState({password:evento.target.value});
	}

	componentDidMount(){
		PubSub.subscribe('erro-validacao-login', function(topico, erro){
			alert(erro);
		})
	}

	render(){
		return(
			<main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
				<br/>
					<h1 class="display-4">Login</h1>
					<form onSubmit={this.enviaForm} method="post">
						<InputCustomizado type="email" name="email" value={this.state.email} onChange={this.setEmail} placeholder="E-mail" label="E-mail"/>
						<InputCustomizado type="password" name="password" value={this.state.password} onChange={this.setPassword} placeholder="Senha" label="Senha"/>
						<button type="submit" class="btn btn-primary">Entrar</button>
					</form>
			</main>
		);
	}
}