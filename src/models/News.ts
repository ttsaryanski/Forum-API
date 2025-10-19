import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
    title: string;
    content: string;
    createdAt: Date;
}

const NewsSchema = new Schema<INews>({
    title: {
        type: String,
        required: [true, "News title is required!"],
        minLength: [3, "News title should be at least 3 characters long!"],
    },
    content: {
        type: String,
        required: [true, "News content is required!"],
        minLength: [3, "News content should be at least 3 characters long!"],
    },
    createdAt: { type: Date, default: Date.now },
});

export const News = mongoose.model<INews>("News", NewsSchema);
