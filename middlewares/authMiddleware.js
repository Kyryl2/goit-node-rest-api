import passport from "passport";

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: info ? info.message : "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authMiddleware;
