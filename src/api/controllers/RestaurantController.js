"use strict";

class RestaurantController {
  constructor({
    createRestaurant,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    listRestaurants,
    restoreRestaurant,
  }) {
    this.createRestaurant = createRestaurant;
    this.getRestaurant = getRestaurant;
    this.updateRestaurant = updateRestaurant;
    this.deleteRestaurant = deleteRestaurant;
    this.listRestaurants = listRestaurants;
    this.restoreRestaurant = restoreRestaurant;

    this.handleCreateRestaurant = this.handleCreateRestaurant.bind(this);
    this.handleGetRestaurant = this.handleGetRestaurant.bind(this);
    this.handleUpdateRestaurant = this.handleUpdateRestaurant.bind(this);
    this.handleDeleteRestaurant = this.handleDeleteRestaurant.bind(this);
    this.handleListRestaurants = this.handleListRestaurants.bind(this);
    this.handleRestoreRestaurant = this.handleRestoreRestaurant.bind(this);
  }

  async handleCreateRestaurant(req, res, next) {
    try {
      const result = await this.createRestaurant.execute(req.actor, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleGetRestaurant(req, res, next) {
    try {
      const result = await this.getRestaurant.execute(req.actor, {
        restaurantId: req.params.restaurantId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleUpdateRestaurant(req, res, next) {
    try {
      const result = await this.updateRestaurant.execute(req.actor, {
        restaurantId: req.params.restaurantId,
        updates: req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleDeleteRestaurant(req, res, next) {
    try {
      const result = await this.deleteRestaurant.execute(req.actor, {
        restaurantId: req.params.restaurantId,
        force: req.body?.force ?? false,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleListRestaurants(req, res, next) {
    try {
      const result = await this.listRestaurants.execute(req.actor, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleRestoreRestaurant(req, res, next) {
    try {
      const result = await this.restoreRestaurant.execute(req.actor, {
        restaurantId: req.params.restaurantId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RestaurantController;
