const saveBtn = document.getElementById('save-btn');

// function getData() {
// 	fetch('api/data')
// 		.then(res => res.json())
// 		.then(data => console.log(data))
// 		.catch(err => console.log(err));
// }


// get data from the server :
async function getDataFromServer() {
	try {
		const response = await fetch('api/products') ;
		const data = await response.json();
		console.log(data);
	}catch(err) {
		throw Error(err);
	}

}

// post data to the server :
const setDataToServer = async (data) => {
	const response = await fetch('/api/products',{
		method : "POST",
		headers : {
			"content-type" : "application/json"
		},
		body : JSON.stringify(data)
	}); 
	console.log(response);
	const parse = await response.json();

	console.log(parse);

}

getDataFromServer();
// set({name : "user1",password:"passowrduser",id : "io887dkk"})

saveBtn.addEventListener('click',(e)=> {
	e.preventDefault();
	const item = document.getElementById('item').value;
	const quantity = document.getElementById('quantity').value;
	const type = document.getElementById('type').value;
	console.log(type);
	const price = document.getElementById('price').value;



	setDataToServer({
		item:item,
		quantity:quantity,
		type:type,
		price:price,
		date : new Date()
	});
})