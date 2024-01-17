const moment = require('moment');
const Notes = require('../models/Notes');

const announceController = {
  getAnnouncements: async (req, res) => {
    try {
      // Fetch all announcements
      const announcements = await Notes.find();
      res.json(announcements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  addAnnounce: async (req, res) => {
    try {
      const { content, from } = req.body;

      // Format the current local time as "DD/MM/YYYY h:mm A"
      const datetime = moment().format('DD/MM/YYYY h:mm A');

      const newAnnouncement = new Notes({ content, from, datetime });

      await newAnnouncement.save();

      res.status(201).json({ message: 'Announcement added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateAnnounce: async (req, res) => {
    try {
      const { announceId } = req.params;
      const { content } = req.body;

      // Find the announcement by announceId
      const announcement = await Notes.findById(announceId);

      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }

      announcement.content = content;

      await announcement.save();

      res.json({ message: 'Announcement updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteAnnounce: async (req, res) => {
    try {
      const { announceId } = req.params;

      // Delete the announcement by announceId
      const result = await Notes.findByIdAndDelete(announceId);

      if (!result) {
        return res.status(404).json({ message: 'Announcement not found' });
      }

      res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = announceController;