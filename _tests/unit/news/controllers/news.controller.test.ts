import express from "express";
import request from "supertest";

import { newsController } from "../../../../src/controllers/newsController.js";

import errorHandler from "../../../../src/middlewares/errorHandler.js";

import { NewsServicesTypes } from "../../../../src/types/ServicesTypes.js";
import { NewsResponseType } from "../../../../src/types/NewsTypes.js";
import { CreateNewsDataType } from "../../../../src/validators/news/news.schema.js";

const validId = "64b2f9d4f8a1e4e1c5a9c123";

const mockNewsService: jest.Mocked<NewsServicesTypes> = {
    getAll: jest.fn(),
    create: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
    getById: jest.fn(),
};

const app = express();
app.use(express.json());
app.use("/news", newsController(mockNewsService));
app.use(errorHandler);

describe("News Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /news - should return all news", async () => {
        const mockData = [
            {
                title: "New news",
                content: "News content",
                _id: validId,
                createdAt: new Date(),
            },
        ];
        mockNewsService.getAll.mockResolvedValue(mockData);

        const res = await request(app).get("/news");
        const resBody = res.body as NewsResponseType[];

        expect(res.status).toBe(200);
        expect([
            {
                ...resBody[0],
                createdAt: new Date(resBody[0].createdAt),
            },
        ]).toEqual(mockData);
    });

    test("GET /news - should return 500 on service error", async () => {
        mockNewsService.getAll.mockRejectedValue(new Error("Service failure!"));

        const res = await request(app).get("/news");

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch("Service failure!");
    });

    test("POST /news - should create a news", async () => {
        const newNews: CreateNewsDataType = {
            title: "New news",
            content: "News content",
        };
        const createdNews: NewsResponseType = {
            ...newNews,
            _id: validId,
            createdAt: new Date(),
        };
        mockNewsService.create.mockResolvedValue(createdNews);

        const res = await request(app).post("/news").send(newNews);
        const resBody = res.body as NewsResponseType;

        expect(res.status).toBe(201);
        expect({
            ...resBody,
            createdAt: new Date(resBody.createdAt),
        }).toEqual(createdNews);
        expect(mockNewsService.create).toHaveBeenCalledWith(newNews);
    });

    test("POST /news - should return 400 for invalid data title", async () => {
        const invalidData = {
            title: "V",
            content: "Valid content",
        };

        const res = await request(app).post("/news").send(invalidData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News title should be at least 3 characters long!"
        );
    });

    test("POST /news - should return 400 for invalid data content", async () => {
        const invalidData = {
            title: "Valid title",
            content: "V",
        };

        const res = await request(app).post("/news").send(invalidData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News content should be at least 3 characters long!"
        );
    });

    test("PUT /news/:newsId - should edit news", async () => {
        const editData: CreateNewsDataType = {
            title: "Edited news title",
            content: "Edited news content",
        };
        const updatedNews: NewsResponseType = {
            ...editData,
            _id: validId,
            createdAt: new Date(),
        };
        mockNewsService.edit.mockResolvedValue(updatedNews);

        const res = await request(app).put(`/news/${validId}`).send(editData);
        const resBody = res.body as NewsResponseType;

        expect(res.status).toBe(200);
        expect({
            ...resBody,
            createdAt: new Date(resBody.createdAt),
        }).toEqual(updatedNews);
        expect(mockNewsService.edit).toHaveBeenCalledWith(validId, editData);
    });

    test("PUT /news/:newsId - should return 400 for invalid update data title", async () => {
        const invalidData: CreateNewsDataType = {
            title: "V",
            content: "Valid content",
        };

        const res = await request(app)
            .put(`/news/${validId}`)
            .send(invalidData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News title should be at least 3 characters long!"
        );
    });

    test("PUT /news/:newsId - should return 400 for invalid update data content", async () => {
        const invalidData: CreateNewsDataType = {
            title: "Valid title",
            content: "V",
        };

        const res = await request(app)
            .put(`/news/${validId}`)
            .send(invalidData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "News content should be at least 3 characters long!"
        );
    });

    test("PUT /news/:newsId - should return 400 for invalid news ID", async () => {
        const validData: CreateNewsDataType = {
            title: "Valid title",
            content: "Valid content",
        };

        const res = await request(app).put("/news/invalidId").send(validData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );
    });

    test("DELETE /news/:newsId - should delete news", async () => {
        mockNewsService.remove.mockResolvedValue();

        const res = await request(app).delete(`/news/${validId}`);
        const resBody = res.body as NewsResponseType;

        expect(res.status).toBe(204);
        expect(resBody).toEqual({});
        expect(mockNewsService.remove).toHaveBeenCalledWith(validId);
    });

    test("DELETE /news/:newsId - should return 400 for invalid news ID", async () => {
        const res = await request(app).delete("/news/invalidId");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );
    });

    test("GET /news/newsId - should return news by ID", async () => {
        const mockData = {
            title: "New news",
            content: "News content",
            _id: validId,
            createdAt: new Date(),
        };
        mockNewsService.getById.mockResolvedValue(mockData);

        const res = await request(app).get(`/news/${validId}`);
        const resBody = res.body as NewsResponseType;

        expect(res.status).toBe(200);
        expect({
            ...resBody,
            createdAt: new Date(resBody.createdAt),
        }).toEqual(mockData);
    });

    test("GET /news/:newsId - should return 400 for invalid news ID", async () => {
        const res = await request(app).get("/news/invalidId");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Id must be a valid MongooseDB ObjectId!"
        );
    });

    test("GET /news/newsId - should return 500 on service error", async () => {
        mockNewsService.getById.mockRejectedValue(
            new Error("Service failure!")
        );

        const res = await request(app).get(`/news/${validId}`);

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch("Service failure!");
    });
});
