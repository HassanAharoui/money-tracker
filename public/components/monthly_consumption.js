const popularProductsBtn = document.querySelector('#popular-products');
const allProductsBtn = document.querySelector('#all-products');

async function getData() {
	const response = await fetch('http://localhost:5000/consumption/month');
	const data = await response.json();

	return data ;

}

function rankProducts(products) {
	// debugger;
	const rankedProducts = [] ;
	let cost = 0;
	let map = new Map();

	for (let i = 0; i < products.length; i++) {
		if(!map.has(products[i].item)) {
			for (let j = 0; j < products.length; j++) {
				if(products[i].item == products[j].item) {
					cost += +products[j].price;
				}
			}
			rankedProducts.push({
				item : products[i].item ,
				price : cost 
			})
			map.set(products[i].item,true);
			cost = 0 ;
		}
	}
	// console.log(rankedProducts)
	return rankedProducts ;
}

popularProductsBtn.addEventListener('click',() => {
	document.getElementById('main').textContent = 'popular Products';

	getData()
		.then(res => {
			console.log(res)
			console.log(rankProducts(res))
		});


})

allProductsBtn.addEventListener('click',() => {
	document.getElementById('main').textContent = 'all Products';
})

