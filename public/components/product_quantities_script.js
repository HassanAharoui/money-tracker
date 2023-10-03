const table  = document.getElementById('table-products');

async function getAllProducts() {
	const response = await fetch('/api/products');
	const data = await response.json();
	return data ;
}


// console.log(table);
function addTableRow() {
	let tr = '';
	let totalCost = 0 ;
	getAllProducts()
		.then(data => {
			// console.log(typeof data[1].date)
			for(let i = 0; i < data.length; i++) {

				tr += `
					<tr>
						<td>${(data[i].item) || 'not exist'}</td>
						<td>${(data[i].quantity) || 'not exist'}</td>
						<td>${(data[i].type) || 'not exist'}</td>
						<td>${(data[i].price) || 'not exist'}</td>
						<td>${
							(
								new Date(data[i].date).getFullYear()+
								'/'+(new Date(data[i].date).getMonth() + 1)+
								'/' +new Date(data[i].date).getDate()) 
							|| 'not exist'
						}</td>
						<td>${
							(
								new Date(data[i].date).getHours() + ':' +
								new Date(data[i].date).getMinutes()+ ':' +
								new Date(data[i].date).getSeconds()
							) 
							|| 'not exist'
						}</td>
					</tr>
				`
			}
			// console.log(tr);
			for(let j = 0; j < data.length; j++) {
				totalCost += (Number(data[j].price)) || 0 ;
			}
			tr += `
				<tr>
					<th colspan="3">Total</th>
					<td colspan="3">${totalCost}</td>
				</tr>
			`
			table.innerHTML += tr;
		});
	
}

addTableRow()