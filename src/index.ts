import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const corsMiddleWare = cors();
app.use(corsMiddleWare);
const jsonBodyMiddleWare = bodyParser.json();
app.use(jsonBodyMiddleWare);

let videos = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-05-30T10:51:40.449Z",
        "publicationDate": "2024-05-30T10:51:40.449Z",
        "availableResolutions": [
            "P144"
        ]
    }
];

const port = process.env.PORT || 5000;

const parserMiddleware = express.json();
app.use(parserMiddleware);

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos);
});

function addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}

app.post('/videos', (req: Request, res: Response) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction } = req.body;
    const errorsMessages = [];

    // Проверка title
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errorsMessages.push({ message: "Incorrect title", field: "title" });
    }

    // Проверка author
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        errorsMessages.push({ message: "Incorrect author", field: "author" });
    }

    // Проверка availableResolutions
    const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
    if (!Array.isArray(availableResolutions) || !availableResolutions.every((res: any) => validResolutions.includes(res))) {
        errorsMessages.push({ message: "Incorrect availableResolutions", field: "availableResolutions" });
    }

    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages });
        return;
    }

    const createdAt = new Date();
    const newVideo = {
        id: +(new Date()), // Уникальный ID
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded || false,
        minAgeRestriction: minAgeRestriction || null,
        createdAt: createdAt.toISOString(),
        publicationDate: addDays(createdAt, 1).toISOString(),
        availableResolutions: availableResolutions || ["P144"]
    };

    videos.push(newVideo);

    res.status(201).send(newVideo);
});

app.put('/videos/:videoId', (req: Request, res: Response) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    const errorsMessages = [];

    // Проверка title
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errorsMessages.push({ message: "Incorrect title", field: "title" });
    }

    // Проверка canBeDownloaded
    if (typeof canBeDownloaded !== 'boolean') {
        errorsMessages.push({ message: "Incorrect canBeDownloaded", field: "canBeDownloaded" });
    }

    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages, resultCode: 1 });
        return;
    }

    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if (video) {
        video.title = title;
        video.author = author || video.author;
        video.availableResolutions = availableResolutions || video.availableResolutions;
        video.canBeDownloaded = typeof canBeDownloaded === 'boolean' ? canBeDownloaded : video.canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction || video.minAgeRestriction;
        video.publicationDate = publicationDate || video.publicationDate;

        res.status(204).send(video);
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        });
    }
});

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.send(video);
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        });
    }
});

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const newVideos = videos.filter(v => v.id !== id);
    if (newVideos.length < videos.length) {
        videos = newVideos;
        res.status(204).send();
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        });
    }
});

// Новый маршрут для удаления всех данных
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});
