export interface RatingBreakdown {
  star: number;
  count: number;
}

export interface Review {
  id: string;
  userName: string;
  img: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface ReviewData {
  averageRating: number;
  totalRatings: number;
  ratingsBreakdown: RatingBreakdown[];
  categoryRatings: {
    cleanliness: number;
    safety: number;
    staff: number;
    amenities: number;
    location: number;
  };
  reviews: Review[];
}

export const dummyReviewData: ReviewData = {
  averageRating: 4.6,
  totalRatings: 35000,
  ratingsBreakdown: [
    { star: 5, count: 14000 },
    { star: 4, count: 6000 },
    { star: 3, count: 4000 },
    { star: 2, count: 800 },
    { star: 1, count: 9000 },
  ],
  categoryRatings: {
    cleanliness: 4.0,
    safety: 4.0,
    staff: 4.0,
    amenities: 3.5,
    location: 3.0,
  },
  reviews: [
    {
      id: "1",
      userName: "Alexander Rity",
      img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
      rating: 5.0,
      comment:
        "Easy booking, great value! Cozy rooms at a reasonable price in Sheffield's vibrant center. Surprisingly quiet with nearby Traveller’s accommodations. Highly recommended!",
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
      ],
      createdAt: "2025-04-20T10:00:00Z",
    },
    {
      id: "2",
      userName: "Emma Creight",
      img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a1a6fce-e35c-4a32-893c-9704f2868423/NIKE+VOMERO+18.png",
      rating: 4.5,
      comment:
        "Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing, it’s a peaceful gem. Thumbs up!",
      images: [],
      createdAt: "2025-04-18T12:00:00Z",
    },
  ],
};
