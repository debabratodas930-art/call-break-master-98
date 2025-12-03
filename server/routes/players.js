const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players (sorted by rating descending)
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ rating: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create player
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if player already exists
    const existingPlayer = await Player.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingPlayer) {
      return res.status(400).json({ message: 'Player with this name already exists' });
    }

    const player = new Player({
      name,
      createdAt: new Date(),
      matchesPlayed: 0,
      rank1Count: 0,
      rank2Count: 0,
      rank3Count: 0,
      rank4Count: 0,
      highestScore: 0,
      totalPoints: 0,
      rating: 1000,
    });

    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update player stats
router.patch('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    if (player.matchesPlayed > 0) {
      return res.status(400).json({ message: 'Cannot delete player with match history' });
    }
    
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
