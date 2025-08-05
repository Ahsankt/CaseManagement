import Case from '../models/Case.js';
import User from '../models/User.js';
import { USER_ROLES, CASE_STATUS, MESSAGES, HTTP_STATUS } from '../utils/constants.js';

// @desc    Register new case (Registrar only)
// @route   POST /api/cases
// @access  Private (Registrar only)
export const registerCase = async (req, res) => {
  try {
    // Only registrars can register cases
    if (req.user.role !== USER_ROLES.REGISTRAR) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ 
        success: false,
        message: 'Only court registrars can register new cases' 
      });
    }

    const {
      title,
      description,
      caseType,
      courtType,
      priority = 'normal',
      parties, // Array of party objects with user IDs and roles
      assignedJudge,
      courtNumber,
      causeOfAction,
      reliefSought
    } = req.body;

    // Validate required fields
    if (!title || !description || !caseType || !courtType || !parties || parties.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        success: false,
        message: 'Title, description, case type, court type, and parties are required' 
      });
    }

    // Validate parties structure (must have petitioner and respondent)
    const hasPetitioner = parties.some(party => party.role === 'petitioner');
    const hasRespondent = parties.some(party => party.role === 'respondent');
    
    if (!hasPetitioner || !hasRespondent) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Case must have at least one petitioner and one respondent'
      });
    }

    // Validate party users exist and have correct roles
    for (let party of parties) {
      const user = await User.findById(party.user);
      if (!user) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `User not found for party: ${party.user}`
        });
      }
      if (user.role !== USER_ROLES.USER) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `Only users with 'user' role can be parties in a case`
        });
      }

      // Validate assigned lawyers if present
      if (party.assignedLawyer) {
        const lawyer = await User.findById(party.assignedLawyer);
        if (!lawyer || lawyer.role !== USER_ROLES.LAWYER) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: `Invalid lawyer assignment for ${party.role}`
          });
        }
      }
    }

    // Validate assigned judge if present
    if (assignedJudge) {
      const judge = await User.findById(assignedJudge);
      if (!judge || judge.role !== USER_ROLES.JUDGE) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid judge assignment'
        });
      }
    }
    // Create case
    const newCase = new Case({
      title,
      description,
      caseType,
      courtType,
      priority,
      parties,
      assignedJudge,
      courtNumber,
      causeOfAction,
      reliefSought,
      registeredBy: req.user.id,
      status: CASE_STATUS.REGISTERED
    });

    // Add initial case history entry
    newCase.addHistoryEntry(
      'CASE_REGISTERED',
      req.user.id,
      `Case registered by ${req.user.firstName} ${req.user.lastName}`
    );

    // Save the case (this will trigger the pre-save hook for case number generation)
    await newCase.save();

    // Populate case data
    await newCase.populate([
      { path: 'registeredBy', select: 'firstName lastName employeeId' },
      { path: 'parties.user', select: 'firstName lastName email phone' },
      { path: 'parties.assignedLawyer', select: 'firstName lastName barRegistrationNumber' },
      { path: 'assignedJudge', select: 'firstName lastName courtAssignment' }
    ]);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.CASE_CREATED,
      case: newCase
    });
  } catch (error) {
    console.error('Register case error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Get cases based on user role
// @route   GET /api/cases
// @access  Private
export const getCases = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      caseType, 
      priority,
      search,
      sortBy = 'registrationDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter based on user role
    let filter = { isActive: true };

    // Role-based filtering
    switch (req.user.role) {
      case USER_ROLES.REGISTRAR:
        // Registrar can see all registered cases
        break;
      case USER_ROLES.JUDGE:
        // Judge can see assigned cases or all cases for review
        filter.$or = [
          { assignedJudge: req.user.id },
          { assignedJudge: { $exists: false } } // Unassigned cases
        ];
        break;
      case USER_ROLES.LAWYER:
        // Lawyer can see cases where they represent any party
        filter['parties.assignedLawyer'] = req.user.id;
        break;
      case USER_ROLES.USER:
        // User can see cases they are involved in as petitioner or respondent
        filter['parties.user'] = req.user.id;
        break;
      default:
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN
        });
    }

    // Apply additional filters
    if (status) filter.status = status;
    if (caseType) filter.caseType = caseType;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get cases
    const cases = await Case.find(filter)
      .populate('registeredBy', 'firstName lastName employeeId')
      .populate('assignedJudge', 'firstName lastName courtAssignment')
      .populate('parties.user', 'firstName lastName email')
      .populate('parties.assignedLawyer', 'firstName lastName barRegistrationNumber')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Case.countDocuments(filter);

    res.json({
      success: true,
      cases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCases: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id)
      .populate('registeredBy', 'firstName lastName employeeId')
      .populate('assignedJudge', 'firstName lastName courtAssignment')
      .populate('parties.user', 'firstName lastName email phone address')
      .populate('parties.assignedLawyer', 'firstName lastName barRegistrationNumber practiceAreas')
      .populate('hearings.judge', 'firstName lastName')
      .populate('hearings.attendees.user', 'firstName lastName')
      .populate('orders.passedBy', 'firstName lastName')
      .populate('documents.uploadedBy', 'firstName lastName')
      .populate('caseHistory.actionBy', 'firstName lastName');

    if (!caseData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.ERROR.CASE_NOT_FOUND
      });
    }

    // Check access permissions
    const hasAccess = checkCaseAccess(req.user, caseData);
    if (!hasAccess) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN
      });
    }

    res.json({
      success: true,
      case: caseData
    });
  } catch (error) {
    console.error('Get case by ID error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Assign judge to case (Registrar/Admin only)
// @route   PUT /api/cases/:id/assign-judge
// @access  Private (Registrar/Admin only)
export const assignJudge = async (req, res) => {
  try {
    if (![USER_ROLES.REGISTRAR, USER_ROLES.ADMIN].includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only registrars or admins can assign judges'
      });
    }

    const { id } = req.params;
    const { judgeId, courtNumber } = req.body;

    // Validate judge exists and is a judge
    const judge = await User.findById(judgeId);
    if (!judge || judge.role !== USER_ROLES.JUDGE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid judge ID'
      });
    }

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.ERROR.CASE_NOT_FOUND
      });
    }

    // Update case
    caseData.assignedJudge = judgeId;
    caseData.courtNumber = courtNumber;
    caseData.status = CASE_STATUS.ADMITTED;
    
    // Add history entry
    caseData.addHistoryEntry(
      'JUDGE_ASSIGNED',
      req.user.id,
      `Judge ${judge.firstName} ${judge.lastName} assigned to case`
    );

    await caseData.save();

    res.json({
      success: true,
      message: 'Judge assigned successfully',
      case: caseData
    });
  } catch (error) {
    console.error('Assign judge error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Schedule hearing (Judge/Registrar only)
// @route   POST /api/cases/:id/hearings
// @access  Private (Judge/Registrar only)
export const scheduleHearing = async (req, res) => {
  try {
    if (![USER_ROLES.JUDGE, USER_ROLES.REGISTRAR].includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only judges or registrars can schedule hearings'
      });
    }

    const { id } = req.params;
    const { hearingDate, hearingTime, hearingType, courtRoom, remarks } = req.body;

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.ERROR.CASE_NOT_FOUND
      });
    }

    // Create hearing object
    const hearing = {
      hearingDate: new Date(hearingDate),
      hearingTime,
      hearingType,
      courtRoom,
      judge: caseData.assignedJudge || req.user.id,
      remarks
    };

    caseData.hearings.push(hearing);
    
    // Update next hearing info
    caseData.nextHearing = {
      date: hearing.hearingDate,
      time: hearing.hearingTime,
      courtRoom: hearing.courtRoom,
      purpose: hearing.hearingType
    };

    caseData.status = CASE_STATUS.PENDING;

    // Add history entry
    caseData.addHistoryEntry(
      'HEARING_SCHEDULED',
      req.user.id,
      `Hearing scheduled for ${hearingDate} at ${hearingTime}`
    );

    await caseData.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.HEARING_SCHEDULED,
      hearing: caseData.hearings[caseData.hearings.length - 1]
    });
  } catch (error) {
    console.error('Schedule hearing error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Add case order (Judge only)
// @route   POST /api/cases/:id/orders
// @access  Private (Judge only)
export const addCaseOrder = async (req, res) => {
  try {
    if (req.user.role !== USER_ROLES.JUDGE) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only judges can pass orders'
      });
    }

    const { id } = req.params;
    const { orderType, orderText } = req.body;

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.ERROR.CASE_NOT_FOUND
      });
    }

    // Check if judge is assigned to this case
    if (caseData.assignedJudge?.toString() !== req.user.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You can only pass orders for cases assigned to you'
      });
    }

    const order = {
      orderType,
      orderText,
      passedBy: req.user.id
    };

    caseData.orders.push(order);

    // Add history entry
    caseData.addHistoryEntry(
      'ORDER_PASSED',
      req.user.id,
      `${orderType.charAt(0).toUpperCase() + orderType.slice(1)} order passed`
    );

    await caseData.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Order added successfully',
      order: caseData.orders[caseData.orders.length - 1]
    });
  } catch (error) {
    console.error('Add case order error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// @desc    Update case status
// @route   PUT /api/cases/:id/status
// @access  Private (Judge/Registrar only)
export const updateCaseStatus = async (req, res) => {
  try {
    if (![USER_ROLES.JUDGE, USER_ROLES.REGISTRAR].includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Only judges or registrars can update case status'
      });
    }

    const { id } = req.params;
    const { status, remarks } = req.body;

    const caseData = await Case.findById(id);
    if (!caseData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.ERROR.CASE_NOT_FOUND
      });
    }

    const oldStatus = caseData.status;
    caseData.status = status;

    // Handle special status changes
    if (status === CASE_STATUS.DISPOSED) {
      caseData.isDisposed = true;
      caseData.disposalDate = new Date();
    }

    // Add history entry
    caseData.addHistoryEntry(
      'STATUS_UPDATED',
      req.user.id,
      `Case status changed from ${oldStatus} to ${status}${remarks ? `: ${remarks}` : ''}`
    );

    await caseData.save();

    res.json({
      success: true,
      message: MESSAGES.SUCCESS.CASE_UPDATED,
      case: caseData
    });
  } catch (error) {
    console.error('Update case status error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};

// Helper function to check case access
const checkCaseAccess = (user, caseData) => {
  switch (user.role) {
    case USER_ROLES.REGISTRAR:
      return true;
    case USER_ROLES.JUDGE:
      return !caseData.assignedJudge || caseData.assignedJudge.toString() === user.id;
    case USER_ROLES.LAWYER:
      return caseData.parties.some(party => 
        party.assignedLawyer?.toString() === user.id
      );
    case USER_ROLES.USER:
      return caseData.parties.some(party => 
        party.user.toString() === user.id
      );
    default:
      return false;
  }
};

// @desc    Get cases dashboard statistics
// @route   GET /api/cases/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    let filter = { isActive: true };
    
    // Role-based filtering for stats
    switch (req.user.role) {
      case USER_ROLES.JUDGE:
        filter.assignedJudge = req.user.id;
        break;
      case USER_ROLES.LAWYER:
        filter['parties.assignedLawyer'] = req.user.id;
        break;
      case USER_ROLES.USER:
        filter['parties.user'] = req.user.id;
        break;
    }

    const stats = await Promise.all([
      Case.countDocuments({ ...filter, status: CASE_STATUS.REGISTERED }),
      Case.countDocuments({ ...filter, status: CASE_STATUS.PENDING }),
      Case.countDocuments({ ...filter, status: CASE_STATUS.IN_PROGRESS }),
      Case.countDocuments({ ...filter, status: CASE_STATUS.DISPOSED }),
      Case.countDocuments(filter)
    ]);

    res.json({
      success: true,
      stats: {
        registered: stats[0],
        pending: stats[1],
        inProgress: stats[2],
        disposed: stats[3],
        total: stats[4]
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: MESSAGES.ERROR.SERVER_ERROR 
    });
  }
};
