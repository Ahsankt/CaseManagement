export const USER_ROLES = {
  REGISTRAR: 'registrar',       // Court staff who register cases and assign lawyers/judges
  JUDGE: 'judge',              // Judge who presides over cases and can reschedule
  LAWYER: 'lawyer',            // Legal counsel who can upload documents
  USER: 'user'                 // Regular user who can view their cases
};

export const CASE_STATUS = {
  REGISTERED: 'registered',          // Case just registered
  CASE_ADMITTED: 'case_admitted',    // Case admitted for hearing
  NOTICE_ISSUED: 'notice_issued',    // Notice sent to respondent
  APPEARANCE: 'appearance',          // Parties appeared in court
  EVIDENCE_STAGE: 'evidence_stage',  // Evidence being presented
  ARGUMENTS: 'arguments',            // Final arguments stage
  RESERVED: 'reserved',              // Judgment reserved
  DISPOSED: 'disposed',              // Case finished with judgment
  DISMISSED: 'dismissed',            // Case dismissed
  WITHDRAWN: 'withdrawn'             // Case withdrawn by petitioner
};

export const CASE_PRIORITY = {
  NORMAL: 'normal',
  URGENT: 'urgent',
  HIGH: 'high'
};

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

export const HEARING_TYPES = {
  FIRST_HEARING: 'first_hearing',
  REGULAR_HEARING: 'regular_hearing',
  EVIDENCE_HEARING: 'evidence_hearing',
  ARGUMENT_HEARING: 'argument_hearing',
  JUDGMENT: 'judgment',
  INTERIM_APPLICATION: 'interim_application'
};

export const DOCUMENT_TYPES = {
  PETITION: 'petition',              // Main case petition
  WRITTEN_STATEMENT: 'written_statement', // Respondent's reply
  AFFIDAVIT: 'affidavit',           // Sworn statements
  EVIDENCE: 'evidence',             // Documentary evidence
  COURT_ORDER: 'court_order',       // Orders passed by court
  JUDGMENT: 'judgment',             // Final judgment
  NOTICE: 'notice',                 // Court notices
  APPLICATION: 'application',        // Miscellaneous applications
  VAKALATNAMA: 'vakalatnama',       // Lawyer authorization
  RESPONSE: 'response',             // Response to petition
  SUMMONS: 'summons',               // Court summons
  ORDER: 'order',                   // Court orders
  APPEAL: 'appeal',                 // Appeal documents
  MISCELLANEOUS: 'miscellaneous',   // Other documents
  OTHER: 'other'
};

export const COURT_TYPES = {
  DISTRICT_COURT: 'district_court',
  HIGH_COURT: 'high_court',
  SUPREME_COURT: 'supreme_court',
  FAMILY_COURT: 'family_court',
  COMMERCIAL_COURT: 'commercial_court',
  CONSUMER_COURT: 'consumer_court',
  LABOR_COURT: 'labor_court',
  REVENUE_COURT: 'revenue_court'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification'
};

// Bar Council Registration Status
export const BAR_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEBARRED: 'debarred',
  RETIRED: 'retired'
};

// Court Assignment Status for Judges
export const COURT_ASSIGNMENT_STATUS = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  TRANSFERRED: 'transferred',
  RETIRED: 'retired'
};

// API Response Messages
export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    CASE_CREATED: 'Case created successfully',
    CASE_UPDATED: 'Case updated successfully',
    CASE_DELETED: 'Case deleted successfully',
    DOCUMENT_UPLOADED: 'Document uploaded successfully',
    HEARING_SCHEDULED: 'Hearing scheduled successfully'
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    CASE_NOT_FOUND: 'Case not found',
    INVALID_INPUT: 'Invalid input data',
    SERVER_ERROR: 'Internal server error',
    FILE_UPLOAD_ERROR: 'File upload failed',
    DUPLICATE_CASE: 'Case number already exists',
    INVALID_DATE: 'Invalid date provided'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};
