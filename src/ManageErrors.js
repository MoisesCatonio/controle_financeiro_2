import PubSub from 'pubsub-js';

export default class ManageErrors {
	publishErrors(erros){
		for(var i=0; i < erros.errors.full_messages.length; i++){
			var erro = erros.errors.full_messages[i];
			console.log(erro);
			PubSub.publish("erro-validacao", erro);
		}
	}

	publishErrorsValidation(erros){
		for(var i=0; i < erros.errors.length; i++){
			var erro = erros.errors[i];
			console.log(erro);
			PubSub.publish("erro-validacao-login", erro);
		}
	}

	publishErrorsGE(erros){
		for(var i=0; i < erros.errors.description.length; i++){
			var erro = erros.errors.description[i];
			console.log(erro);
			PubSub.publish("erro-validacao-GE", erro);
		}
	}
}