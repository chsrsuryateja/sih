import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

const handleFileReducer = (state = [], action) => {
  switch (action.type) {
    case "SELECT_FILES":
      return action.filesList;
    case "REMOVE_FILE":
      action.inputRef.removeFile(action.file);
      return state.filter(file => !Object.is(file, action.file));
    default:
      return state;
  }
};

const setRefReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_REF":
      return action.ref;
    default:
      return state;
  }
};

const fetchRoundsReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_ROUNDS":
      return action.payload;
    default:
      return state;
  }
};

const fetchDrives = (state = [], action) => {
  switch (action.type) {
    case "FETCH_DRIVES":
      return action.payload;
    default:
      return state;
  }
};

const handleSetAddRound = (state = -1, action) => {
  switch (action.type) {
    case "SET_ADD_ROUND":
      return action.payload;
    default:
      return state;
  }
};

const handleSetEditDrive = (state = -1, action) => {
  switch (action.type) {
    case "SET_EDIT_DRIVE":
      return action.payload;
    default:
      return state;
  }
};

const fetchYearReducer = (state = [], action) => {
  switch(action.type) {
    case "FETCH_YEARS":
      return action.data;
    default:
      return state;
  }
}

const setDefaultDate = (state = null, action) => {
  switch(action.type) {
    case "SET_DEF_DATE":
      console.log("hi");
      return action.payload;
    default:
      return state;
  }
}

const setDefaultRounds = (state = [], action) => {
  switch(action.type) {
    case "SET_DEF_ROUNDS":
      return action.payload;
    default:
      return state
  }
}
export default combineReducers({
  selectedFiles: handleFileReducer,
  inputRef: setRefReducer,
  roundsList: fetchRoundsReducer,
  form: formReducer,
  drives: fetchDrives,
  setAddRound: handleSetAddRound,
  setEditDrive: handleSetEditDrive,
  driveYears: fetchYearReducer,
  defaultDate: setDefaultDate,
  defaultRounds: setDefaultRounds
});
