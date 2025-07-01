import { useLayoutEffect, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LinearProgress from '@mui/material/LinearProgress';
import Loading from '../components/Loading';
import ReviewsPageReview from '../components/ReviewsPageReview';
import './styles/Reviews.css';

function Reviews() {
  const [order, setOrder] = useState('desc');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [loadedReviews, setLoadedReviews] = useState([]);

  useEffect(() => {
    setReviewsLoading(true);
    fetch(`http://localhost:8080/reviews?order=${order}&limit=20`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setReviewsLoading(false);
      });
  }, [order]);

  useLayoutEffect(() => {
    setLoadedReviews(new Array(reviews?.length).fill(false));
  }, [reviews]);

  const handleReviewLoad = (reviewIndex) => {
    setLoadedReviews((prevLoadedReviews) =>
      prevLoadedReviews.map((entry, index) => (index === reviewIndex ? true : entry))
    );
  };

  const reviewsElements = reviews?.map((entry, index) => (
    <ReviewsPageReview
      filmId={entry.movieId}
      userId={entry.userId}
      rating={null} // No rating shown
      text={entry.content}
      onLoad={() => handleReviewLoad(index)}
      key={entry.id}
    />
  ));

  const reviewsReady = !reviewsLoading && !loadedReviews.includes(false);

  const loadingProgress =
    (loadedReviews.filter((entry) => entry === true).length / loadedReviews.length) *
    100;

  const reviewsStyles = {
    display: reviewsReady ? 'initial' : 'none',
  };

  return (
    <div className="Reviews">
      <Helmet>
        <title>Reviews • Stanboxd</title>
      </Helmet>
      <div className="Reviews-content">
        <main className="Reviews-main">
          <div className="Reviews-sectionHeading">
            {order === 'desc' ? 'Latest' : 'Oldest'} reviews
          </div>
          {!reviewsReady && (
            <>
              <LinearProgress
                variant="determinate"
                value={loadingProgress}
                sx={{
                  borderRadius: '5px',
                }}
              />
              <Loading />
            </>
          )}
          <div className="Reviews-reviewsContainer" style={reviewsStyles}>
            {reviewsElements}
          </div>
        </main>
        <aside className="Reviews-aside">
          <div className="Reviews-sectionHeading">Sort by</div>
          <div className="Reviews-buttons">
            <button
              className={`Reviews-button ${order === 'desc' && 'active'}`}
              type="button"
              onClick={() => setOrder('desc')}
            >
              Newest
            </button>
            <button
              className={`Reviews-button ${order === 'asc' && 'active'}`}
              type="button"
              onClick={() => setOrder('asc')}
            >
              Oldest
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Reviews;
