const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  // Client-related fields
  title: {
    type: String,
    default: function () {
      return `Proposal for ${this.clientName || 'Client'}`;
    }
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    trim: true
  },
  clientIndustry: {
    type: String,
    trim: true,
    default: ''
  },

  // Project details
  projectType: String,
  budget: Number,
  requirements: String,

  // Company reference (for logo, name, etc. in PDF)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },

  // AI-generated content (structured JSON)
  aiContent: {
    type: Object,
    default: {}
  },

  // Status & PDF
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
    default: 'Draft'
  },
  pdfUrl: {
    type: String,
    default: ''
  },

  // Optional: can be set by AI or manually
  paymentTerms: {
    type: String,
    default: ''
  },

  // Versioning (for regenerate feature)
  versions: [{
    versionNumber: Number,
    aiContent: Object,
    createdAt: Date
  }],

  // Chat history (for editing conversation)
  chatHistory: [{
    message: String,
    isAdmin: Boolean,
    createdAt: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Proposal', proposalSchema);