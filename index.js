// CJS
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express(); 
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'rajputsingh7'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

//Inserting new data.
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1; i<=100; i++){
//   data.push(getRandomUser());
// };

app.listen("8080", () => {
console.log("server is listening to port");
});

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try{
    connection.query(q,(err, result) => {
        if(err) throw err;
        let count = (result[0] ["count(*)"]);
        res.render("home.ejs", {count});
    });
} catch(err){
    console.log(err)
    res.send("Some errors in data");
}
});

//Home page
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try{
    connection.query(q,(err, users) => {
        if(err) throw err;
        console.log(users);
        res.render("showusers.ejs", {users});
    });
} catch(err){
    console.log(err)
    res.send("Some errors in data");
}
}); 

//Edit

app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id="${id}"`;

  try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        console.log(user);
        res.render("edit.ejs", {user}); 
    });
} catch(err){
    console.log(err)
    res.send("Some errors in data");
}
});


//Update route
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id="${id}"`;
  let {password: fromPass, username: newUsername} = req.body;
  try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];

        if(fromPass != user.password){
          res.send("Wrong password!");  
        }
        else{
          let q2 = `UPDATE user SET username='${newUsername}' WHERE id="${id}"`;
          connection.query(q2, (err, result) => {
            if(err) throw err;
            res.send(result);
          });
        }
    });
} catch(err){
    console.log(err)
    res.send("Some errors in data");
}
});

//ADD user
app.get("/user/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/user/add", (req, res) => {
  let { id, username, email, password } = req.body;
  let q = `INSERT INTO user(id, username, email, password) VALUES (?, ?, ?, ?)`;
  let values = [id, username, email, password];

  try {
    connection.query(q, values, (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error adding new user");
      } else {
        console.log("new user added successfully");
        res.redirect("/user");
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some errors in adding");
  }
})

// connection.end();

