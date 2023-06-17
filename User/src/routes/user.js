import express from "express";
import controllers from "../controllers/_index.js";
const UserRoutes = express.Router();

UserRoutes.get("/allUser", controllers.userController.index);
UserRoutes.get(
  "/admins/unit/:idUnit",
  controllers.userController.indexUsersAdminByUnitId
);
UserRoutes.get("/cpf/:cpf", controllers.userController.showUserByCpf);
UserRoutes.get(
  "/user/:cpf/unit/:idUnit",
  controllers.userController.showUserByUnit
);
UserRoutes.post("/login", controllers.userController.loginUser);
UserRoutes.post("/newUser", controllers.userController.store);
UserRoutes.post(
  "/acceptRequest/:cpf",
  controllers.userController.acceptRequest
);
UserRoutes.put("/updateUser/:cpf", controllers.userController.updateUserEmail);
UserRoutes.put("/updateUserRole", controllers.userController.updateUserRole);
UserRoutes.post(
  "/updateUserPassword/:cpf",
  controllers.userController.updateUserPassword
);
UserRoutes.delete("/deleteUser/:cpf", controllers.userController.deleteByCpf);
UserRoutes.delete(
  "/deleteRequest/:cpf",
  controllers.userController.deleteRequest
);

export default UserRoutes;
