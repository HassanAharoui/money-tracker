const weekMap = new Map([
	['Mon',0], ['Tue',1], ['Wed',2], ['Thu',3], ['Fri',4], ['Sat',5], ['Sun',6]
]);

let result ;// This variable used in setTableRow() function 


async function getData() { 
	const response = await fetch('/consumption/week');
	const data = await response.json();
	console.log(data);
	const sortedData = sortProductsDays(data);
	for(let product of Object.values(sortedData)) {	
		setTableRow(product);
	}	
	
} 


function setTableRow(product) {
	result = '';
	for(let [key,value] of Object.entries(product)) {
		
		if(value instanceof Array) {
			for(let i = 0; i < value.length; i++) {
				result += `
					<tr>
						${(i == 0)? `<td rowspan="${value.length}">${product['key']}</td>`:''}
						<td>${value[i]['item']}</td>
						<td>${(value[i]['quantity']) || 'Not exist'}</td>
						<td>${value[i]['date']}</td>
					</tr>
				`
			
			}
			
		}else{
			if(value['item'] !== undefined){
				result += `
						<tr>
							<td>${product['key']}</td>
							<td>${(value['item']) || 'Not exist'}</td>
							<td>${(value['quantity']) || 'Not exist'}</td>
							<td>${(manipulateDate(value['date'])) || 'Not exist'}</td>
						</tr>
					`
			}
		}

	}
	document.querySelector('table').innerHTML += result;
}

function manipulateDate(date) {

	date = (date) ? new Date(date).toDateString().split(' ').splice(1).join(' ') : undefined;
	return date ;
}

function sortProductsDays(product) {
	const sortedProducts = new Array(7);
	for(let i = 0; i < product.length; i++){
		if(weekMap.has(product[i]['key'])){
			let index = weekMap.get(product[i]['key']);
			sortedProducts[index] = product[i];
		}
	}
	const weekArray = Array.from(weekMap);
	for(let j = 0; j < sortedProducts.length; j++) {

		if(!sortedProducts[j]){
			sortedProducts[j] = {
				key : weekArray[j][0],
				value : {
					item: ''
				}
			};
			// console.log(sortedProducts[j]);
		}
	}	
	console.log(sortedProducts);

	return sortedProducts;
}

getData();