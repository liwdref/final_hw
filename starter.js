const koa = require('koa')
const compose=require('koa-compose')
const fs= require('fs')

const app = new koa()
const port= 3000

async function home(ctx, next){
    ctx.body='home | file | pipe | read'
    await next()
}

async function file(ctx, next){
    if('/file' === ctx.path){
    ctx.body='directory to destination.txt is being made.'
    const text="waiting for data transfer";

        fs.mkdir('./dump',()=>{
        fs.writeFile('./dump/destination.txt',text,(err)=>{
            fs.readFile('./dump/destination.txt',(err,data)=>{
                console.log(data.toString('utf8'))
                })
            })
        })
    }
    else{
        await next()
    }
}

async function pipestream(ctx, next){
    if('/pipe' === ctx.path){
        const addText='This data will be moved shortly to destination.txt'
        const streamWrite = fs.createWriteStream('text.txt')
            streamWrite.write(addText)

        const streamRead = fs.createReadStream('text.txt')
        const streamPipe = fs.createWriteStream('./dump/destination.txt')

            ctx.body = 'data is currently moving'

            streamPipe.on('pipe',(streamRead)=>{
                console.log('piping to streamPipe')
        })
    
            streamRead.pipe(streamPipe)
            streamWrite.end();
            streamWrite.on('finish',()=>{
                console.log('writing finished')
    })
    } 
    else{
        await next()
    }
}

async function read(ctx, next){
    if('/read' === ctx.path){
        ctx.body='data is being read'

        let text=''
        const readerStream = fs.createReadStream('./dump/destination.txt')
            readerStream.setEncoding('UTF8')
            readerStream.on('data', (reading)=>{
                console.log('data being read: ')
                text+= reading
                console.log(text)
        })
    } 
    else{
        await next()
    }
}

const all = compose([home,file,pipestream,read,])

app.use(all)
app.listen(port)
console.log(`Server at localhost:${port}`)