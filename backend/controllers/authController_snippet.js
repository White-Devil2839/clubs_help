
// @desc    Change Password (Authenticated)
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // req.user is set by authMiddleware protect
        // We need to re-fetch to get password field if it was excluded, but typically findById includes it or we specifically ask.
        // authMiddleware usually does User.findById(decoded.id).select('-password')
        // So we need to fetch explicitly.
        const user = await User.findById(req.user._id).select('+password');

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerInstitution,
    loginUser,
    registerUser,
    globalLogin,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
};
