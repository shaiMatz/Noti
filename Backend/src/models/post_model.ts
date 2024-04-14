import mongoose, {Document} from "mongoose";

export interface IPost extends Document {
    userId: string;
    content: string;
    location: string;
    image: string;
}

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema, "Post");
