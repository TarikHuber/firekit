import listsReducer from './store/lists/reducer'
import pathsReducer from './store/paths/reducer'
import docsReducer from './store/docs/reducer'
import collectionsReducer from './store/collections/reducer'
import authReducer from './store/auth/reducer'
import initializationReducer from './store/initialization/reducer'
import errorsReducer from './store/errors/reducer'
import connectionReducer from './store/connection/reducer'
import messagingReducer from './store/messaging/reducer'

const firekitReducers = {
  lists: listsReducer,
  errors: errorsReducer,
  paths: pathsReducer,
  docs: docsReducer,
  collections: collectionsReducer,
  auth: authReducer,
  connection: connectionReducer,
  messaging: messagingReducer,
  initialization: initializationReducer
}

export { default as authReducer } from './store/auth/reducer'
export { default as connectionReducer } from './store/connection/reducer'
export { default as messagingReducer } from './store/messaging/reducer'
export { default as listsReducer } from './store/lists/reducer'
export { default as pathsReducer } from './store/paths/reducer'
export { default as docsReducer } from './store/docs/reducer'
export { default as collectionsReducer } from './store/collections/reducer'
export { default as initializationReducer } from './store/initialization/reducer'
export { initMessaging, clearMessage } from './store/messaging/actions'
export { clearInitialization } from './store/initialization/actions'
export { initConnection, unsubscribeConnection } from './store/connection/actions'
export { watchAuth, authStateChanged, authError } from './store/auth/actions'
export { watchList, unwatchList, destroyList, unwatchAllLists } from './store/lists/actions'
export { watchCol, unwatchCol, destroyCol, unwatchAllCols } from './store/collections/actions'
export { watchPath, unwatchPath, destroyPath, unwatchAllPaths } from './store/paths/actions'
export { watchDoc, unwatchDoc, destroyDoc, unwatchAllDocs } from './store/docs/actions'
export { logError, clearError, clearAllErrors } from './store/errors/actions'

export default firekitReducers
