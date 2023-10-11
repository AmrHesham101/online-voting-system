import React from "react";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom";
import "./TopicForm.css";

const NewTopic = () => {
  // Custom hook for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Form State Management
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      startDate: {
        value: "",
        isValid: false,
      },
      endDate: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  // Submit Handler for Creating a New Topic
  const topicSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to create a new topic
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/topics/",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          startDate: new Date(formState.inputs.startDate.value).toISOString(),
          endDate: new Date(formState.inputs.endDate.value).toISOString(),
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/");
    } catch (err) {
      // Handle errors, if any
    }
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}

      <form className="topic-form" onSubmit={topicSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}

        {/* Input for Topic Title */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />

        {/* Input for Topic Description */}
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />

        {/* Input for Topic Start Date */}
        <Input
          id="startDate"
          element="input"
          type="date"
          label="startDate"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid date ."
          onInput={inputHandler}
        />

        {/* Input for Topic End Date */}
        <Input
          id="endDate"
          element="input"
          type="date"
          label="endDate"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid date."
          onInput={inputHandler}
        />

        {/* Button to Submit the Topic */}
        <Button type="submit" disabled={!formState.isValid}>
          ADD TOPIC
        </Button>
      </form>
    </>
  );
};

export default NewTopic;
