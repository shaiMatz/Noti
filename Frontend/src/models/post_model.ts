// Define the interface for the Post model
export interface IPost {
  _id: string;
  userId: string;
  content: string;
  location: string;
  image?: string;
  geo: {
    type: "Point";
    coordinates: number[]; // [longitude, latitude]
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Implementing the interface with a class
export class Post implements IPost {
  _id: string;
  userId: string;
  content: string;
  location: string;
  image?: string;
  geo: {
    type: "Point";
    coordinates: number[];
  };
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    _id,
    userId,
    content,
    location,
    image,
    geo,
    createdAt,
    updatedAt,
  }: IPost) {
    this._id = _id;
    this.userId = userId;
    this.content = content;
    this.location = location;
    this.image = image;
    this.geo = geo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Example method: Get a formatted location string.
   */
  getLocationString(): string {
    return `Location: ${this.location}`;
  }

  /**
   * Example method: Get content summary.
   */
  getContentSummary(maxLength: number = 100): string {
    return this.content.length > maxLength
      ? `${this.content.substring(0, maxLength)}...`
      : this.content;
  }

  /**
   * Example method: Check if the post contains geo-location data.
   */
  hasGeoLocation(): boolean {
    return this.geo && this.geo.coordinates.length === 2;
  }
}
