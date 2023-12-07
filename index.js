const express = require('express');
let app = express();
var path = require('path');

const port = 3000;

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// Serve static files with express
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const knex = require('knex')({
  client: 'pg',
  connection: {
    // If we use AWS, the host will be different
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'postgres',
    password: process.env.RDS_PASSWORD || 'password',
    database: process.env.RDS_DB_NAME || 'ebdb',
    port: process.env.RDS_PORT || 5432,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  },
});

// landing page view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// landing page view
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// FAQ page view
app.get('/pages-faq.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages-faq.html'));
});

// pages-contact page view
app.get('/pages-contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages-contact.html'));
});

// survey page view
app.get('/survey.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/survey.html'));
});

// new admin report page view with ejs
app.get('/adminReports', async (req, res) => {
  try {
    // Execute the query and wait for the results
    const data = await knex.select().from('Test');

    // Render the EJS template and pass the data to it
    res.render('adminReports', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// posting to the database
app.post('/surveyPost', async (req, res) => {
  try {
    console.log('req.body:', req.body);
    // console.log('req', req);
    const Survey_Responses = {
      Origin: 'Provo',
      Date: new Date(),
      Time: new Date().toTimeString().slice(0, 8),
      Age: req.body.Age,
      Gender: req.body.Gender,
      Relationship_Status: req.body.Relationship_Status,
      Occupation_Status: req.body.Occupation_Status,
      Use_Social_Media: req.body.Use_Social_Media,
      Average_Usage_Hours: req.body.Average_Usage_Hours,
      Without_Specific_Purpose: req.body.Without_Specific_Purpose,
      Distracted_From_Tasks: req.body.Distracted_From_Tasks,
      Restless_Without: req.body.Restless_Without,
      Easily_Distracted: req.body.Easily_Distracted,
      Bothered_By_Worries: req.body.Bothered_By_Worries,
      Difficulty_Concentrating: req.body.Difficulty_Concentrating,
      Comparison_Through_Social_Media: req.body.Comparison_Through_Social_Media,
      Comparison_Feelings: req.body.Comparison_Feelings,
      Validation_From_Social_Media: req.body.Validation_From_Social_Media,
      Depressed_Or_Down: req.body.Depressed_Or_Down,
      Interest_In_Daily_Activities: req.body.Interest_In_Daily_Activities,
      Sleep_Issues: req.body.Sleep_Issues,
    };
    console.log('Survey_Responses:', Survey_Responses);

    const result = await knex('Survey_Responses').insert(Survey_Responses);

    console.log('Insert Result:', result);

    // res.redirect('/index.html');

    res.send('Data successfully inserted into the "Test" table!');
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
