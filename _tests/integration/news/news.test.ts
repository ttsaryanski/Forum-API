import request from "supertest";
import mongoose from "mongoose";

import app from "../../../src/app";
import { News, INews } from "../../../src/models/News.js";

import { CreateNewsDataType } from "../../../src/validators/news/news.schema.js";

describe("GET /news", () => {
    it("should return empty array", async () => {
        const res = await request(app).get("/api/news");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it("should return all existing news", async () => {
        await News.create([
            {
                title: "Title 1",
                content: "Content 1",
            },
            {
                title: "Title 2",
                content: "Content 2",
            },
        ] as INews[]);

        const res = await request(app).get("/api/news");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("content");
    });
});

describe("POST /news", () => {
    beforeEach(async () => {
        await News.deleteMany();
    });

    it("should create new news and return 201", async () => {
        const createData: CreateNewsDataType = {
            title: "Test title",
            content: "Test content",
        };

        const res = await request(app).post("/api/news").send(createData);

        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Test title");

        const dbEntry = await News.findOne({ title: "Test title" });
        expect(dbEntry).not.toBeNull();
    });

    it("should return 400 if data is incorrect - title", async () => {
        const incorrectNewsTitle: CreateNewsDataType = {
            title: "V",
            content: "Valid content",
        };

        const res = await request(app)
            .post("/api/news")
            .send(incorrectNewsTitle);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News title should be at least 3 characters long!"
        );

        const dbEntry = await News.findOne({ title: "V" });
        expect(dbEntry).toBeNull();
    });

    it("should return 400 if data is incorrect - content", async () => {
        const incorrectNewsContent: CreateNewsDataType = {
            title: "Valid title",
            content: "V",
        };

        const res = await request(app)
            .post("/api/news")
            .send(incorrectNewsContent);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News content should be at least 3 characters long!"
        );

        const dbEntry = await News.findOne({ title: "Valid title" });
        expect(dbEntry).toBeNull();
    });
});

describe("PUT /news/:newsId", () => {
    let news: INews;
    beforeEach(async () => {
        await News.deleteMany();

        news = (await News.create({
            title: "News title",
            content: "News content",
        })) as INews;
    });

    const editedData: CreateNewsDataType = {
        title: "Edited title",
        content: "Edited content",
    };

    const fakeData = {
        title: "V",
        content: "V",
    };

    it("should edit news by id", async () => {
        const res = await request(app)
            .put(`/api/news/${news._id}`)
            .send(editedData);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Edited title");
    });

    it("should return 400 if newsId is invalid", async () => {
        const res = await request(app)
            .put("/api/news/invalidId")
            .send(editedData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );
    });

    it("should return 400 if invalid data", async () => {
        const res = await request(app)
            .put(`/api/news/${news._id}`)
            .send(fakeData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBeDefined();
    });

    it("should return 404 if news not found!", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/news/${nonExistingId}`)
            .send(editedData);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("News not found!");
    });
});

describe("DELETE /news/:newsId", () => {
    let news: INews;
    beforeEach(async () => {
        await News.deleteMany();

        news = (await News.create({
            title: "News title",
            content: "News content",
        })) as INews;
    });

    it("should remove news by id", async () => {
        const res = await request(app).delete(`/api/news/${news._id}`);

        expect(res.status).toBe(204);

        const dbEntry = await News.findOne({ title: "News title" });
        expect(dbEntry).toBeNull();
    });

    it("should return 400 if newsId is invalid", async () => {
        const res = await request(app).delete("/api/news/invalidId");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );

        const dbEntry = await News.findOne({ title: "News title" });
        expect(dbEntry).not.toBeNull();
    });

    it("should return 404 if news not found!", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();

        const res = await request(app).delete(`/api/news/${nonExistingId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("News not found!");

        const dbEntry = await News.findOne({ title: "News title" });
        expect(dbEntry).not.toBeNull();
    });
});

describe("GET /news/:newsId", () => {
    let news: INews;
    beforeEach(async () => {
        await News.deleteMany();

        news = (await News.create({
            title: "News title",
            content: "News content",
        })) as INews;
    });

    it("should return one news by id", async () => {
        const res = await request(app).get(`/api/news/${news._id}`);
        console.log(res.body);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("News title");
        expect(res.body).toHaveProperty("_id", String(news._id));
    });

    it("should return 400 if newsId is invalid", async () => {
        const res = await request(app).get("/api/news/invalidId");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );
    });

    it("should return 404 if news not found!", async () => {
        const nonExistingId = new mongoose.Types.ObjectId();

        const res = await request(app).get(`/api/news/${nonExistingId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("There is no news with this id!");
    });
});
