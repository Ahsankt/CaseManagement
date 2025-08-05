export const API_BASE_URL = 'http://localhost:5000/api';

// User Roles - Simplified Court System
export const USER_ROLES = {
  REGISTRAR: 'registrar',        // Court registrar who registers cases and assigns lawyers/judges
  JUDGE: 'judge',                // Judge who presides over cases and can reschedule
  LAWYER: 'lawyer',              // Legal practitioner who can upload documents
  USER: 'user'                   // Regular user who can view their cases
};

// Case Status - Real Court Proceedings
export const CASE_STATUS = {
  REGISTERED: 'registered',       // Case registered by registrar
  ADMITTED: 'admitted',           // Case admitted for hearing
  PENDING: 'pending',             // Case pending hearing/judgment
  IN_PROGRESS: 'in_progress',     // Case currently under hearing
  ADJOURNED: 'adjourned',         // Case adjourned to next date
  UNDER_REVIEW: 'under_review',   // Case under judicial review
  DISPOSED: 'disposed',           // Case disposed with judgment
  DISMISSED: 'dismissed',         // Case dismissed
  WITHDRAWN: 'withdrawn',         // Case withdrawn by petitioner
  TRANSFERRED: 'transferred',     // Case transferred to another court
  STAYED: 'stayed',               // Case stayed by court order
  CLOSED: 'closed'                // Case closed/archived
};

// Case Priority Levels
export const CASE_PRIORITY = {
  URGENT: 'urgent',               // Urgent/emergency cases
  HIGH: 'high',                   // High priority cases
  NORMAL: 'normal',               // Normal priority cases
  LOW: 'low'                      // Low priority cases
};

// Case Types in Real Court System
export const CASE_TYPES = [
  { value: 'civil', label: 'Civil Case' },
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'family', label: 'Family Court' },
  { value: 'commercial', label: 'Commercial Dispute' },
  { value: 'property', label: 'Property Dispute' },
  { value: 'labor', label: 'Labor Dispute' },
  { value: 'constitutional', label: 'Constitutional Matter' },
  { value: 'administrative', label: 'Administrative Law' },
  { value: 'other', label: 'Other' }
];

// Court Types
export const COURT_TYPES = [
  { value: 'district_court', label: 'District Court' },
  { value: 'high_court', label: 'High Court' },
  { value: 'supreme_court', label: 'Supreme Court' },
  { value: 'family_court', label: 'Family Court' },
  { value: 'commercial_court', label: 'Commercial Court' },
  { value: 'consumer_court', label: 'Consumer Court' },
  { value: 'labor_court', label: 'Labor Court' },
  { value: 'revenue_court', label: 'Revenue Court' }
];

// Hearing Types
export const HEARING_TYPES = [
  { value: 'first_hearing', label: 'First Hearing' },
  { value: 'regular_hearing', label: 'Regular Hearing' },
  { value: 'evidence_hearing', label: 'Evidence Hearing' },
  { value: 'argument_hearing', label: 'Argument Hearing' },
  { value: 'judgment', label: 'Judgment Delivery' },
  { value: 'interim_application', label: 'Interim Application' }
];

// Priority Options with Colors
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
  { value: 'normal', label: 'Normal', color: 'text-blue-600 bg-blue-100' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
];

// Status Options with Colors
export const STATUS_OPTIONS = [
  { value: 'registered', label: 'Registered', color: 'text-gray-600 bg-gray-100' },
  { value: 'admitted', label: 'Admitted', color: 'text-blue-600 bg-blue-100' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'in_progress', label: 'In Progress', color: 'text-blue-600 bg-blue-100' },
  { value: 'adjourned', label: 'Adjourned', color: 'text-orange-600 bg-orange-100' },
  { value: 'under_review', label: 'Under Review', color: 'text-purple-600 bg-purple-100' },
  { value: 'disposed', label: 'Disposed', color: 'text-green-600 bg-green-100' },
  { value: 'dismissed', label: 'Dismissed', color: 'text-red-600 bg-red-100' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'text-gray-600 bg-gray-100' },
  { value: 'transferred', label: 'Transferred', color: 'text-blue-600 bg-blue-100' },
  { value: 'stayed', label: 'Stayed', color: 'text-purple-600 bg-purple-100' },
  { value: 'closed', label: 'Closed', color: 'text-gray-600 bg-gray-100' }
];

// Role Display Names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.REGISTRAR]: 'Court Registrar',
  [USER_ROLES.JUDGE]: 'Judge',
  [USER_ROLES.LAWYER]: 'Advocate/Lawyer',
  [USER_ROLES.USER]: 'User'
};
