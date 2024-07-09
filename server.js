const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const userRoutes = require('./routes/userRoutes')
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/users', userRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});