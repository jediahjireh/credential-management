// server.js

// import environment variables
require('dotenv').config();

// import dependencies
const app = require('./index.js');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const OrganisationalUnit = require('./models/OrganisationalUnit.js');

// fetch the MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// notify user if not found
if (!mongoURI) {
  console.error('MongoDB URI is not defined');
  process.exit(1);
}

// connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    // uncomment the line below if database is not populated
    // populateDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// function to populate the database
const populateDatabase = async () => {
  // define sample data with multiple OUs and divisions
  const sampleUsers = [
    ...Array.from({ length: 12 }, (_, i) => ({
      username: `user${i + 1}`,
      password: `password${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      role: i < 5 ? 'normal' : (i < 10 ? 'management' : 'admin'),
      organisationalUnits: [`Unit${(i % 3) + 1}`, i % 4 === 0 ? 'Unit4' : ''],
      divisions: i < 4 ? ['Finances', 'IT'] : (i < 8 ? ['Writing', 'Development'] : ['Development'])
    })),
    {
      username: 'jake',
      password: '1212',
      email: 'jake@gmail.com',
      role: 'admin',
      organisationalUnits: ['Hardware Reviews', 'Opinion Publishing'],
      divisions: ['IT', 'Development']
    },
    {
      username: 'jane',
      password: '1234',
      email: 'jane@gmail.com',
      role: 'management',
      organisationalUnits: ['Software Reviews', 'Education'],
      divisions: ['Writing', 'Development']
    },
    {
      username: 'jules',
      password: '4321',
      email: 'jules@gmail.com',
      role: 'normal',
      organisationalUnits: ['Tech News', 'News Management'],
      divisions: ['Finances', 'Writing']
    }
  ];

  // define sample credentials
  const sampleCredentials = Array.from({ length: 12 }, (_, i) => ({
    name: `Service${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: `password${i + 1}`
  }));

  // define sample divisions
  const sampleDivisions = [
    'Finances',
    'IT',
    'Writing',
    'Development'
  ].map(name => ({
    name,
    users: sampleUsers
      .filter(user => user.divisions.includes(name))
      .map(user => user.username),
    // example credentials for each division
    credentials: sampleCredentials.slice(0, 2)
  }));

  // define sample organisational units with all divisions included
  const sampleOrganisationalUnits = [
    'News Management',
    'Software Reviews',
    'Hardware Reviews',
    'Opinion Publishing',
    'Education',
    'Tech News'
  ].map(name => ({
    name,
    users: sampleUsers
      .filter(user => user.organisationalUnits.includes(name))
      .map(user => user.username),
    divisions: sampleDivisions
  }));

  try {
    // clear existing data
    await User.deleteMany({});
    await OrganisationalUnit.deleteMany({});

    // create users
    await User.insertMany(sampleUsers);

    // create organisational units with embedded divisions
    for (const ou of sampleOrganisationalUnits) {
      const newOU = new OrganisationalUnit({
        name: ou.name,
        users: ou.users,
        divisions: ou.divisions
      });

      await newOU.save();
    }

    console.log('Database populated with sample data');
  } catch (err) {
    console.error('Error populating database:', err);
    process.exit(1);
  }
};

// set port to listen on
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));