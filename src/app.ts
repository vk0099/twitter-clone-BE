import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

const app: express.Application = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const swaggerDocument = YAML.load('./src/api-docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error: Error, req, res, next) => {
	res.status.send({ errors: error });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (cluster.isMaster) {
	require('./utils/startup');
}

require('./db')();
require('./api')(app);

// if(cluster.isMaster){

// }

export = app;
