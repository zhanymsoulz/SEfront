import PropTypes from 'prop-types';
import { useEffect } from 'react';

// Simple star display (read-only)
function StarDisplay({ value }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= value ? '#FFD700' : '#888' }}>★</span>
      ))}
    </span>
  );
}

StarDisplay.propTypes = {
  value: PropTypes.number,
};

StarDisplay.defaultProps = {
  value: 0,
};

function ReviewsPageReview({ filmId, userId, rating, text, onLoad, reviewId }) {
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <div className="ReviewsPageReview">
      {/* Example layout, adjust as needed */}
      <div className="ReviewsPageReview-film">Film ID: {filmId}</div>
      <div className="ReviewsPageReview-user">User ID: {userId}</div>
      <div className="ReviewsPageReview-rating">
        Rating: <StarDisplay value={rating || 0} />
      </div>
      <div className="ReviewsPageReview-text">{text}</div>
      {/* Optionally, add edit/delete buttons here if needed */}
    </div>
  );
}

ReviewsPageReview.propTypes = {
  filmId: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  rating: PropTypes.number,
  text: PropTypes.string,
  onLoad: PropTypes.func,
  reviewId: PropTypes.number,
};

ReviewsPageReview.defaultProps = {
  rating: null,
  text: '',
  onLoad: () => {},
  reviewId: null,
};

export default ReviewsPageReview;
