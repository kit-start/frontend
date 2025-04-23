import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
// import { counterSlice } from "../components/common/counter (deprecated)/model/counterSlice";
// import { quotesApiSlice } from "../components/common/quotes (deprecated)/model/quotesApiSlice";
import { projectsApiSlice } from "../components/pages/ProjectsPage/model/projectsApiSlice";
import { fieldsApiSlice } from "../components/pages/ProjectsPage/model/fieldsApiSlice";
import { documentsApi } from "../services/documentsApi";

// Определяем тип для состояния авторизации
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

// Расширяем RootState, чтобы включить auth
export interface RootState {
  auth?: AuthState;
  projectsApiSlice: ReturnType<typeof projectsApiSlice.reducer>;
  fieldsApiSlice: ReturnType<typeof fieldsApiSlice.reducer>;
  documentsApi: ReturnType<typeof documentsApi.reducer>;
}

// `combineSlices` автоматически комбинирует редьюсеры, используя их `reducerPath`
const rootReducer = combineSlices(
  projectsApiSlice, 
  fieldsApiSlice, 
  documentsApi
)

// Настройка хранилища обернута в `makeStore` для возможности повторного использования 
// при настройке тестов, которым нужна та же конфигурация хранилища
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Добавление API middleware позволяет включить кэширование, аннулирование, опрос 
    // и другие полезные функции `rtk-query`.
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(
        projectsApiSlice.middleware, 
        fieldsApiSlice.middleware,
        documentsApi.middleware
      )
    },
    preloadedState,
  })
  // Настройка слушателей для функций типа `refetchOnFocus`/`refetchOnReconnect`
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Тип `store`
export type AppStore = typeof store
// Тип `AppDispatch` из самого хранилища
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
