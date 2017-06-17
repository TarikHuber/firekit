import {
  connectionReducer,
  listsReducer,
  initializationReducer,
  pathsReducer
} from '../firekit';

const firebaseReducers = {
  initialization: initializationReducer,
  connection: connectionReducer,
  lists: listsReducer,
  paths: pathsReducer,
}

export default firebaseReducers;
