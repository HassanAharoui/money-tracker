const express = require("express");
const path = require("path");
const { AceBase } = require('acebase');

// const users = require('./MOCK_DATA.json');

const db = new AceBase('mydb');


const app = express();

const PORT  = process.env.PORT || 5000;

// middleware :
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());


// home page rout :

// --------- using the database :
async function getAllData() {
	const snap = await db.ref('items').get();
	const data = await snap.val();

	return data;
}

function getArrayIndex(target,content) {
	const index = target.findIndex(product => {
		return (
			(product.item == content.item) 
			&& (new Date(product.date).getFullYear() == new Date(content.date).getFullYear()) 
			&& (new Date(product.date).getMonth() == new Date(content.date).getMonth())
			&& (new Date(product.date).getDate() == new Date(content.date).getDate())
		)
	})	

	return index ;
}

// init the DATABASE :


db.ref('items').get()
	.then(snap => {
		if(snap.val() === null) {
			db.ref('items').set([]);
		}
	})

app.get("/api/products",(req,res) => {
	getAllData()
		.then((data)=> res.status(201).json(data))
})


function convertToDay(products,week) {
	const mapProducts = new Map();
	// console.log(products)
	let setProduct = [];
	for(let i = 0; i < products.length; i++) {
		let day = new Date(products[i].date).toString().split(' ')[0];

		// console.log(mapProducts)
		for(let j = 0; j < week.length; j++) {
			// console.log(mapProducts)
			if(day == week[j]) {
				if(mapProducts.has(day)){
					const arr = Array.from(mapProducts.get(day));
					setProduct.push(...arr,products[i]);
					mapProducts.set(day,setProduct);
					break;
				}else{
					mapProducts.set(day,[products[i]])
				}
				
			}
		}
		setProduct = [];
	}
	return mapProducts;
}


// productsOfTheWeek()
function productsOfTheWeek(response) {
	const week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	let date = new Date();
	let subtractDay ;
	let dateFormat = '';
	let result = null;
	for(let i = 0; i < week.length; i++) {
		if(new Date().toString().split(' ')[0] == week[i]){
			console.log('this is the day num ',i)
			subtractDay = i ;
		}
	}
	console.log(date.getDate())
	date = new Date(date.setDate( date.getDate() - subtractDay))
	console.log(date)
	dateFormat = `${date.getFullYear()}-${(date.getMonth() + 1 < 10) ? '0'+(date.getMonth()+1): date.getMonth() + 1}-${(date.getDate() < 10)? '0'+(date.getDate()) : date.getDate()}`
	// console.log(dateFormat);

	db.query('items')
		.filter('date','>',dateFormat)
		.get(snap => {
			// console.log(snap.getValues())
			result = Array.from(convertToDay(snap.getValues(),week),([key,value])=> ({key,value}));
			// console.log(result);

			response.status(201).send(result);
		})

}

// week Route :
app.get('/consumption/week',(req,res) => {
	// The productsOfTheWeek function is sending the response
	// To the Client side.
	productsOfTheWeek(res);
});

app.get('/consumption/month',(req,res) => {
	const currentDate = new Date();

	db.query('items')
		.filter('date','like',`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1 < 10) ? '0'+(currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}-*`)
		.get(snap => {
			res.status(201).json(snap.getValues());
		})
})



app.post('/api/products',(req,res)=> {
	const {item, quantity, type, price, date} = req.body ;
	getAllData()
		.then((data) => {
			console.log(data)
			const index = getArrayIndex(data,req.body);
			console.log(index)
			if(~index) {
				db.ref('items').transaction(snap => {
					const products = snap.val();

					products[index].quantity = (
						Number(products[index].quantity) + Number(quantity)).toString();
					products[index].price = (
						Number(products[index].price) + Number(price)).toString();
					return products;
				})
			}else {
				db.ref('items').transaction(snap => {
					const products = snap.val();

					products.push(req.body);

					return products ;
				})
			}

		})
		.then(() => {
			res.status(200).json(req.body);

		})
})

app.get('/api/users',(req,res) => {
	
	db.query('users')
		.take(10)
		.get()
		.then((snap) => {
			res.status(200).json(snap.getValues());
		})


})

app.listen(PORT,() => {
	console.log("server on port "+PORT);
})