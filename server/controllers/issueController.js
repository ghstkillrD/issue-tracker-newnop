const Issue = require('../models/Issue');

/**
 * @desc    Create a new issue
 * @route   POST /api/issues
 * @access  Private
 */
const createIssue = async (req, res) => {
  try {
    const { title, description, status, priority, severity } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    // Create issue with authenticated user as creator
    const issue = await Issue.create({
      title,
      description,
      status: status || 'Open',
      priority: priority || 'Medium',
      severity: severity || 'Minor',
      createdBy: req.user.id
    });

    // Populate creator details
    await issue.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    });
  } catch (error) {
    console.error('Create Issue Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating issue',
      error: error.message
    });
  }
};

/**
 * @desc    Get all issues with filtering and search
 * @route   GET /api/issues
 * @access  Private
 */
const getIssues = async (req, res) => {
  try {
    const { status, priority, severity, search, page = 1, limit = 10 } = req.query;

    // Build filter query
    let filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by severity
    if (severity) {
      filter.severity = severity;
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Issue.countDocuments(filter);

    // Fetch issues with pagination
    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: issues.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: issues
    });
  } catch (error) {
    console.error('Get Issues Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching issues',
      error: error.message
    });
  }
};

/**
 * @desc    Get single issue by ID
 * @route   GET /api/issues/:id
 * @access  Private
 */
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Get Issue By ID Error:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching issue',
      error: error.message
    });
  }
};

/**
 * @desc    Update an issue
 * @route   PUT /api/issues/:id
 * @access  Private
 */
const updateIssue = async (req, res) => {
  try {
    const { title, description, status, priority, severity } = req.body;

    // Find issue
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user is the creator of the issue
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this issue'
      });
    }

    // Update fields
    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (severity) issue.severity = severity;

    // Save updated issue
    await issue.save();

    // Populate creator details
    await issue.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Update Issue Error:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating issue',
      error: error.message
    });
  }
};

/**
 * @desc    Delete an issue
 * @route   DELETE /api/issues/:id
 * @access  Private
 */
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user is the creator of the issue
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue'
      });
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete Issue Error:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting issue',
      error: error.message
    });
  }
};

/**
 * @desc    Get issue statistics
 * @route   GET /api/issues/stats
 * @access  Private
 */
const getIssueStats = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      total: await Issue.countDocuments(),
      byStatus: {}
    };

    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = stat.count;
    });

    // Ensure all statuses are represented
    ['Open', 'In Progress', 'Resolved'].forEach(status => {
      if (!formattedStats.byStatus[status]) {
        formattedStats.byStatus[status] = 0;
      }
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssueStats
};
