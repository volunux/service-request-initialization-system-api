const remita = (axios) => {

		const mySecretKey = '6fea9f931a967a2bf4ece218768f0fd08d10254cadd14448304a92f698aea5aebff048d462f87564dcbb42c2897bbf57026a95f58f20a6b23bf6a6f4ac9bad45';
	
	 const initializePayment = (formData , mycallback) => {

		url = 'http://www.remitademo.net/remita/ecomm/finalize.reg';

		//http://www.remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit

		const options = {

						'Authorization' : mySecretKey , 

						'content-type': 'application/json',
						
						'cache-control': 'no-cache' 	};


		formData.hash = '69e5006b6355f75d4ef8b6b71ea9288d50f8ed6f5de5d87634e52e1c2f5f5e388a0cb7e41af15045f827b6d5d77aac5d7a3dbaaeda324a3e82be543dc2aab19e';
		
						console.log(formData);

		const callback = (error , response , body) => {
			
					return mycallback(error , body);	}

		axios({	'method': 'post' ,
															'url' : url , 
																						'data' : formData ,
																																'headers' : options })

			.then((response) => { return mycallback(null , response)		})
			
			.catch((err) => {		return mycallback(err , null) });
	
	 };

	 const verifyPayment = (ref , mycallback) => {

		url = 'https://api.remita.co/transaction/verify/' + encodeURIComponent(ref);

		const options = {
							 
						'Authorization' : 'Bearer ' + mySecretKey,
				
						'content-type': 'application/json',
				
						'cache-control': 'no-cache'		};

		const callback = (error, response, body) => {

				return mycallback(error , body);		}

		axios({	'method': 'get' ,
																'url' : url ,
																							'headers' : options })

			.then((response) => { return mycallback(null , response)		})
			
			.catch((err) => {		return mycallback(err , null) })

	 };
	 
	 return { initializePayment , verifyPayment};

}

module.exports = remita;