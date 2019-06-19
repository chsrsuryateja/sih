import tnpbase from "../api/tnpbase";
import { async } from "q";

export const SelectFiles = files => {
  return {
    type: "SELECT_FILES",
    filesList: files
  };
};

export const RemoveFile = (file, inputRef) => {
  return {
    type: "REMOVE_FILE",
    file: file,
    inputRef: inputRef
  };
};

export const SetRef = ref => {
  return {
    type: "SET_REF",
    ref: ref
  };
};

export const FetchRounds = () => async dispatch => {
  const response = await tnpbase.get("/rounds");
  dispatch({ type: "FETCH_POSTS", payload: response });
};

export const FetchUpcomingDrives = () => async dispatch => {
  const response = await tnpbase.get("/drives/upcoming");
  dispatch({type: "FETCH_UPCOMING_DRIVES", payload: response.data});
};

export const FetchDrives = (year) => async dispatch => {
  const response = await tnpbase.get("/drives/year", {data: year});
  dispatch({type: "FETCH_DRIVES", payload: response.data});
};

export const FetchPerfData = (drive_id, date) => async dispatch => {
  const data = { drive_id,date}
  const response = await tnpbase.get("/drive/performance", { data});
  dispatch({type: "FETCH_PERF_DATA", payload: response.data})
};
