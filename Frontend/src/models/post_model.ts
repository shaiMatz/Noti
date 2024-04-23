export type Post = {
    id: string;
    content: string | null;
    location: string;
    geo?: {
        type: string;
        coordinates: number[]; // [longitude, latitude]
    };
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
