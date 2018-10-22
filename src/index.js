import authReducer from './store/auth/reducer'
import collectionsReducer from './store/collections/reducer'
import connectionReducer from './store/connection/reducer'
import docsReducer from './store/docs/reducer'
import errorsReducer from './store/errors/reducer'
import initializationReducer from './store/initialization/reducer'
import listsReducer from './store/lists/reducer'
import loadingsReducers from './store/loadings/reducer'
import messagingReducer from './store/messaging/reducer'
import pathsReducer from './store/paths/reducer'

const firekitReducers = {
  auth: authReducer,
  collections: collectionsReducer,
  connection: connectionReducer,
  docs: docsReducer,
  errors: errorsReducer,
  initialization: initializationReducer,
  lists: listsReducer,
  loadings: loadingsReducers,
  messaging: messagingReducer,
  paths: pathsReducer
}

export { clearInitialization } from './store/initialization/actions'
export { default as authReducer } from './store/auth/reducer'
export { default as collectionsReducer } from './store/collections/reducer'
export { default as connectionReducer } from './store/connection/reducer'
export { default as docsReducer } from './store/docs/reducer'
export { default as errorsReducer } from './store/errors/reducer'
export { default as initializationReducer } from './store/initialization/reducer'
export { default as listsReducer } from './store/lists/reducer'
export { default as loadingsReducer } from './store/loadings/reducer'
export { default as messagingReducer } from './store/messaging/reducer'
export { default as pathsReducer } from './store/paths/reducer'
export { initConnection, unsubscribeConnection } from './store/connection/actions'
export { initMessaging, clearMessage } from './store/messaging/actions'
export { logError, clearError, clearAllErrors } from './store/errors/actions'
export { logLoading, clearLoading, clearAllLoadings } from './store/loadings/actions'
export { watchAuth, authStateChanged, authError } from './store/auth/actions'
export { watchCol, unwatchCol, destroyCol, unwatchAllCols } from './store/collections/actions'
export { watchDoc, unwatchDoc, destroyDoc, unwatchAllDocs } from './store/docs/actions'
export { watchList, unwatchList, destroyList, unwatchAllLists } from './store/lists/actions'
export { watchPath, unwatchPath, destroyPath, unwatchAllPaths } from './store/paths/actions'

export { getList, getAllLists } from './store/lists/selectors'
export { isLoading } from './store/loadings/selectors'
export { hasError } from './store/errors/selectors'
export { getCol, getAllCols, getAllInitializations } from './store/collections/selectors'
export { getPath, getAllPaths } from './store/paths/selectors'
export { getDoc, getAllDocs } from './store/docs/selectors'
export { isInitialised } from './store/initialization/selectors'

export default firekitReducers
