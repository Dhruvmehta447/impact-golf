const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Look for the wristband (Token) in the headers
  const token = req.header('Authorization');

  // 2. If there is no wristband, stop them right here
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No VIP wristband!' });
  }

  try {
    // 3. The token usually comes looking like "Bearer [token_string]". We just want the string.
    const actualToken = token.split(" ")[1];

    // 4. Verify the wristband using our secret key
    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // 5. Attach the user's ID to the request so the next door knows who is knocking
    req.user = verified;
    
    // 6. Let them pass!
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired wristband!' });
  }
};

// The Super Bouncer: Only lets Admins through!
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required!' });
  }
};

module.exports = { protect, admin };