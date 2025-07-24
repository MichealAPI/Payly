export const requireAuth = (req, res, next) => {
    // Check if a session exists and if a user is attached to it
    if (req.session && req.session.user) {
        req.user = req.session.user; // Attach user info to request object for consistency
        return next(); // User is authenticated, proceed
    } else {
        // No session or user data in session, user is not authenticated
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
};