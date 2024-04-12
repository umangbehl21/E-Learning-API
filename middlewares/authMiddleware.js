const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Middleware function to authenticate JWT tokens       
const authenticateToken = (req, res, next) => {
    // Extract the JWT token from the request cookies
    // console.log(req)
    const token = req.cookies.jwt_token; // Assuming the cookie name is 'jwt_token'

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Call the next middleware in the chain
        next();
    } catch (error) {
        // If token verification fails, return a 403 Forbidden response
        return res.status(403).json({ error: 'Forbidden. Invalid token.' });
    }
};

// Middleware function to check if the user is an admin
const checkAdmin = (req, res, next) => {
    // Extract the JWT token from the request cookies
    const token = req.cookies.jwt_token; // Assuming the cookie name is 'jwt_token'

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if the user is an admin (assuming role is stored in the token)
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. User is not an admin.' });
        }

        // User is an admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, return a 403 Forbidden response
        return res.status(403).json({ error: 'Forbidden. Invalid token.' });
    }
};

module.exports = {authenticateToken , checkAdmin};

