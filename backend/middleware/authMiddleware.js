import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('JWT Error:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default protect;


/*
😂 Happens to every developer!

One tiny spelling mistake can waste hours—even experienced developers face this.

The good thing is you learned how to debug JWT authentication, inspect network requests, and read backend errors.

**Pro tip:** When stuck, check the terminal error message first. It often points directly to the problem.

Keep going! 🚀💻



### 📝 Recall Note: Debugging JWT Authentication (401 Unauthorized)

1. Tried creating a resume using the `POST /api/resumes/create` API.
2. Received a `401 Unauthorized` error.
3. Checked the browser's Network tab to inspect the request.
4. Confirmed that the JWT token existed in `localStorage`.
5. Inspected the request headers and found the token was being sent.
6. Checked the `createResume` function in `Dashboard.jsx`.
7. Found a typo: used `header` instead of `headers` in the Axios request.
8. Corrected it to `headers: { Authorization: token }`.
9. Tried creating a resume again, but still received `401 Unauthorized`.
10. Inspected the `authMiddleware.js` authentication middleware.
11. Verified that the middleware accessed the token using `req.headers.authorization`.
12. Checked the JWT verification logic using `jwt.verify()`.
13. Confirmed that the token-generation function used `process.env.JWT_SECRET`.
14. Checked the `.env` file to verify the `JWT_SECRET` value.
15. Restarted the backend and logged in again to generate a fresh token.
16. The error persisted, so added `console.log(error.message)` inside the `catch` block.
17. Checked the backend terminal to identify the actual error.
18. Found the typo `procees.env.JWT_SECRET` instead of `process.env.JWT_SECRET`.
19. Corrected the spelling and restarted the backend server.
20. **Success!** JWT verification worked, and the resume creation request no longer returned `401 Unauthorized`. ✅

### 💡 Key Lessons

- Check the browser's Network tab when an API request fails.
- Verify that Axios request headers are configured correctly.
- Use backend terminal logs to identify the actual error.
- Ensure the JWT secret is consistent between token generation and verification.
- **Small spelling mistakes can cause big debugging problems!**


*/
