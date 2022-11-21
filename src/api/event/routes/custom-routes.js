"use strict"

module.exports = {
  routes: [
    {
      "method": "GET",
      "path": "/events/me",
      "handler": "event.me",
      "config": {
        "policies:": []
      }
    }
  ]
}