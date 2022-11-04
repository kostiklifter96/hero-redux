import { configureStore } from '@reduxjs/toolkit'
import reducerFilters from '../components/heroesFilters/filterSlice'
import reducerHeroes from '../components/heroesList/heroesSlice'

//* может расширять функцию dispatch
const stringMiddleware =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        if (typeof action === 'string') {
            return next({
                type: action,
            })
        }
        return next(action)
    }

//* может расширять любую часть стора
const enhancer =
    (createStore) =>
    (...arg) => {
        const store = createStore(...arg)

        const oldDispatch = store.dispatch
        store.dispatch = (action) => {
            if (typeof action === 'string') {
                return oldDispatch({
                    type: action,
                })
            }
            return oldDispatch(action)
        }
        return store
    }

// const store = createStore(
//   combineReducers({ reducerFilters, reducerHeroes }),
//   compose(
//     applyMiddleware(ReduxThunk, stringMiddleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ &&
//       window.__REDUX_DEVTOOLS_EXTENSION__(),
//   ),
// )

const store = configureStore({
    reducer: { reducerFilters, reducerHeroes },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})
export default store
