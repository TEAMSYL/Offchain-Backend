const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // log 관리 미들웨어
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const AWS = require("aws-sdk");
require("dotenv").config();

const app = express();
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
// routers
const authRouter = require("./routes/auth");
const pageRouter = require("./routes/page");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const transactionRouter = require("./routes/transaction");
const { sequelize } = require("./models");
// ./passport/index.js 와 같음
const passportConfig = require("./passport");
passportConfig(); // 패스포트 설정

sequelize.sync();

app.set("port", process.env.PORT || 8001);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, // js에서 쿠키에 접근할 수 없도록 방지
      secure: false, // http도 쿠키 전송 가능
      maxAge: 1000 * 60 * 60, // 쿠키 유효기간 1시간
    },
  })
);

app.use(flash());

// 요청(req객체)에 passport 설정을 심음
app.use(passport.initialize());
// req.session 객체에 passport 정보 저장
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/", pageRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);
app.use(
  "/docs",
  swaggerUI.serve
  // swaggerUI.setup(require("./config/swaggerDoc"))
);

// 404 처리 미들 웨어
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// 에러 핸들러
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.Error = req.app.get("env") === "develoment" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
