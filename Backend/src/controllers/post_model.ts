import mongoose, { Document } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  location: string;
  image: string;
  geo: {
    type: string;
    coordinates: number[];  // [longitude, latitude]
  };
}

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  geo: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, {
  timestamps: true
});

// Create a geospatial index on the geo field
postSchema.index({ geo: '2dsphere' });

export default mongoose.model<IPost>("Post", postSchema, "posts");
