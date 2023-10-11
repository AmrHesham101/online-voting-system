import React, { useContext, useEffect, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./TopicItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";
import Rating from "../../shared/components/UIElements/Rating";

const TopicItem = (props) => {
  // Context and State Management
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [voteCount, setVoteCount] = useState(props.rating); // State to track vote count

  // Event Handlers for Modals
  const showDeleteWarningHandler = () => setShowDeleteModal(true);
  const showVoteWarningHandler = () => setShowVoteModal(true);
  const cancelDeleteHandler = () => setShowDeleteModal(false);
  const cancelVoteHandler = () => setShowVoteModal(false);

  // Form State Management
  const [formState, inputHandler] = useForm(
    {
      nationalId: {
        value: "",
        isValid: false,
      },
      rating: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  // Function to Format Dates in "YYYY-MM-DD" Format
  const formatDateToYYYYMMDD = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Confirm Deletion of a Topic
  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/topics/${props.id}`,
        "DELETE",
        null
      );
      props.onDelete(props.id);
      history.push("/");
    } catch (err) {
      // Handle error
    }
  };

  // Confirm Voting for a Topic
  const confirmVoteHandler = async (event) => {
    event.preventDefault();
    setShowVoteModal(false);
    try {
      // Send a request to vote for the topic
      const updatedVoteCount = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/topics/vote/${props.id}`,
        "POST",
        JSON.stringify({
          nationalId: formState.inputs.nationalId.value,
          rating: formState.inputs.rating.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setVoteCount(updatedVoteCount); // Update vote count state
      history.push("/");
    } catch (err) {
      // Handle error
    }
  };

  // Update Vote Count State When It Changes
  useEffect(() => {
    setVoteCount(props.rating);
  }, [props.rating]);

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="topic-item__modal-actions"
        footer={
          <>
            <Button onClick={cancelDeleteHandler} inverse>
              Cancel
            </Button>
            <Button onClick={confirmDeleteHandler} danger>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this topic? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <Modal
        show={showVoteModal}
        onCancel={cancelVoteHandler}
        header="Are you sure?"
        footerClass="topic-item__modal-actions"
        onSubmit={confirmVoteHandler}
        footer={
          <>
            <Button type="button" onClick={cancelVoteHandler} inverse>
              Cancel
            </Button>
            <Button type="submit" disabled={!formState.isValid} green>
              VOTE
            </Button>
          </>
        }
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="rating"
          element="select"
          label="Rating"
          validators={[VALIDATOR_REQUIRE()]}
          options={[
            { value: 0, label: "0 star" },
            { value: 1, label: "1 star" },
            { value: 2, label: "2 stars" },
            { value: 3, label: "3 stars" },
            { value: 4, label: "4 stars" },
            { value: 5, label: "5 stars" },
          ]}
          errorText="Please select a rating"
          onInput={inputHandler}
        />

        <Input
          id="nationalId"
          type="text"
          element="input"
          label="National Id"
          validators={[VALIDATOR_MINLENGTH(14)]}
          errorText="Please enter a valid national id (at least 14 characters)."
          onInput={inputHandler}
        />
        <p>
          Do you want to proceed and vote for this topic? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li
        className="topic-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Card>
          <div className="topic-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <div className="topic-date">
              <p>{formatDateToYYYYMMDD(props.startDate)}</p>
              <p>{formatDateToYYYYMMDD(props.endDate)}</p>
            </div>
            {isHovered && (
              <div>
                <p>Rating: {voteCount}</p> {/* Updated vote count */}
                <Rating rating={voteCount} /> {/* Display rating as stars */}
              </div>
            )}
          </div>
          {isHovered && (
            <div className="topic-item__actions">
              {auth.token && <Button to={`/topics/${props.id}`}>EDIT</Button>}
              {auth.token && (
                <Button onClick={showDeleteWarningHandler} danger>
                  DELETE
                </Button>
              )}
              {formatDateToYYYYMMDD(props.startDate) <=
                formatDateToYYYYMMDD(new Date()) &&
                formatDateToYYYYMMDD(props.endDate) >=
                  formatDateToYYYYMMDD(new Date()) && (
                  <Button onClick={showVoteWarningHandler} green>
                    VOTE
                  </Button>
                )}
            </div>
          )}
        </Card>
      </li>
    </>
  );
};

export default TopicItem;
