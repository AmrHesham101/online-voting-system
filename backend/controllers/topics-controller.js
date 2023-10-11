// Import required modules and packages
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const TopicModal = require("../models/topic");
const UserModel = require("../models/user");

// Function to format an ISO date string to 'YYYY-MM-DD' format
const formatDateToYYYYMMDD = (isoDateString) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get a topic by its ID
const getTopicById = async (req, res, next) => {
  const topicId = req.params.tid;
  let topic;
  try {
    // Find a topic by its ID
    topic = await TopicModal.findById(topicId);
  } catch (err) {
    // Handle errors
    return next(new HttpError("Something went wrong, could not find a topic", 500));
  }
  if (!topic) {
    // Handle the case where no topic is found
    return next(new HttpError("Could not find a topic for the provided id.", 404));
  }
  res.json({ topic: topic.toObject({ getters: true }) });
};

// Get all topics or apply filters if specified
const getAllOrFilteredTopics = async (req, res, next) => {
  let topics;
  try {
    // Retrieve all topics initially
    topics = await TopicModal.find({});
  } catch (error) {
    return next(new HttpError("Fetching topics failed, please try again later", 500));
  }
  
  // Define date ranges for filtering
  const currentDate = formatDateToYYYYMMDD(new Date());
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  
  const filterType = req.params.filterType; // Assuming you pass the filter type in the URL
  let filteredResults = [];
  try {
    // Apply filter based on the filterType parameter
    if (filterType === "active") {
      // Filter topics that are currently active
      filteredResults = topics.filter(
        (topic) =>
          formatDateToYYYYMMDD(topic.startDate) <= currentDate &&
          formatDateToYYYYMMDD(topic.endDate) >= currentDate
      );
    } else if (filterType === "recently-finished") {
      // Filter topics that recently finished within a week
      filteredResults = topics.filter(
        (topic) =>
          formatDateToYYYYMMDD(topic.endDate) <= currentDate &&
          formatDateToYYYYMMDD(topic.endDate) >= formatDateToYYYYMMDD(oneWeekAgo)
      );
    } else if (filterType === "coming-soon") {
      // Filter topics that are coming soon within a week
      filteredResults = topics.filter(
        (topic) =>
          formatDateToYYYYMMDD(topic.startDate) >= currentDate &&
          formatDateToYYYYMMDD(topic.startDate) <= formatDateToYYYYMMDD(oneWeekLater)
      );
    } else {
      // Default case: no filter, return all topics sorted by start date in descending order
      filteredResults = await TopicModal.find({}).sort({ startDate: -1 });
    }
  } catch (error) {
    return next(new HttpError("Fetching topics failed, please try again later", 500));
  }

  if (!filteredResults || filteredResults.length === 0) {
    return next(new HttpError("No topics found.", 404));
  }

  res.json({
    topics: filteredResults.map((topic) => topic.toObject({ getters: true })),
  });
};

// Create a new topic
const createTopic = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, startDate, endDate } = req.body;

  // Validate that endDate is not earlier than startDate
  if (new Date(endDate) < new Date(startDate)) {
    return next(new HttpError("End date cannot be earlier than start date", 422));
  }

  const createdTopic = new TopicModal({
    title,
    description,
    startDate,
    endDate,
  });

  try {
    await createdTopic.save();
  } catch (error) {
    return next(new HttpError("Creating topic failed, please try again", 500));
  }

  res.status(201).json({ topic: createdTopic.toObject({ getters: true }) });
};

// Update a topic by its ID
const updateTopic = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const topicId = req.params.tid;

  try {
    const topic = await TopicModal.findById(topicId);

    if (!topic) {
      return next(new HttpError("Could not find topic for this id", 404));
    }

    // Check if the topic's start date is in the future for extension
    const currentDate = new Date();
    if (startDate && new Date(startDate) <= currentDate) {
      return next(new HttpError("Start date must be in the future for extension", 422));
    }

    // Check if the topic's end date is in the future for extension
    if (endDate && new Date(endDate) <= currentDate) {
      return next(new HttpError("End date must be in the future for extension", 422));
    }

    // Update start date and end date if provided and valid
    if (startDate) {
      topic.startDate = startDate;
    }
    if (endDate) {
      topic.endDate = endDate;
    }

    await topic.save();
    res.status(200).json({ topic: topic.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError("Something went wrong, could not update topic", 500));
  }
};

// Delete a topic by its ID
const deleteTopic = async (req, res, next) => {
  const topicId = req.params.tid;

  try {
    const topic = await TopicModal.findById(topicId);

    if (!topic) {
      return next(new HttpError("Could not find topic for this id", 404));
    }

    // Delete the topic
    topic.deleteOne();

    res.status(200).json({ message: "Deleted topic" });
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete topic", 500));
  }
};

// Vote for a topic
const voteForTopic = async (req, res, next) => {
  const nationalId = req.body.nationalId; // Assuming you have the nationalId in the request params

  // Check if nationalId is exactly 14 characters in length
  if (nationalId.length !== 14) {
    return res
      .status(422)
      .json({ message: "National ID must be 14 characters long." });
  }

  // Check if the user has already voted for this topic
  const topicId = req.params.tid;
  const topic = await TopicModal.findById(topicId);

  if (!topic) {
    return next(new HttpError("Could not find topic for this id", 404));
  }

  if (topic.voters.find((x) => x.nationalId == nationalId)) {
    // User has already voted, return an error response
    return res
      .status(422)
      .json({ message: "You have already voted for this topic." });
  } else {
    const voter = {
      nationalId: nationalId,
      rating: Number(req.body.rating),
    };
    topic.voters.push(voter);
    topic.rating =
      topic.voters.reduce((a, c) => c.rating + a, 0) / topic.voters.length;
    topic.save();
    res.status(201).send({
      message: "Vote submitted",
    });
  }
};

// Export the controller functions
exports.updateTopicById = updateTopic;
exports.getTopicById = getTopicById;
exports.deleteTopicById = deleteTopic;
exports.getAllOrFilteredTopics = getAllOrFilteredTopics;
exports.createTopic = createTopic;
exports.voteForTopic = voteForTopic;
