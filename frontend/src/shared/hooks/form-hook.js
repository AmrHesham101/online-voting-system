import { useCallback, useReducer } from "react";

// Define a reducer function to handle form state changes
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      // Check the validity of all form inputs and update formIsValid
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      // Update the form state with the new input value and its validity
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      // Set the form state based on the provided input data and form validity
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

// Define the custom useForm hook
export const useForm = (initialInputs, initialValidity) => {
  // Initialize the form state using useReducer
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  // Define an input handler function to update the form state when an input changes
  const inputHandler = useCallback((id, value, isValid) => {
    // Dispatch an action to update the form state
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  // Define a function to set the form data based on the provided inputs and validity
  const setFormData = useCallback((inputData, formValidity) => {
    // Dispatch an action to set the form data
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  // Return the form state, input handler, and set form data functions
  return [formState, inputHandler, setFormData];
};
