import React, { useEffect, useState } from "react";
import TopicList from "../components/TopicList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Button from "../../shared/components/FormElements/Button";

const Topics = (props) => {
  // State to manage the filter type and loaded topics
  const [filterType, setFilterType] = useState("");
  const [loadedTopics, setLoadedTopics] = useState([]);
  
  // Custom hook for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Fetch topics based on filter type or all topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (filterType !== "" && props.filtered) {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/topics/filtered/${filterType}`
          );
          setLoadedTopics(responseData.topics);
        } else {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/topics/`
          );
          setLoadedTopics(responseData.topics);
        }
      } catch (err) {
        setLoadedTopics([]);
      }
    };
    fetchTopics();
  }, [filterType, props.filtered, sendRequest]);

  // Handler for when a topic is deleted
  const topicDeletedHandler = (deletedTopicId) => {
    setLoadedTopics((prevTopics) =>
      prevTopics.filter((topic) => topic.id !== deletedTopicId)
    );
  };

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {error && <ErrorModal error={error} onClear={clearError} />}

      {props.filtered && (
        <div style={{ display: "flex" }}>
          <h1>Filter :</h1>
          <div style={{ margin: "auto" }}>
            <Button green onClick={() => setFilterType("active")}>
              active
            </Button>
            <Button green onClick={() => setFilterType("recently-finished")}>
              recently-finished
            </Button>
            <Button green onClick={() => setFilterType("coming-soon")}>
              coming-soon
            </Button>
          </div>
        </div>
      )}
      
      {/* Render the list of loaded topics when not loading and topics are available */}
      {!isLoading && loadedTopics && (
        <TopicList items={loadedTopics} onDeleteTopic={topicDeletedHandler} />
      )}
    </>
  );
};

export default Topics;
