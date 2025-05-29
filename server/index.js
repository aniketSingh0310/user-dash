const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY
  },
  profilePicture: {
    type: DataTypes.STRING // URL to the image on Firebase
  }
});

// Define Follow model for the many-to-many relationship
const Follow = sequelize.define('Follow', {
  // No need for extra columns here if we just want to track the relationship
  // Sequelize will automatically create followerId and followingId
});

User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingId', otherKey: 'followerId' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerId', otherKey: 'followingId' });

// API Endpoints

// Get all users with their follower and following counts and details
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: User,
          as: 'Followers', // Users who follow this user
          attributes: ['id', 'name'], // Only include necessary attributes
          through: { attributes: [] } // Don't include junction table attributes
        },
        {
          model: User,
          as: 'Following', // Users this user follows
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get a single user by ID with follower/following details
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'name'], through: { attributes: [] } },
        { model: User, as: 'Following', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, profilePicture } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const newUser = await User.create({ name, email, phone, dateOfBirth, profilePicture });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { name, email, phone, dateOfBirth, profilePicture } = req.body;
      await user.update({ name, email, phone, dateOfBirth, profilePicture });
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Follow a user
app.post('/users/follow', async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    if (followerId === followingId) {
      return res.status(400).json({ message: 'User cannot follow themselves.' });
    }
    const follower = await User.findByPk(followerId);
    const following = await User.findByPk(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: 'Follower or Following user not found.' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
        where: { followerId: follower.id, followingId: following.id }
    });
    if (existingFollow) {
        return res.status(400).json({ message: 'Already following this user.'});
    }

    await follower.addFollowing(following);
    res.status(200).json({ message: `User ${follower.name} is now following ${following.name}` });

  } catch (error) {
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
});

// Unfollow a user
app.post('/users/unfollow', async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    const follower = await User.findByPk(followerId);
    const following = await User.findByPk(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: 'Follower or Following user not found.' });
    }

    // Check if actually following
     const existingFollow = await Follow.findOne({
        where: { followerId: follower.id, followingId: following.id }
    });
    if (!existingFollow) {
        return res.status(400).json({ message: 'Not following this user.'});
    }

    await follower.removeFollowing(following);
    res.status(200).json({ message: `User ${follower.name} has unfollowed ${following.name}` });

  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('User Management API is running!');
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}); 