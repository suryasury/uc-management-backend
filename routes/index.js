module.exports = (app) => {
  const company = require("../controller/company/companyController");
  const user = require("../controller/user/userController.js");

  var userRouter = require("express").Router();
  var companyRouter = require("express").Router();

  userRouter.post("/add-user", user.addUser);
  userRouter.get("/list-users", user.getUser);
  userRouter.get("/get-user/:id", user.getUser);
  userRouter.delete("/delete/:id", user.deleteUser);
  userRouter.put("/update", user.updateUser);

  companyRouter.post("/add-company", company.addCompany);
  companyRouter.get("/list-companies", company.getCompany);
  companyRouter.get("/get-company/:id", company.getCompany);
  companyRouter.delete("/delete/:id", company.deleteCompany);
  companyRouter.put("/update", company.updateCompany);
  companyRouter.put("/associate-user", company.addUserToCompany);
  companyRouter.put("/remove-user", company.removeUserFromCompany);
  companyRouter.put("/migrate-user", company.migrateUserToAnotherCompany);

  app.use("/api/user", userRouter);
  app.use("/api/company", companyRouter);
};
