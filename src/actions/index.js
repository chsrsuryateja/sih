import tnpbase from "../api/tnpbase";

export const selectFiles = files => {
  return {
    type: "SELECT_FILES",
    filesList: files
  };
};

export const removeFile = (file, inputRef) => {
  return {
    type: "REMOVE_FILE",
    file: file,
    inputRef: inputRef
  };
};

export const setRef = ref => {
  return {
    type: "SET_REF",
    ref: ref
  };
};

export const fetchRounds = () => async dispatch => {
  const response = await tnpbase.get("/rounds");
  dispatch({ type: "FETCH_ROUNDS", payload: response.data.result });
};

export const fetchDrives = (year) => async dispatch => {
  if (year === "") {
    const response = await tnpbase.get("/drives/upcoming");
    dispatch({ type: "FETCH_DRIVES", payload: response.data.result });
  } else {
    const response = await tnpbase.get("/drives/year", { data: year });
    dispatch({ type: "FETCH_DRIVES", payload: response.data.result });
  }
};

export const setAddRound = driveID => {
  return {
    type: "SET_ADD_ROUND",
    payload: driveID
  };
};

export const setEditDrive = driveID => {
  return {
    type: "SET_EDIT_DRIVE",
    payload: driveID
  };
};

export const fetchYears = () => async dispatch => {
  const response = await tnpbase.get("/passing/year");
  dispatch({ type: "FETCH_YEARS", data: response.data.result});
}
