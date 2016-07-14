export const TASK_SCHEMA = {
  type: 'object',
  required: [
    'text',
    'completed',
    'categoryId',
    'order',
  ],
  properties: {
    text: {
      type: 'string',
    },
    completed: {
      type: 'boolean',
    },
    categoryId: {
      type: 'integer',
    },
    order: {
      type: 'integer',
      minimum: 0,
    },
  },
};

export const TASKS_SCHEMA = {
  type: 'array',
  minItems: 0,
  items: {
    required: [
      'categoryId',
      'categoryName',
      'tasks',
    ],
    properties: {
      categoryId: {
        type: 'integer',
      },
      categoryName: {
        type: 'string',
      },
      tasks: {
        type: 'array',
        minItems: 0,
        items: TASK_SCHEMA,
      },
    },
  },
};
