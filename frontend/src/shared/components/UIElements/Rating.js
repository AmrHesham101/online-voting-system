import React from "react";
import { StarIcon as EmptyStarIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import "./Rating.css"; // Import your CSS file

export default function Rating({ rating }) {
  return (
    <div className="rating-container">
      {rating >= 0.5 ? <StarIcon className="star-icon" /> : <EmptyStarIcon className="empty-star-icon" />}
      {rating >= 1.5 ? <StarIcon className="star-icon" /> : <EmptyStarIcon className="empty-star-icon" />}
      {rating >= 2.5 ? <StarIcon className="star-icon" /> : <EmptyStarIcon className="empty-star-icon" />}
      {rating >= 3.5 ? <StarIcon className="star-icon" /> : <EmptyStarIcon className="empty-star-icon" />}
      {rating >= 4.5 ? <StarIcon className="star-icon" /> : <EmptyStarIcon className="empty-star-icon" />}
    </div>
  );
}
