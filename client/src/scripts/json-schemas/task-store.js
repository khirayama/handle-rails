export const SCHEDULE_SCHEMA = {
  type: [
    'object',
    'null',
  ],
  required: [
    'completed',
    'date',
    'day',
    'dayName',
    'hour',
    'month',
    'monthName',
    'shortDayName',
    'shortMonthName',
    'year',
  ],
  properties: {
    completed: {
      type: 'boolean',
    },
    date: {
      type: 'integer',
    },
    day: {
      type: 'integer',
    },
    dayName: {
      type: 'string',
    },
    hour: {
      type: 'integer',
    },
    month: {
      type: 'integer',
    },
    monthName: {
      type: 'string',
    },
    shortDayName: {
      type: 'string',
    },
    shortMonthName: {
      type: 'string',
    },
    year: {
      type: 'integer',
    },
  },
};

export const TASK_STORE_SCHEMA = {
  type: 'object',
  required: [
    'text',
    'completed',
    'categoryId',
    'order',
    'schedule',
    'scheduleText',
    'isEditing',
  ],
  properties: {
    text: {
      type: 'string',
    },
    completed: {
      type: 'boolean',
    },
    categoryId: {
      type: 'string',
    },
    order: {
      type: 'integer',
      minimum: 0,
    },
    isEditing: {
      type: 'boolean',
    },
    schedule: SCHEDULE_SCHEMA,
    scheduleText: {
      type: 'string',
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
        type: 'string',
      },
      categoryName: {
        type: 'string',
      },
    },
  },
};
