"use strict";

class BranchController {
  constructor({
    createBranch,
    getBranch,
    updateBranch,
    deleteBranch,
    listBranches,
    restoreBranch,
  }) {
    this.createBranch = createBranch;
    this.getBranch = getBranch;
    this.updateBranch = updateBranch;
    this.deleteBranch = deleteBranch;
    this.listBranches = listBranches;
    this.restoreBranch = restoreBranch;

    this.handleCreateBranch = this.handleCreateBranch.bind(this);
    this.handleGetBranch = this.handleGetBranch.bind(this);
    this.handleUpdateBranch = this.handleUpdateBranch.bind(this);
    this.handleDeleteBranch = this.handleDeleteBranch.bind(this);
    this.handleListBranches = this.handleListBranches.bind(this);
    this.handleRestoreBranch = this.handleRestoreBranch.bind(this);
  }

  async handleCreateBranch(req, res, next) {
    try {
      const result = await this.createBranch.execute(req.actor, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleGetBranch(req, res, next) {
    try {
      const result = await this.getBranch.execute(req.actor, {
        branchId: req.params.branchId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleUpdateBranch(req, res, next) {
    try {
      const result = await this.updateBranch.execute(req.actor, {
        branchId: req.params.branchId,
        updates: req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleDeleteBranch(req, res, next) {
    try {
      const result = await this.deleteBranch.execute(req.actor, {
        branchId: req.params.branchId,
        force: req.body?.force ?? false,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleListBranches(req, res, next) {
    try {
      const result = await this.listBranches.execute(req.actor, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleRestoreBranch(req, res, next) {
    try {
      const result = await this.restoreBranch.execute(req.actor, {
        branchId: req.params.branchId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BranchController;
