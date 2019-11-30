const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser'); 

app.use(bodyparser.json());

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'codexchange',
	multipleStatements: true
});

mysqlConnection.connect((err)=>{
	if(!err)
		console.log('DB connected.');
	else
		console.log('DB connection failed \n Error: '+ JSON.stringify(err,ubdifined,2));

});

app.listen(3000, ()=>console.log('Express server is running at port 3000'));

//Landing page

app.get('/', (req, res)=> {
res.render('login.ejs')
});

app.post('/login', (req,res)=> {
	var name = req.body.name;
	var password = req.body.password;
	mysqlConnection.query('select * from users where name = ?', [name], function(error, result, fields) {
		if(error) {
			res.redirect('/');
		} else {
			if(result.length > 0){
				if(result[0].password == password){
					res.render('dashboard.ejs');
				} else {
					res.send({
						"code":204,
						"success":"Email and password donot match"
					});
				}
			} else {
				res.send({
					"code":204,
					"success":"email doesnot exist"
				});
			}
		}
	});
});


//register

app.get('/register', (req, res)=> {
res.render('reg.ejs')
});

app.post('/register', (req, res)=>{
	var users = {
		"name": req.body.name,
		"password": req.body.password
	}
	mysqlConnection.query('insert into users SET ?', users,
		function (error, result, fields) {
			if(error) {
				console.log("Error occured", error);
				res.redirect('/register');
			} else {
				console.log("the solution is", result);
				res.send({
					"code":200,
					"success":"user registered successfully"
				})
			}
		});
});

//trading page

app.get('/trading', (req, res)=> {
res.render('trading.ejs')
});

//Rules page

app.get('/rules', (req, res)=> {
res.render('rules.ejs')
});


//get all team names with their stocks value

app.get('/teams', (req,res)=>{
	mysqlConnection.query('select * from teams',(err, rows, fields)=>{
		if(!err)
			res.send(rows);
		else
			console.log(err);
	});
});

//get a team names with their stocks value

app.get('/teams/:id', (req,res)=>{
	mysqlConnection.query('select * from teams where teamname = ?',[req.params.id],(err, rows, fields)=>{
		if(!err)
			res.send(rows);
		else
			console.log(err);
	});
});

//delete team

app.delete('/teams/:id', (req,res)=>{
	mysqlConnection.query('delete from teams where teamname = ?',[req.params.id],(err, rows, fields)=>{
		if(!err)
			res.send('deleted successfully');
		else
			console.log(err);
	});
});


//insert stock value

app.post('/teams', (req,res)=>{
	let team = req.body;
	var sql = "set @teamname = ?; set @stocks= ?; call teamsAddOrUpdate(@teamname,@stocks);";
	mysqlConnection.query(sql,[team.teamname, team.stocks],(err, rows, fields)=>{
		if(!err)
			alert("Order placed!");
		else
			console.log(err);
	});
});

//insert from execute button

app.post('/trading', (req,res)=>{
	let team = req.body;
	var sql = "set @teamname = ?; set @stocks= ?; call teamsAddOrUpdate(@teamname,@stocks);";
	mysqlConnection.query(sql,[team.teamname, team.stocks],(err, rows, fields)=>{
		if(!err)
			res.render("orderPlaced.ejs");
		else
			res.redirect("/trading");
	});
});

app.get('/logout', (req, res)=> {
res.render("logout.ejs");
});



//route for checking working of procedures

/* app.post('/check', (req,res)=>{
	let team = req.body;
	var sql = "set @flag = ?; call transaction_status(@flag);";
	mysqlConnection.query(sql,[team.flag],(err, rows, fields)=>{
		if(!err)
			res.send(rows);
		else
			console.log(err);
	});
});
*/
