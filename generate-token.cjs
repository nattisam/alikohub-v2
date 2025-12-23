const jwt = require('jsonwebtoken');

const secret = 'your-jwt-secret-key-here';
const user = {
    "id": 1,
    "firebaseId": "S9gAL3K51dY0itfKIn835N7w65p2",
    "firstname": "nattisam",
    "lastname": null,
    "email": "nattisam@gmail.com",
    "globalRole": "USER",
    "status": "ACTIVE"
};

const payload = {
    uid: user.firebaseId,
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    globalRole: user.globalRole,
    status: user.status,
    // Add subdomain roles if needed, but defaults are fine for discovery
    eventsRole: 'EVENTS_ADMIN', 
    eventsStatus: 'ACTIVE'
};

const token = jwt.sign(payload, secret, { expiresIn: '1d' });
console.log(token);
