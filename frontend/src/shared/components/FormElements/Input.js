import React, { useReducer, useEffect } from "react";

import { validate } from "../../../util/validators";
import "./Input.css";

// Define a reducer function to manage the input state
const inputReducer = (state, action) => {
  switch (action.type) {
    // When an input value changes
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators), // Validate the new value
      };
    // When the input is touched (focused)
    case "TOUCH":
      return {
        ...state,
        isTouched: true, // Mark the input as touched
      };
    default:
      return state;
  }
};

// Create an Input component
const Input = (props) => {
  // Initialize the input state using the useReducer hook
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",     // Initial input value (or an empty string)
    isValid: props.initialIsValid || false, // Initial validity state (or false)
    isTouched: false,                     // Initial touched state (false)
  });

  // Destructure values from the input state
  const { id, onInput, element } = props;
  const { value, isValid } = inputState;

  // Use useEffect to call onInput when input state changes
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, isValid, onInput, value]);

  // Handle changes to the input value
  const changeHandler = (event) => {
    const newValue =
      element === "select" ? event.target.value : event.target.value;

    // Validate the new value based on element type
    const updatedIsValid =
      element === "select" ? true : validate(newValue, props.validators);

    // Dispatch a CHANGE action to update the input state
    dispatch({ type: "CHANGE", val: newValue, validators: props.validators });

    // Call the onInput function with the new value and validity
    onInput(id, newValue, updatedIsValid);
  };

  // Handle input focus (touched state)
  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  // Render the input element based on the element prop
  const elementOutput =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onBlur={touchHandler}
        onChange={changeHandler}
        value={inputState.value}
      />
    ) : props.element === "select" ? (
      <select
        id={props.id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  // Render the complete input component
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {elementOutput}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
