import React from "react";

import Card from "../../shared/components/UIElements/Card";

import "./TopicList.css";
import TopicItem from "./TopicItem";
import Button from "../../shared/components/FormElements/Button";
const TopicList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="topic-list center">
        <Card>
          <h2>No TOPICS found. Maybe create one?</h2>
          <Button to="/topics/new">Create Topic</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="topic-list">
      {props.items.map((topic) => (
        <TopicItem
          key={topic.id}
          id={topic.id}
          title={topic.title}
          description={topic.description}
          startDate={topic.startDate}
          endDate={topic.endDate}
          onDelete={props.onDeleteTopic}
          rating={topic.rating}
        />
      ))}
    </ul>
  );
};

export default TopicList;
