import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../util/validators";

import "./TopicForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateTopic = () => {
  // Get the topicId from the route parameters
  const topicId = useParams().topicId;
  
  // State to manage the loaded topic data
  const [loadedTopic, setLoadedTopic] = useState();
  
  // Custom hook for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  // Access the browser's history object
  const history = useHistory();
  
  // Function to format ISO date strings to YYYY-MM-DD
  const formatDateToYYYYMMDD = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  
  // Custom hook for managing form input state
  const [formState, inputHandler, setFormData] = useForm(
    {
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
  
  // Fetch the topic data and update the form
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/topics/${topicId}`
        );
        setLoadedTopic(responseData.topic);
        setFormData(
          {
            startDate: {
              value: formatDateToYYYYMMDD(responseData.topic.startDate),
              isValid: true,
            },
            endDate: {
              value: formatDateToYYYYMMDD(responseData.topic.endDate),
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchTopic();
  }, [topicId, sendRequest, setFormData]);

  // Handler for submitting the updated topic data
  const topicUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/topics/${topicId}`,
        "PATCH",
        JSON.stringify({
          startDate: new Date(formState.inputs.startDate.value).toISOString(),
          endDate: new Date(formState.inputs.endDate.value).toISOString(),
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/topics/");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedTopic && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find topic!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && loadedTopic && (
        <form className="topic-form" onSubmit={topicUpdateSubmitHandler}>
          <div className="topic-item__info">
            <h2>{loadedTopic.title}</h2>
            <p>{loadedTopic.description}</p>
          </div>
          <Input
            id="startDate"
            element="input"
            type="date"
            label="startDate"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid date."
            onInput={inputHandler}
            initialValue={formatDateToYYYYMMDD(loadedTopic.startDate)}
            initialIsValid={true}
          />
          <Input
            id="endDate"
            element="input"
            type="date"
            label="endDate"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid date."
            onInput={inputHandler}
            initialValue={formatDateToYYYYMMDD(loadedTopic.endDate)}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE TOPIC
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdateTopic;
