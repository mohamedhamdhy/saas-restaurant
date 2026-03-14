"use strict";

class UserController {
  constructor({
    registerFirstSuperAdmin,
    createUser,
    loginUser,
    refreshToken,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    listUsers,
  }) {
    this.registerFirstSuperAdmin = registerFirstSuperAdmin;
    this.createUser = createUser;
    this.loginUser = loginUser;
    this.refreshToken = refreshToken;
    this.logoutUser = logoutUser;
    this.getUserProfile = getUserProfile;
    this.updateUserProfile = updateUserProfile;
    this.changePassword = changePassword;
    this.listUsers = listUsers;
    this.handleRegisterSuperAdmin = this.handleRegisterSuperAdmin.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRefreshToken = this.handleRefreshToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleGetProfile = this.handleGetProfile.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleListUsers = this.handleListUsers.bind(this);
  }

  async handleRegisterSuperAdmin(req, res, next) {
    try {
      const result = await this.registerFirstSuperAdmin.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleLogin(req, res, next) {
    try {
      const result = await this.loginUser.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleRefreshToken(req, res, next) {
    try {
      const result = await this.refreshToken.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleLogout(req, res, next) {
    try {
      const result = await this.logoutUser.execute({ userId: req.actor.id });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleCreateUser(req, res, next) {
    try {
      const result = await this.createUser.execute(req.actor, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleGetProfile(req, res, next) {
    try {
      const targetUserId =
        req.params.id === "me" ? req.actor.id : req.params.id;
      const result = await this.getUserProfile.execute(req.actor, {
        targetUserId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleUpdateProfile(req, res, next) {
    try {
      const targetUserId =
        req.params.id === "me" ? req.actor.id : req.params.id;
      const result = await this.updateUserProfile.execute(req.actor, {
        targetUserId,
        updates: req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleChangePassword(req, res, next) {
    try {
      const result = await this.changePassword.execute({
        userId: req.actor.id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleListUsers(req, res, next) {
    try {
      const result = await this.listUsers.execute(req.actor, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
