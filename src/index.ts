import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

const corsMiddleWare = cors()
app.use(corsMiddleWare)
const jsonBodyMiddleWare = bodyParser.json()
app.use(jsonBodyMiddleWare)

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
]

const port = process.env.PORT || 5000

const parserMiddleware = express.json()
app.use(parserMiddleware)

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    let title = req.body.title
    if(!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).send({
            errorsMessages: [{
                message: "Incorrect title",
                field: "title"
            }],
            resultCode: 1
        })
        return;
    }

    const newVideo = {
        id: +(new Date().toISOString()),
        title: title,
        author: 'it-incubator',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144"]
    }
    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;

    const errorsMessages = [];

    // Проверка title
    if (!title || typeof title !== 'string' || !title.trim()) {
        errorsMessages.push({ message: "Incorrect title", field: "title" });
    }

    // Проверка author
    if (!author || typeof author !== 'string' || !author.trim()) {
        errorsMessages.push({ message: "Incorrect author", field: "author" });
    }

    // Проверка availableResolutions
    if (!Array.isArray(availableResolutions) || !availableResolutions.every((res: any) => typeof res === 'string')) {
        errorsMessages.push({ message: "Incorrect availableResolutions", field: "availableResolutions" });
    }

    // Проверка canBeDownloaded
    if (typeof canBeDownloaded !== 'boolean') {
        errorsMessages.push({ message: "Incorrect canBeDownloaded", field: "canBeDownloaded" });
    }

    // Проверка minAgeRestriction
    if (minAgeRestriction !== null && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 0)) {
        errorsMessages.push({ message: "Incorrect minAgeRestriction", field: "minAgeRestriction" });
    }

    // Проверка publicationDate
    if (!publicationDate || isNaN(Date.parse(publicationDate))) {
        errorsMessages.push({ message: "Incorrect publicationDate", field: "publicationDate" });
    }

    // Если есть ошибки, возвращаем 400 и список ошибок
    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages, resultCode: 1 });
        return;
    }

    const id = +req.params.videoId
    const video = videos.find(v => v.id === id)
    if (video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction;
        video.publicationDate = publicationDate;
        res.status(204).send(video)
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        })
    }
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        })
    }
})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const newVideos = videos.filter(v => v.id !== id)
    if (newVideos.length < videos.length) {
        videos = newVideos
        res.status(204).send()
    } else {
        res.status(404).send({
            errorsMessages: [{
                message: "Video not found",
                field: "id"
            }],
            resultCode: 1
        })
    }
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.status(204).send
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})
