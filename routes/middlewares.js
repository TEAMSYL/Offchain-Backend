exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(1);
    next();
  } else {
    console.log(2);
    // console.log(req);
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(3);
    next();
  } else {
    res.status(403).send("로그인한 상태입니다.");
    console.log(4);
  }
};
