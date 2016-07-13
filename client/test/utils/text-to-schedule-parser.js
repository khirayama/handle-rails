import assert  from 'power-assert';
import moment from 'moment';

import { parseTextToItem }  from '../../src/scripts/utils/text-to-schedule-parser';

let createdAt = moment([2015, 8, 23]); // 2015-9-23 Web
let item;
let answerText = 'meets my friend'

describe('TextToScheduleParser', () => {
  describe('parseTextToItem', () => {
    it('meets my friend', () => {
      item = parseTextToItem('meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule === null);
    })
    it('today meets my friend', () => {
      item = parseTextToItem('today meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 23);
      assert(item.schedule.day === 3);
    })
    it('tomorrow meets my friend', () => {
      item = parseTextToItem('tomorrow meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 24);
      assert(item.schedule.day === 4);
    })
    it('mom meets my friend', () => {
      item = parseTextToItem('mom meets my friend', createdAt);

      assert(item.text === 'mom ' + answerText);
      assert(item.schedule === null);
    })
    it('mon meets my friend', () => {
      item = parseTextToItem('mon meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 28);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('monday meets my friend', () => {
      item = parseTextToItem('monday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 28);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('fri meets my friend', () => {
      item = parseTextToItem('fri meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 25);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('friday meets my friend', () => {
      item = parseTextToItem('friday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 25);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('this mon meets my friend', () => {
      item = parseTextToItem('this mon meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 21);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('this monday meets my friend', () => {
      item = parseTextToItem('this monday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 21);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('this fri meets my friend', () => {
      item = parseTextToItem('this fri meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 25);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('this friday meets my friend', () => {
      item = parseTextToItem('this friday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 25);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('next mon meets my friend', () => {
      item = parseTextToItem('next mon meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 28);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('next monday meets my friend', () => {
      item = parseTextToItem('next monday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 28);
      assert(item.schedule.day === 1);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('next fri meets my friend', () => {
      item = parseTextToItem('next fri meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 2);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('next friday meets my friend', () => {
      item = parseTextToItem('next friday meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 2);
      assert(item.schedule.day === 5);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('9/22 meets my friend', () => {
      item = parseTextToItem('9/22 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 9);
      assert(item.schedule.date === 22);
      assert(item.schedule.day === 2);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('10/8 meets my friend', () => {
      item = parseTextToItem('10/8 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 8);
      assert(item.schedule.day === 4);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('10/22 meets my friend', () => {
      item = parseTextToItem('10/22 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 22);
      assert(item.schedule.day === 4);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('02/06 meets my friend', () => {
      item = parseTextToItem('02/06 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2016);
      assert(item.schedule.month === 2);
      assert(item.schedule.date === 6);
      assert(item.schedule.day === 6);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('0206 meets my friend', () => {
      item = parseTextToItem('0206 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2016);
      assert(item.schedule.month === 2);
      assert(item.schedule.date === 6);
      assert(item.schedule.day === 6);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('2015/10/22 meets my friend', () => {
      item = parseTextToItem('2015/10/22 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2015);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 22);
      assert(item.schedule.day === 4);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
    it('2016/10/22 meets my friend', () => {
      item = parseTextToItem('2016/10/22 meets my friend', createdAt);

      assert(item.text === answerText);
      assert(item.schedule.year === 2016);
      assert(item.schedule.month === 10);
      assert(item.schedule.date === 22);
      assert(item.schedule.day === 6);

      const schedule = [item.schedule.year, item.schedule.month - 1, item.schedule.date];

      assert(item.schedule.completed === moment(schedule).isBefore());
    })
  });
});
