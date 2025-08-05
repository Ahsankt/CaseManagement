import mongoose from 'mongoose';
import { CASE_STATUS, CASE_PRIORITY, DOCUMENT_TYPES, HEARING_TYPES, COURT_TYPES } from '../utils/constants.js';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(DOCUMENT_TYPES),
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  size: Number,
  mimeType: String,
  isVerified: {
    type: Boolean,
    default: false
  }
});

const hearingSchema = new mongoose.Schema({
  hearingDate: {
    type: Date,
    required: true
  },
  hearingTime: {
    type: String,
    required: true
  },
  hearingType: {
    type: String,
    enum: Object.values(HEARING_TYPES),
    required: true
  },
  courtRoom: {
    type: String,
    required: true
  },
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'adjourned', 'cancelled'],
    default: 'scheduled'
  },
  remarks: String,
  adjournmentReason: String,
  nextHearingDate: Date,
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    attended: {
      type: Boolean,
      default: false
    },
    role: String // 'petitioner', 'respondent', 'lawyer', 'witness'
  }]
}, {
  timestamps: true
});

const caseOrderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderType: {
    type: String,
    enum: ['interim', 'final', 'direction', 'notice', 'summons'],
    required: true
  },
  orderText: {
    type: String,
    required: true
  },
  passedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const partySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['petitioner', 'respondent'],
    required: true
  },
  assignedLawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to User with role 'lawyer'
  },
  isMainParty: {
    type: Boolean,
    default: false
  }
});

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    unique: true
    // Will be auto-generated in pre-save hook
  },
  
  // Case Registration Details
  registrationDate: {
    type: Date,
    default: Date.now
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Registrar who registered the case
    required: true
  },
  
  // Case Basic Information
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true,
    maxlength: [500, 'Case title cannot exceed 500 characters']
  },
  caseType: {
    type: String,
    enum: ['civil', 'criminal', 'family', 'commercial', 'property', 'labor', 'constitutional', 'administrative', 'other'],
    required: true
  },
  courtType: {
    type: String,
    enum: Object.values(COURT_TYPES),
    required: true
  },
  
  // Case Parties
  parties: [partySchema],
  
  // Case Assignment
  assignedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  courtNumber: String,
  
  // Case Status and Priority
  status: {
    type: String,
    enum: Object.values(CASE_STATUS),
    default: CASE_STATUS.REGISTERED
  },
  priority: {
    type: String,
    enum: Object.values(CASE_PRIORITY),
    default: CASE_PRIORITY.NORMAL
  },
  
  // Case Details
  description: {
    type: String,
    required: [true, 'Case description is required'],
    maxlength: [5000, 'Case description cannot exceed 5000 characters']
  },
  causeOfAction: {
    type: String,
    maxlength: [2000, 'Cause of action cannot exceed 2000 characters']
  },
  reliefSought: {
    type: String,
    maxlength: [2000, 'Relief sought cannot exceed 2000 characters']
  },
  
  // Financial Details
  courtFees: {
    type: Number,
    default: 0
  },
  disputeAmount: {
    type: Number
  },
  
  // Hearings and Proceedings
  hearings: [hearingSchema],
  nextHearing: {
    date: Date,
    time: String,
    courtRoom: String,
    purpose: String
  },
  
  // Documents and Orders
  documents: [documentSchema],
  orders: [caseOrderSchema],
  
  // Case Timeline and Updates
  caseHistory: [{
    action: String,
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    actionDate: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  
  // Case Completion
  judgmentDate: Date,
  judgmentText: String,
  isDisposed: {
    type: Boolean,
    default: false
  },
  disposalDate: Date,
  
  // Additional Fields
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Notifications
  lastNotificationSent: Date,
  notificationStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  }
  
}, {
  timestamps: true
});

// Indexes for better performance
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ assignedJudge: 1 });
caseSchema.index({ 'parties.user': 1 });
caseSchema.index({ 'parties.assignedLawyer': 1 });
caseSchema.index({ registrationDate: -1 });
caseSchema.index({ 'nextHearing.date': 1 });

// Auto-generate case number
caseSchema.pre('save', async function(next) {
  if (!this.caseNumber) {
    try {
      const year = new Date().getFullYear();
      const count = await this.constructor.countDocuments({
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      });
      
      // Format: COURT/YEAR/SEQUENCE (e.g., DC/2025/0001)
      const courtPrefix = this.courtType === 'district_court' ? 'DC' : 
                         this.courtType === 'high_court' ? 'HC' : 
                         this.courtType === 'supreme_court' ? 'SC' : 
                         this.courtType === 'family_court' ? 'FC' :
                         this.courtType === 'commercial_court' ? 'CC' : 'CT';
      
      this.caseNumber = `${courtPrefix}/${year}/${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating case number:', error);
      return next(error);
    }
  }
  next();
});

// Method to add case history entry
caseSchema.methods.addHistoryEntry = function(action, actionBy, description) {
  this.caseHistory.push({
    action,
    actionBy,
    description,
    actionDate: new Date()
  });
};

// Method to get all lawyers involved in the case
caseSchema.methods.getAllLawyers = function() {
  return this.parties.filter(party => party.assignedLawyer).map(party => party.assignedLawyer);
};

// Method to get petitioners
caseSchema.methods.getPetitioners = function() {
  return this.parties.filter(party => party.role === 'petitioner');
};

// Method to get respondents
caseSchema.methods.getRespondents = function() {
  return this.parties.filter(party => party.role === 'respondent');
};

const Case = mongoose.model('Case', caseSchema);

export default Case;
