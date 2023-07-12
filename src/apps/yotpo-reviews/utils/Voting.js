const reviewStorageItem = 'YotpoReviews';

const addItemToStorage = (reviewID, voteType) => {
  const reviewsRaw = localStorage.getItem(reviewStorageItem);
  const reviews = JSON.parse(reviewsRaw) || { downVotes: [], upVotes: [] };
  if (voteType === 'up') {
    if (reviews.upVotes.includes(reviewID)) {
      reviews.upVotes = reviews.upVotes.filter((review) => review !== reviewID);
    } else {
      reviews.upVotes.push(reviewID);
    }
  } else {
    if (reviews.downVotes.includes(reviewID)) {
      reviews.downVotes = reviews.downVotes.filter((review) => review !== reviewID);
    } else {
      reviews.downVotes.push(reviewID);
    }
  }
  localStorage.setItem(reviewStorageItem, JSON.stringify(reviews));
};

const getVotedFor = (reviewID, voteType) => {
  const reviewsRaw = localStorage.getItem(reviewStorageItem);
  const reviews = JSON.parse(reviewsRaw);
  if (!reviews) return false;
  return reviews[`${voteType}Votes`].includes(reviewID);
}

export const voteHistory = (reviewID) => {
  const reviewsRaw = localStorage.getItem(reviewStorageItem);
  const reviews = JSON.parse(reviewsRaw);
  if (!reviews) return false;
  if (reviews.upVotes.includes(reviewID)) return 'up';
  if (reviews.downVotes.includes(reviewID)) return 'down';
  return false;
}

const getVoteEndpoint = (reviewID, voteType) => {
  const reviewPrevVote = voteHistory(reviewID);
  if (reviewPrevVote === false) {
    return `http://api.yotpo.com/reviews/${reviewID}/vote/${voteType}`;
  } else if (reviewPrevVote !== voteType) {
    return `http://api.yotpo.com/reviews/${reviewID}/vote/${voteType}`;
  }
  return `http://api.yotpo.com/reviews/${reviewID}/vote/${voteType}/true`;
}

export const reviewVoteChange = (reviewID, voteType) => {
  const voteEndpoint = getVoteEndpoint(reviewID, voteType);
  const oppositeVote = voteType === 'up' ? 'down' : 'up';
  const shouldUndoOpposite = getVotedFor(reviewID, oppositeVote);

  addItemToStorage(reviewID, voteType);
  if (shouldUndoOpposite) {
    addItemToStorage(reviewID, oppositeVote);
  }

  fetch(voteEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((blob) => blob.json())
    .then((response) => {
      if (shouldUndoOpposite) {
        const undoEndpoint = `http://api.yotpo.com/reviews/${reviewID}/vote/${oppositeVote}/true`;
        fetch(undoEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((undoBlob) => undoBlob.json())
          .then((undoResponse) => {});
      }
    });
}