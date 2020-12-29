const paystack = (axios) => {

		const mySecretKey = process.env.paystack;

		axios.defaults.headers.common['Authorization'] = mySecretKey;
	
	 const initializePayment = (formData , mycallback) => { let url = 'https://api.paystack.co/transaction/initialize';

		const options = {

						'Authorization' : 'Bearer ' + mySecretKey ,

						'content-type': 'application/json',
						
						'cache-control': 'no-cache' };

		const callback = (error , response , body) => { return mycallback(error , body);	}

			axios({	'method': 'post' , 'url' : url , 'data' : formData , 'headers' : options })

			.then((response) => {		return mycallback(null , response);	})
			
			.catch((err) => {		return mycallback(err , null) });
	
	 };

	 const refundPayment = (formData , mycallback) => { let url = 'https://api.paystack.co/refund';

		const options = {

						'Authorization' : 'Bearer ' + mySecretKey ,

						'content-type': 'application/json',
						
						'cache-control': 'no-cache' };

		const callback = (error , response , body) => { return mycallback(error , body);	}

			axios({	'method': 'post' , 'url' : url , 'data' : formData , 'headers' : options })

			.then((response) => {		return mycallback(null , response)	})
			
			.catch((err) => {		return mycallback(err , null) });
	
	 };

	 const verifyPayment = (ref , mycallback) => { let url = 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref);

		const options = {
							 
						'Authorization' : 'Bearer ' + mySecretKey,
				
						'contenrt-type': 'application/json',
				
						'cache-control': 'no-cache'		};

		const callback = (error, response, body) => {	return mycallback(error , body);	}

		return axios({	'method': 'get' ,	'url' : url , 'headers' : options })

			.then((response) => {	return mycallback(null , response)	})
			
			.catch((err) => {	return mycallback(err , null) })	 };
	 
	 return { initializePayment , refundPayment , verifyPayment};

}

module.exports = paystack;