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
  console.log("year", year)
  if (year === "upcoming") {
    const response = await tnpbase.get("/drives/upcoming");
    dispatch({ type: "FETCH_DRIVES", payload: response.data.result });
  } else {
    const response = await tnpbase.post("/drives/olddrive", { data: year });
    dispatch({ type: "FETCH_DRIVES", payload: response.data.result });
  }
};

export const setAddRoundAction = driveID => {
  return {
    type: "SET_ADD_ROUND",
    payload: driveID
  };
};

export const setEditDriveAction = driveID => {
  return {
    type: "SET_EDIT_DRIVE",
    payload: driveID
  };
};

export const fetchYears = () => async dispatch => {
  const response = await tnpbase.get("/passing/year");
  dispatch({ type: "FETCH_YEARS", data: response.data.result});
}

export const setDefaultDate = (date) => {
  return{
    type: "SET_DEF_DATE",
    payload: date
  };
}

export const setDefaultRounds = rounds => {
  return {
    type: "SET_DEF_ROUNDS",
    payload: rounds
  }
}
