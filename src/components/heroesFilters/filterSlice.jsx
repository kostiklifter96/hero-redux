import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterAddapter = createEntityAdapter();
const initialState = filterAddapter.getInitialState({
    filtersLoadingStatus: "idle",
    activeFilter: "all",
});

// const initialState = {
//     filters: [],
// filtersLoadingStatus: "idle",
// activeFilter: "all",
// };

export const fetchFilters = createAsyncThunk("filters/fetchFilters", () => {
    const { request } = useHttp();
    return request("http://localhost:3001/filters");
});

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, (state) => {
                state.filtersLoadingStatus = "loading";
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = "idle";
                filterAddapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, (state) => {
                state.filtersLoadingStatus = "error";
            })
            .addDefaultCase(() => {});
    },
});

export const { selectAll } = filterAddapter.getSelectors(
    (state) => state.reducerFilters,
);

// const filterSlice = createSlice({
//     name: "filters",
//     initialState,
//     reducers: {
//         activeFilterChanged: (state, action) => {
//             state.activeFilter = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchFilters.pending, (state) => {
//                 state.filtersLoadingStatus = "loading";
//             })
//             .addCase(fetchFilters.fulfilled, (state, action) => {
//                 state.filtersLoadingStatus = "idle";
//                 state.filters = action.payload;
//             })
//             .addCase(fetchFilters.rejected, (state) => {
//                 state.filtersLoadingStatus = "error";
//             })
//             .addDefaultCase(() => {});
//     },
// });

const { actions, reducer } = filterSlice;

export default reducer;
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged,
} = actions;
