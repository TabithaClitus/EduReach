const User = require('../models/User');

exports.getActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('activities');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const sorted = [...(user.activities || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, activities: sorted.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const { icon, text, type, title, description } = req.body;
    const finalTitle = title || text;
    if (!finalTitle || !type) return res.status(400).json({ success: false, message: 'title/text and type required' });
    await User.findByIdAndUpdate(req.user._id || req.user.id, {
      $push: { activities: { icon: icon || '📌', text: finalTitle, title: finalTitle, description: description || '', type } },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
