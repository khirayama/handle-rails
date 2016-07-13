import assert from 'power-assert';

import { validateByJSONSchema } from '../../src/scripts/json-schemas/json-schema';
import { TASK_SCHEMA } from '../../src/scripts/json-schemas/task';
import { TASK_CATEGORY_SCHEMA } from '../../src/scripts/json-schemas/task-category';
import { TASK_STORE_SCHEMA } from '../../src/scripts/json-schemas/task-store';


describe('validateByJSONSchema', () => {
  it('Task', () => {
    const result = validateByJSONSchema({
      text: '',
      completed: false,
      categoryId: 'category-id',
      order: 1,
    }, TASK_SCHEMA);

    assert(result.errors.length === 0);
  });

  it('TaskCategory', () => {
    const result = validateByJSONSchema({
      name: '',
      order: 1,
    }, TASK_CATEGORY_SCHEMA);

    assert(result.errors.length === 0);
  });

  // Store
  it('taskStore', () => {
    const result = validateByJSONSchema({
      text: '',
      completed: false,
      categoryId: 'category-id',
      order: 1,
      schedule: null,
      scheduleText: '',
      isEditing: false,
    }, TASK_STORE_SCHEMA);

    assert(result.errors.length === 0);
  });
});
