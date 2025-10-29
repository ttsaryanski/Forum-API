import { newsService } from "../../../../src/services/newsService.js";

import { News } from "../../../../src/models/News.js";

import { NewsResponseType } from "../../../../src/types/NewsTypes.js";
import { CreateNewsDataType } from "../../../../src/validators/news/news.schema.js";

import { CustomError } from "../../../../src/utils/errorUtils/customError.js";

interface MockNewsInterface {
    _id: string;
    title: string;
    content: string;
    createdAt: Date;
}

type NewsModelType = typeof News;
const mockedNews = News as jest.Mocked<NewsModelType>;

jest.mock("../../../../src/models/News.js", () => ({
    News: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));

describe("newsService/getAll()", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return array from all news", async () => {
        const mockData: Partial<MockNewsInterface>[] = [
            {
                _id: "id1",
                title: "Title 1",
                content: "Content 1",
                createdAt: new Date("2024-01-01"),
            },
            {
                _id: "id2",
                title: "Title 2",
                content: "Content 2",
                createdAt: new Date("2024-01-02"),
            },
        ];
        const leanMock = jest.fn().mockResolvedValue(mockData);
        const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
        (mockedNews.find as jest.Mock).mockReturnValue({ select: selectMock });

        const result = await newsService.getAll();

        const expected: NewsResponseType[] = [
            {
                _id: "id1",
                title: "Title 1",
                content: "Content 1",
                createdAt: new Date("2024-01-01"),
            },
            {
                _id: "id2",
                title: "Title 2",
                content: "Content 2",
                createdAt: new Date("2024-01-02"),
            },
        ];

        expect(result).toEqual(expected);
        expect(mockedNews.find).toHaveBeenCalledTimes(1);
        expect(selectMock).toHaveBeenCalledWith("-__v");
        expect(leanMock).toHaveBeenCalledTimes(1);
    });
});

describe("newsService/create", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create and return new news", async () => {
        const createData: CreateNewsDataType = {
            title: "Test title",
            content: "Test content",
        };

        const mockNews: Partial<MockNewsInterface> = {
            _id: "id1",
            title: "Test title",
            content: "Test content",
            createdAt: new Date("2024-01-01"),
        };

        (mockedNews.create as jest.Mock).mockResolvedValue(mockNews);

        const result = await newsService.create(createData);

        const expected: NewsResponseType = {
            _id: "id1",
            title: "Test title",
            content: "Test content",
            createdAt: new Date("2024-01-01"),
        };

        expect(result).toEqual(expected);
        expect(mockedNews.create).toHaveBeenCalledWith(createData);
    });
});

describe("newsService/edit", () => {
    it("should update and return the updated news", async () => {
        const newsId = "id1";
        const updateData: CreateNewsDataType = {
            title: "Updated title",
            content: "Updated content",
        };
        const mockUpdate: Partial<MockNewsInterface> = {
            _id: newsId,
            ...updateData,
            createdAt: new Date("2024-01-01"),
        };

        mockedNews.findByIdAndUpdate.mockResolvedValue(
            mockUpdate as MockNewsInterface
        );

        const result = await newsService.edit(newsId, updateData);

        const expected: NewsResponseType = {
            _id: newsId,
            title: "Updated title",
            content: "Updated content",
            createdAt: new Date("2024-01-01"),
        };

        expect(mockedNews.findByIdAndUpdate).toHaveBeenCalledWith(
            newsId,
            updateData,
            {
                runValidators: true,
                new: true,
            }
        );
        expect(result).toEqual(expected);
    });

    it("should throw CustomError if no news is found to update", async () => {
        mockedNews.findByIdAndUpdate.mockResolvedValue(null);

        await expect(
            newsService.edit("id1", { title: "x", content: "y" })
        ).rejects.toThrow(CustomError);
    });
});

describe("newsService/remove", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete a news", async () => {
        const mockDelete: Partial<MockNewsInterface> = {
            _id: "id1",
            title: "to delete",
            content: "something",
            createdAt: new Date("2024-01-01"),
        };
        mockedNews.findByIdAndDelete.mockResolvedValue(
            mockDelete as MockNewsInterface
        );

        await newsService.remove("id1");

        expect(mockedNews.findByIdAndDelete).toHaveBeenCalledWith("id1");
    });

    it("should throw CustomError when news not found!", async () => {
        mockedNews.findByIdAndDelete.mockResolvedValue(null);

        await expect(newsService.remove("id1")).rejects.toThrow(CustomError);
    });
});

describe("newsService/getById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the news by ID ", async () => {
        const mockNews: Partial<MockNewsInterface> = {
            _id: "id1",
            title: "Title",
            content: "Content",
            createdAt: new Date("2024-01-01"),
        };

        mockedNews.findById.mockResolvedValue(mockNews as MockNewsInterface);

        const result = await newsService.getById("id1");

        const expected: NewsResponseType = {
            _id: "id1",
            title: "Title",
            content: "Content",
            createdAt: new Date("2024-01-01"),
        };

        expect(result).toEqual(expected);
        expect(mockedNews.findById).toHaveBeenCalledWith("id1");
    });

    it("should throw CustomError when news is not found", async () => {
        mockedNews.findById.mockResolvedValue(null);

        await expect(newsService.getById("id1")).rejects.toThrow(CustomError);
    });
});
