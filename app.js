const  express = require("express");
//const pg = require('pg');
const path = require("path");


const {Client } = require('pg');
const client = new Client({
user: 'postgres',
password: 'password',
host: 'localhost',
port: 5432,
database: 'iceCreamShop',
})


//client.connect();




const app = express();
const port = 4444;
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")))


app.get('/api/employees', async (req, res) => {
    const data = await client.query('SELECT * FROM employee ORDER BY id');
    res.json(data.rows);
});

app.get('/api/departments', async (req, res) => {
    const data = await client.query('SELECT * FROM department ORDER BY id');
    res.json(data.rows);
});

app.get('/api/departments/:dpt', async (req, res) => {
  let { dpt } = req.params
  console.log(typeof dpt)
  console.log(dpt.slice(1))
  const data = await client.query('SELECT * FROM department WHERE name = $1 ORDER BY id',[ dpt.slice(1)]);
  console.log(data.rows)
  res.json(data.rows);  
});

app.get('/api/employees/:id', async (req, res) => {
  let { id } = req.params
  console.log(typeof id)
  console.log(id.slice(1))
  const data = await client.query('SELECT * FROM employee WHERE id = $1 ORDER BY id',[ id.slice(1)]);
  console.log(data.rows)
  res.json(data.rows);  
});


app.post('/api/employees', async (req, res) => {
    console.log('Sending Post"');
    const { name, department_id } = req.body;
    console.log("Tried to get there")
    console.log(req.body);
    await client.query("INSERT INTO employee (name, department_id, created_at, updated_at) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )", [ name, department_id ]);
    res.json('success');
});
    
app.post('/api/departments', async (req, res) => {
  console.log('Sending Post"');
  const { name } = req.body;
  console.log("Tried to get there")
  console.log(req.body);
  await client.query("INSERT INTO department (name) VALUES($1)", [ name ]);
  res.json('success');
});

app.delete('/api/departments/:name', async (req, res) =>{  
  let{ name } = req.params;
  console.log(name);
  await client.query('DELETE FROM department WHERE name = $1', [name.slice(1)]);
  res.json('success');
});    

app.delete('/api/employees/:id', async (req, res) =>{
    let{ id } = req.params;
    console.log(id);
    let slicedID= id.slice(1);
    let newID = async()=>parseInt(slicedID);
    let sqlID = await newID();
  await client.query('DELETE FROM employee WHERE id = $1', [sqlID]);
  res.json('success');
});

app.put('/api/employees', async (req, res) => {
  
    const { id, name, dept_id } = req.body
    console.log('id:  ', id, 'name : ', name, 'dept_id: ', dept_id)
  const data = await client.query('UPDATE employee SET name = $1, department_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [name, dept_id, id]);
  res.json(data.rows);
});

app.get("/", async (req, res) =>{
  res.sendFile('/public/index.html');
})
app.get("/departments", async (req, res) =>{
  res.sendFile('public/index.html', { root: __dirname });
})
app.get("/employees", async (req, res) =>{
  res.sendFile('public/index.html', { root: __dirname });
})
   
app.listen(port, () => {
      console.log(`Server running on port ${port}.`);
      client.connect();
});