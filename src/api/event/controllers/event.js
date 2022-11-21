'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({

  async me(ctx, next) {
    const user = ctx.state.user 

    if (!user) {
      return ctx.badRequest(null, [{message: [{id: "No authorization header was found"}]}])
    }

    const data = await strapi.entityService.findMany('api::event.event', {
      populate: 'image',
      filters: {
        "user": {
          "id": user.id
        }
      }
    })

    if (!data) {
      return ctx.notFound()
    }

    const sanitizedEvents = await this.sanitizeOutput(data, ctx)

    return this.transformResponse(sanitizedEvents)
  },

  // Create event with linked user
  async create(ctx) {
    var user = ctx.state.user 

    if (!user) {
      return ctx.badRequest(null, [
        {message: [{ id: 'No authorization header was found'}]}
      ])
    }
    const response = await super.create(ctx) 
    const updatedResponse = await strapi.entityService 
      .update('api::event.event', response.data.id, { data: { user: user.id}})

    if (!updatedResponse) {
      return ctx.unauthorized()
    }

    const sanitizedArticles = await this.sanitizeOutput( updatedResponse, ctx)
      return this.transformResponse(sanitizedArticles)
  },

  async update(ctx) {
    var user = ctx.state.user 

    if (!user) {
      return ctx.badRequest(null, [
        {message: [{ id: 'No authorization header was found'}]}
      ])
    }

    var [ article ] = await strapi.entityService 
      .findMany('api::event.event', {
        filters: {
          id: ctx.request.params.id,
          user: user.id
        }
      })
    if (article) {
      const response = await super.update(ctx)
      const sanitizedArticle = await this.sanitizeOutput(response, ctx)
      return this.transformResponse(sanitizedArticle)
    } else {
      return ctx.unauthorized()
    }
  },
  async delete(ctx) {
    var user = ctx.state.user 

    if (!user) {
      return ctx.badRequest(null, [
        {message: [{ id: 'No authorization header was found'}]}
      ])
    }

    var [article] = await strapi.entityService 
      .findMany('api::event.event', {
        filters: {
          id: ctx.request.params.id, 
          user: user.id
        }
      })
      
    if (article) {
      const response = await super.delete(ctx)
      const sanitizedArticle = await this.sanitizeOutput(response, ctx)
      return this.transformResponse(sanitizedArticle)
    } else {
      return ctx.unauthorized()
    }
  }

 
}));
