src
├── api
│   ├── controllers
│   │   ├── BranchController.js
│   │   ├── OtpController.js
│   │   ├── RestaurantController.js
│   │   └── UserController.js
│   ├── middlewares
│   │   ├── Authenticate.js
│   │   ├── Authorize.js
│   │   ├── ErrorHandler.js
│   │   ├── NotFound.js
│   │   └── SetupGuard.js
│   ├── routes
│   │   ├── BranchRoutes.js
│   │   ├── OtpRoutes.js
│   │   ├── RestaurantRoutes.js
│   │   └── UserRoutes.js
│   └── validators
│       ├── OtpValidator.js
│       ├── RestaurantValidator.js
│       └── UserValidator.js
├── app.js
├── application
│   ├── branch
│   │   ├── CreateBranch.js
│   │   ├── DeleteBranch.js
│   │   ├── GetBranch.js
│   │   ├── ListBranches.js
│   │   ├── RestoreBranch.js
│   │   └── UpdateBranch.js
│   ├── otp
│   │   ├── ChangePasswordWithOtp.js
│   │   ├── ForgotPassword.js
│   │   ├── RequestChangePasswordOtp.js
│   │   ├── ResetPassword.js
│   │   ├── SendOtp.js
│   │   ├── VerifyLoginOtp.js
│   │   └── VerifyRegistrationOtp.js
│   ├── restaurant
│   │   ├── CreateRestaurant.js
│   │   ├── DeleteRestaurant.js
│   │   ├── GetRestaurant.js
│   │   ├── ListRestaurants.js
│   │   ├── RestoreRestaurant.js
│   │   └── UpdateRestaurant.js
│   └── user
│       ├── ChangePassword.js
│       ├── CreateUser.js
│       ├── GetUserProfile.js
│       ├── ListUsers.js
│       ├── LoginUser.js
│       ├── LogoutUser.js
│       ├── RefreshToken.js
│       ├── RegisterFirstSuperAdmin.js
│       └── UpdateUserProfile.js
├── domain
│   ├── entities
│   │   ├── Branch.js
│   │   ├── Restaurant.js
│   │   └── User.js
│   ├── enums
│   │   ├── BranchStatus.js
│   │   ├── RestaurantStatus.js
│   │   ├── UserRole.js
│   │   └── UserStatus.js
│   └── interfaces
│       ├── IBranchRepository.js
│       ├── IOtpRepository.js
│       ├── IRestaurantRepository.js
│       ├── ITokenRepository.js
│       └── IUserRepository.js
├── index.js
├── infrastructure
│   ├── Container.js
│   ├── cache
│   │   └── RedisClient.js
│   ├── database
│   │   ├── Connection.js
│   │   ├── config
│   │   │   └── Config.js
│   │   ├── migrations
│   │   │   ├── 20260312042519-create-UserModel.js
│   │   │   ├── 20260312152847-add-deletedAt-to-UserModel.js
│   │   │   ├── 20260312161137-create-Restaurants.js
│   │   │   └── 20260312161202-create-Branches.js
│   │   └── models
│   │       ├── BranchModel.js
│   │       ├── RestaurantModel.js
│   │       └── UserModel.js
│   ├── mailer
│   │   ├── MailerClient.js
│   │   └── SendOtpEmail.js
│   ├── repositories
│   │   ├── BranchRepository.js
│   │   ├── OtpRepository.js
│   │   ├── RestaurantRepository.js
│   │   ├── TokenRepository.js
│   │   └── UserRepository.js
│   └── sms
│       ├── SendOtpSms.js
│       └── SmsClient.js
└── shared
    ├── constants
    │   └── Index.js
    ├── errors
    │   ├── AppError.js
    │   └── ErrorCodes.js
    └── utils
        ├── Logger.js
        ├── OtpUtils.js
        ├── PasswordUtils.js
        ├── ResponseHelper.js
        ├── TokenUtils.js
        └── ValidateEnv.js