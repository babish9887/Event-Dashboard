import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'RESTful API documentation for Event Management & Analytics Service',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            category: { type: 'string' },
            capacity: { type: 'number' },
            organizer: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        EventInput: {
          type: 'object',
          required: ['title', 'date', 'location'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            category: { type: 'string' },
            capacity: { type: 'number' },
            organizer: { type: 'string' },
          },
        },
        Analytics: {
          type: 'object',
          properties: {
            totalEvents: { type: 'number' },
            upcomingEvents: { type: 'number' },
            pastEvents: { type: 'number' },
            totalCapacity: { type: 'number' },
            categoryBreakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  count: { type: 'number' },
                },
              },
            },
            recentEvents: {
              type: 'array',
              items: { $ref: '#/components/schemas/Event' },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          summary: 'Health Check',
          tags: ['Health'],
          responses: {
            200: { description: 'API is healthy' },
          },
        },
      },
      '/api/events': {
        get: {
          summary: 'Get all events',
          tags: ['Events'],
          responses: {
            200: { description: 'List of events' },
          },
        },
        post: {
          summary: 'Create a new event',
          tags: ['Events'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EventInput' },
              },
            },
          },
          responses: {
            201: { description: 'Event created successfully' },
            400: { description: 'Validation error' },
          },
        },
      },
      '/api/events/analytics': {
        get: {
          summary: 'Get event analytics and stats',
          tags: ['Analytics'],
          responses: {
            200: {
              description: 'Analytics data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/Analytics' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/events/{id}': {
        get: {
          summary: 'Get event by ID',
          tags: ['Events'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Event details' },
            404: { description: 'Event not found' },
          },
        },
        put: {
          summary: 'Update event by ID',
          tags: ['Events'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EventInput' },
              },
            },
          },
          responses: {
            200: { description: 'Event updated' },
            404: { description: 'Event not found' },
          },
        },
        delete: {
          summary: 'Delete event by ID',
          tags: ['Events'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Event deleted' },
            404: { description: 'Event not found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);