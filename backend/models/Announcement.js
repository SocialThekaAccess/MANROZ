import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    link: { type: String, default: '' },
    linkLabel: { type: String, default: '' },
    bgColor: { type: String, default: '#8b1a2e' },
    textColor: { type: String, default: '#ffffff' },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
