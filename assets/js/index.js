const express = require('express');
let app = express();
let path = require('path');
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const knex = require('knex')({
  client: 'pg',
  connection: {
    // If we use AWS, the host will be different
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'bucket_list',
    port: 5432,
  },
});
app.get('/', (req, res) => {
  knex.select().from('country');
});
app.listen(port, () => console.log('Mytravels is listening'));
