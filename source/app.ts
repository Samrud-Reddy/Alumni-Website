import express, { Request, Response } from 'express';
import * as path from 'path';

const app = express();


app.set('view engine', 'ejs'); // set the view engine to EJS
app.set('views', __dirname + '\\view'); // set the directory for the view templates


app.use('/styles', express.static(path.join(__dirname, 'static/styles')));
app.use('/files', express.static(path.join(__dirname, 'static/files')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'scripts')));


app.get('/', (req: Request, res: Response) => {
  const data = { title: 'My EJS App', message: 'Hello, World!' };
  res.render('index', data); // render the 'index.ejs' template with the data
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
