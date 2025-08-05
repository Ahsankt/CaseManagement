import User from '../models/User.js';
import { USER_ROLES } from '../utils/constants.js';

// @desc    Get all users (admin/judge only)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    // Build filter
    const filter = { isActive: true };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get users
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Users can only update their own profile unless they're admin/judge
    if (req.user.id !== id && ![USER_ROLES.JUDGE].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// @desc    Get lawyers
// @route   GET /api/users/lawyers
// @access  Private
export const getLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({ 
      role: USER_ROLES.LAWYER, 
      isActive: true 
    }).select('firstName lastName email specialization barNumber');

    res.json({
      success: true,
      lawyers
    });
  } catch (error) {
    console.error('Get lawyers error:', error);
    res.status(500).json({ message: 'Failed to fetch lawyers' });
  }
};

// @desc    Get judges
// @route   GET /api/users/judges
// @access  Private
export const getJudges = async (req, res) => {
  try {
    const judges = await User.find({ 
      role: USER_ROLES.JUDGE, 
      isActive: true 
    }).select('firstName lastName email courtAssignment');

    res.json({
      success: true,
      judges
    });
  } catch (error) {
    console.error('Get judges error:', error);
    res.status(500).json({ message: 'Failed to fetch judges' });
  }
};

// @desc    Deactivate user
// @route   DELETE /api/users/:id
// @access  Private (Judge only)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Failed to deactivate user' });
  }
};
