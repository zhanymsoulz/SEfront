import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import Poster from './Poster';
import StarRating from './StarRating';
import './styles/ReviewForm.css';

function ReviewForm({
  uid,
  filmId,
  filmTitle,
  releaseYear,
  posterPath,
  reviewText,
  reviewRating,
  reviewId, // <-- use reviewId (number or null)
  closePanel,
}) {
  const [text, setText] = useState(reviewText);
  const [rating, setRating] = useState(reviewRating);
  const [expandTextarea, setExpandTextArea] = useState(false);
  const [showDelete] = useState(!!reviewId);
  const emptyReviewToastId = useRef(null);

  useEffect(
    () => () => {
      if (emptyReviewToastId.current) {
        toast.dismiss(emptyReviewToastId.current);
      }
    },
    [text, rating]
  );

  const deleteReview = async () => {
    if (reviewId) {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success('Review has been successfully deleted.');
      } else {
        toast.error('Failed to delete review.');
      }
    } else {
      toast.error('Review has already been deleted.');
    }
    closePanel();
  };

  const updateReview = async () => {
    const token = localStorage.getItem('token');
    if (reviewId) {
      // Update existing review
      const response = await fetch(`http://localhost:8080/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: uid,
          movieId: filmId,
          content: text,
          rating,
        }),
      });
      if (response.ok) {
        toast.success('Review has been successfully updated.');
      } else {
        toast.error('Failed to update review.');
      }
    } else {
      // Create new review
      const response = await fetch('http://localhost:8080/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: uid,
          movieId: filmId,
          content: text,
          rating,
        }),
      });
      if (response.ok) {
        toast.success('Review has been successfully added.');
      } else {
        toast.error('Failed to add review.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      await deleteReview();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating && !text) {
      emptyReviewToastId.current = toast.error('Review cannot be empty.', {
        id: 'emptyReview',
      });
      return;
    }

    await updateReview();
    closePanel();
  };

  const textareaStyles = {
    height: expandTextarea ? '250px' : '80px',
  };

  return (
    <div className="ReviewForm">
      <div className="ReviewForm-posterContainer">
        <Poster path={posterPath} size="w154" altText={filmTitle} />
      </div>
      <form className="ReviewForm-form" onSubmit={handleSubmit}>
        <p className="ReviewForm-header">I watched...</p>
        <button className="ReviewForm-close" type="button" onClick={closePanel}>
          ×
        </button>
        <div className="ReviewForm-filmInfo">
          <p className="ReviewForm-filmTitle">{filmTitle}</p>
          <p className="ReviewForm-filmRelease">{releaseYear}</p>
        </div>
        <textarea
          className="ReviewForm-textarea"
          style={textareaStyles}
          placeholder="Add a review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onClick={() => setExpandTextArea(true)}
        />
        <div className="ReviewForm-ratingContainer">
          <div className="ReviewForm-ratingTop">
            <p className="ReviewForm-ratingTitle">Rating</p>
            <p className="ReviewForm-ratingDescription">
              {rating && `${rating} out of 5`}
            </p>
          </div>
          <StarRating value={rating} setValue={setRating} />
        </div>
        <div className="ReviewForm-buttons">
          {showDelete && (
            <button
              className="ReviewForm-delete"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button className="ReviewForm-submit" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

ReviewForm.propTypes = {
  uid: PropTypes.string.isRequired,
  filmId: PropTypes.number.isRequired,
  filmTitle: PropTypes.string.isRequired,
  releaseYear: PropTypes.number,
  posterPath: PropTypes.string,
  reviewText: PropTypes.string,
  reviewRating: PropTypes.number,
  reviewId: PropTypes.number, // <-- use reviewId, not reviewRef
  closePanel: PropTypes.func.isRequired,
};

ReviewForm.defaultProps = {
  releaseYear: null,
  posterPath: null,
  reviewText: '',
  reviewRating: null,
  reviewId: null,
};

export default ReviewForm;