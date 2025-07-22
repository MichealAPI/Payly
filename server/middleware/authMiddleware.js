import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }

}