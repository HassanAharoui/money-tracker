function getAllProducts() {
	fetch('/api/products')
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(err => {
			console.log(err);
		})
}

getAllProducts();