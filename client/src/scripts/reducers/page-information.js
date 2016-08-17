import { pages, actionTypes as types } from '../constants/constants';


export function updatePageInformation(pageInformation, diff) {
  return Object.assign({}, pageInformation, diff);
}

export default function pageInformation(state, action) {
  switch (action.type) {
    case types.UPDATE_PAGE:
      switch (action.pathname) {
        case '/':
          if (action.currentUserInformation !== null) {
            return updatePageInformation(state, {
              name: pages.TASK_CATEGORIES,
              meta: { title: 'Task Categories' },
              styles: {
                transition: 'slideUpDown',
                header: {
                  position: 'default',
                  href: '/settings'
                },
              }
            });
          } else {
            return updatePageInformation(state, {
              name: pages.LANDING,
              meta: { title: 'Welcome to Handle' },
              styles: {
                transition: 'fadeInOut',
                header: { position: 'none' },
              }
            });
          }
        case '/help':
          return updatePageInformation(state, {
            name: pages.HELP,
            meta: { title: 'Help' },
            styles: {
              transition: 'slideInOut',
              header: { position: 'bottom' },
            }
          });
        case '/settings':
          return updatePageInformation(state, {
            name: pages.SETTINGS,
            meta: { title: 'Settings' },
            styles: {
              transition: 'fadeInOut',
              header: { position: 'bottom' },
            }
          });
        default:
          return updatePageInformation(state, {
            name: pages.NOT_FOUND,
            meta: { title: 'NOT FOUND' },
            styles: {
              header: { position: 'none' },
            }
          });
      }
    default:
      return state;
  }
}
