
export const STATE_LOCATIONS = 'locations';
export const STATE_CATEGORIES = 'categories';
export const DEAFULT_STATE_VALUE = STATE_LOCATIONS;

export const ACTIONS_VIEW = 'view';
export const ACTIONS_ADD = 'add';
export const ACTIONS_EDIT = 'edit';
export const ACTIONS_REMOVE = 'remove';
export const ACTIONS_MAP = 'map';
export const DEAFULT_ACTION_VALUE = ACTIONS_ADD;

export const DEAFULT_APP_STATE =  {
    type: 'init',
    state: DEAFULT_STATE_VALUE,
    action: DEAFULT_ACTION_VALUE,
    editIndex: -1,
    caller: '',
    locations: [],
    categories: [],
    mapCoordinates: ''
}