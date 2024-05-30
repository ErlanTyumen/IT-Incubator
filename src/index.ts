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
        id: +(new Date()),
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
    let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).send({
            errorsMessages: [{
                message: "Incorrect title",
                field: "title"
            }],
            resultCode: 1
        })
        return;
    }

    const id = +req.params.videoId // Исправлено
    const video = videos.find(v => v.id === id)
    if (video) {
        video.title = req.body.title;
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
    const id = +req.params.videoId; // Исправлено
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

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})