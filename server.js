const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const queryString = require('query-string')
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    // Continue to JSON Server router
    next()
})

router.render = (req, res) => {
    const headers = res.getHeaders();

    const totalCountHeader = headers['x-total-count'];
    if (req.method === 'GET' && totalCountHeader) {
        const queryParams = queryString.parse(req._parsedUrl.query);

        console.log(queryParams)
        console.log(queryParams)

        const result = {
            data: res.locals.data,
            pagination: {
                _page: Number.parseInt(queryParams._page) || 1,
                _limit: Number.parseInt(queryParams._limit) || 10,
                _totalRows: Number.parseInt(totalCountHeader),
            },
        };

        return res.jsonp(result);
    }

    res.jsonp(res.locals.data);
};

// Use default router
server.use('/api', router)

// start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log('JSON Server is running')
})

