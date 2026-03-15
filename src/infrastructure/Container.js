"use strict";

const { createContainer, asClass, asValue, InjectionMode } = require("awilix");

const { sequelize } = require("./database/Connection");
const redisClient = require("./cache/RedisClient");

require("./database/models/Index");

const UserRepository = require("./repositories/UserRepository");
const TokenRepository = require("./repositories/TokenRepository");
const OtpRepository = require("./repositories/OtpRepository");
const RestaurantRepository = require("./repositories/RestaurantRepository");
const BranchRepository = require("./repositories/BranchRepository");
const UserRoleRepository = require("./repositories/UserRoleRepository");
const RegisterFirstSuperAdmin = require("../application/user/RegisterFirstSuperAdmin");
const CreateUser = require("../application/user/CreateUser");
const LoginUser = require("../application/user/LoginUser");
const RefreshToken = require("../application/user/RefreshToken");
const LogoutUser = require("../application/user/LogoutUser");
const GetUserProfile = require("../application/user/GetUserProfile");
const UpdateUserProfile = require("../application/user/UpdateUserProfile");
const ChangePassword = require("../application/user/ChangePassword");
const ListUsers = require("../application/user/ListUsers");
const DeleteUser = require("../application/user/DeleteUser");
const AssignRole = require("../application/user/AssignRole");
const SendOtp = require("../application/otp/SendOtp");
const VerifyRegistrationOtp = require("../application/otp/VerifyRegistrationOtp");
const VerifyLoginOtp = require("../application/otp/VerifyLoginOtp");
const RequestChangePasswordOtp = require("../application/otp/RequestChangePasswordOtp");
const ChangePasswordWithOtp = require("../application/otp/ChangePasswordWithOtp");
const ForgotPassword = require("../application/otp/ForgotPassword");
const ResetPassword = require("../application/otp/ResetPassword");
const CreateRestaurant = require("../application/restaurant/CreateRestaurant");
const GetRestaurant = require("../application/restaurant/GetRestaurant");
const UpdateRestaurant = require("../application/restaurant/UpdateRestaurant");
const DeleteRestaurant = require("../application/restaurant/DeleteRestaurant");
const ListRestaurants = require("../application/restaurant/ListRestaurants");
const RestoreRestaurant = require("../application/restaurant/RestoreRestaurant");
const CreateBranch = require("../application/branch/CreateBranch");
const GetBranch = require("../application/branch/GetBranch");
const UpdateBranch = require("../application/branch/UpdateBranch");
const DeleteBranch = require("../application/branch/DeleteBranch");
const ListBranches = require("../application/branch/ListBranches");
const RestoreBranch = require("../application/branch/RestoreBranch");
const UserController = require("../api/controllers/UserController");
const OtpController = require("../api/controllers/OtpController");
const RestaurantController = require("../api/controllers/RestaurantController");
const BranchController = require("../api/controllers/BranchController");

const container = createContainer({ injectionMode: InjectionMode.PROXY });

container.register({
  sequelize: asValue(sequelize),
  redisClient: asValue(redisClient),

  userRepository: asClass(UserRepository).singleton(),
  tokenRepository: asClass(TokenRepository).singleton(),
  otpRepository: asClass(OtpRepository).singleton(),
  restaurantRepository: asClass(RestaurantRepository).singleton(),
  branchRepository: asClass(BranchRepository).singleton(),
  userRoleRepository: asClass(UserRoleRepository).singleton(),
  registerFirstSuperAdmin: asClass(RegisterFirstSuperAdmin).singleton(),
  createUser: asClass(CreateUser).singleton(),
  loginUser: asClass(LoginUser).singleton(),
  refreshToken: asClass(RefreshToken).singleton(),
  logoutUser: asClass(LogoutUser).singleton(),
  getUserProfile: asClass(GetUserProfile).singleton(),
  updateUserProfile: asClass(UpdateUserProfile).singleton(),
  changePassword: asClass(ChangePassword).singleton(),
  listUsers: asClass(ListUsers).singleton(),
  deleteUser: asClass(DeleteUser).singleton(),
  assignRole: asClass(AssignRole).singleton(),
  sendOtp: asClass(SendOtp).singleton(),
  verifyRegistrationOtp: asClass(VerifyRegistrationOtp).singleton(),
  verifyLoginOtp: asClass(VerifyLoginOtp).singleton(),
  requestChangePasswordOtp: asClass(RequestChangePasswordOtp).singleton(),
  changePasswordWithOtp: asClass(ChangePasswordWithOtp).singleton(),
  forgotPassword: asClass(ForgotPassword).singleton(),
  resetPassword: asClass(ResetPassword).singleton(),
  createRestaurant: asClass(CreateRestaurant).singleton(),
  getRestaurant: asClass(GetRestaurant).singleton(),
  updateRestaurant: asClass(UpdateRestaurant).singleton(),
  deleteRestaurant: asClass(DeleteRestaurant).singleton(),
  listRestaurants: asClass(ListRestaurants).singleton(),
  restoreRestaurant: asClass(RestoreRestaurant).singleton(),
  createBranch: asClass(CreateBranch).singleton(),
  getBranch: asClass(GetBranch).singleton(),
  updateBranch: asClass(UpdateBranch).singleton(),
  deleteBranch: asClass(DeleteBranch).singleton(),
  listBranches: asClass(ListBranches).singleton(),
  restoreBranch: asClass(RestoreBranch).singleton(),
  userController: asClass(UserController).singleton(),
  otpController: asClass(OtpController).singleton(),
  restaurantController: asClass(RestaurantController).singleton(),
  branchController: asClass(BranchController).singleton(),
});

module.exports = { container };
