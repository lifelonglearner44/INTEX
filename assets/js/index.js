const express = require('express');
let app = express();
let path = require('path');

const CircularJSON = require('circular-json'); // Import circular-json

const port = 3000;

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views')); // Change 'views' to the actual directory where your EJS files are stored

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/vendor', express.static(path.join(__dirname, 'assets', 'vendor')));
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));

const knex = require('knex')({
  client: 'pg',
  connection: {
    // If we use AWS, the host will be different
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'postgres',
    password: process.env.RDS_PASSWORD || 'password',
    database: process.env.RDS_DB_NAME || 'SocialMedia_MentalHealth_Database',
    port: process.env.RDS_PORT || 5432,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  },
});

// landing page view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// landing page view
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// FAQ page view
app.get('/pages-faq.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../pages-faq.html'));
});

// pages-contact page view
app.get('/pages-contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../pages-contact.html'));
});

// // old admin report page view
// app.get('/', async (req, res) => {
//   try {
//     // Execute the query and wait for the results
//     const data = await knex.select().from('Social_Platform_Information');

//     // Send the query results as a response
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// new admin report page view with ejs
// app.get('/', async (req, res) => {
//   try {
//     // Execute the query and wait for the results
//     const data = await knex.select().from('Social_Platform_Information');

//     // Render the EJS template and pass the data to it
//     res.render('adminReports', { data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// posting to the database
app.post('/surveyPost', async (req, res) => {
  try {
    const formData = {
      test: req.body.empFirst,
    };

    const result = await knex('Test').insert(formData);
    // console.log('Insert Result:', result);
    // res.send('Data successfully inserted into the "Test" table!');
  } catch (error) {
    console.error('Database Insert Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// with ejs

// app.get('/', async (req, res) => {
//   try {
//     // Fetch data from the database using knex if needed
//     // const data = await knex.select().from('Social_Platform_Information');

//     // Render the EJS template
//     res.render('index', {
//       /* pass data to the template if needed */
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// above with ejs
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
