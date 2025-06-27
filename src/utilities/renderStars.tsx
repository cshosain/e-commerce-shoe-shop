import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div>
      {Array(fullStars).fill(null).map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} />
      ))}
      {hasHalfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
      {Array(emptyStars).fill(null).map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: '#ccc' }} />
      ))}
    </div>
  );
};
export default renderStars