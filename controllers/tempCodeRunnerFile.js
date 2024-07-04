 try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");