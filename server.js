var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
const dotenv = require('dotenv');
dotenv.config();

const fwReadResponse = require('./mock-apis/frameworkRead.js')
const channelResponse = require('./mock-apis/channelRead.js')

const BASE_URL = process.env.BASE_URL || "dev.sunbirded.org";
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;
const USER_TOKEN = process.env.USER_API_TOKEN;
const PORTAL_COOKIES= ""

const ASSET = {
    "CREATE": "/action/asset/v1/create",
    "CONTENT_UPLOAD_URL": "/action/content/v3/upload/url/*",
    "ASSET_UPLOAD": "/action/asset/v1/upload/*"
}

var app = express();
app.set('port', 3000);
app.use(express.json())
app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);
app.use(express.static(__dirname + '/web-component-examples/vanilla-js'));

const decoratePublicRequestHeaders2 = function () {
    return function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
        return proxyReqOpts;     
    }
};


var publicRequestHeaders = {
    "authorization": `Bearer ${API_AUTH_TOKEN}`,
    "x-channel-id": "0137541424673095687"
};

var contentTypeHeaders = {
    'content-type': "application/json"
}

const customDecorateReqHeaders = function () {
    return function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers = Object.assign({}, proxyReqOpts.headers, publicRequestHeaders);
        return proxyReqOpts;
    }
}

const decoratePublicRequestHeaders = function () {
    return function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers = Object.assign({}, proxyReqOpts.headers, publicRequestHeaders, contentTypeHeaders);
        return proxyReqOpts;
    }
}

app.post(ASSET.CREATE, function (req, res) {
    let response = {
        "id": "api.asset.create",
        "ver": "4.0",
        "ts": "2024-02-29T07:17:50ZZ",
        "params": {
            "resmsgid": "1cbeccb1-eb06-42f8-8fb1-cd23af0d62a5",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
            "identifier": "do_11400169325042892812",
            "node_id": "do_11400169325042892812",
            "versionKey": "1709191070619"
        }
    };
    res.send(response);
  });

  app.post(ASSET.CONTENT_UPLOAD_URL, function (req, res) {
    let response = {
        "id": "api.content.upload.url",
        "ver": "3.0",
        "ts": "2024-02-29T07:17:53ZZ",
        "params": {
            "resmsgid": "3f1957ea-7a08-4d38-92eb-f20e843a28b9",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
            "identifier": "do_11400169325042892812",
            "url_expiry": "54000",
            "pre_signed_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_11400169325042892812/earth.mp4?sv=2017-04-17&se=2024-02-29T22%3A17%3A53Z&sr=b&sp=w&sig=8OH%2BwMEEeY27t1pmKapgcdlMjFuY7oRJNaNc9VN6RcM%3D"
        }
    };
    res.send(response);
  });

  app.post(ASSET.ASSET_UPLOAD, function (req, res) {
    let response = {
        "id": "api.asset.upload",
        "ver": "4.0",
        "ts": "2024-02-29T07:17:53ZZ",
        "params": {
            "resmsgid": "014084e2-f3f7-415c-ac44-d2be02a162ce",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
            "identifier": "do_11400169325042892812",
            "artifactUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_11400169325042892812/earth.mp4",
            "content_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/assets/do_11400169325042892812/earth.mp4",
            "node_id": "do_11400169325042892812",
            "versionKey": "1709191073867"
        }
    }
    res.send(response);
  });

// app.use([
//     ASSET.CONTENT_UPLOAD_URL
//   ], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function (req) {
//       let originalUrl = req.originalUrl.replace("/action/", "/api/");
//       originalUrl = originalUrl.replace("/v3/", "/v1/");
//       return urlHelper.parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: decoratePublicRequestHeaders()
//   }));
  
//   app.use([
//     ASSET.ASSET_UPLOAD
//   ], proxy(BASE_URL, {
//     https: true,
//     parseReqBody: false,
//     proxyReqPathResolver: function (req) {
//       let originalUrl = req.originalUrl.replace("/action/", "/api/");
//       originalUrl = originalUrl.replace("/v3/", "/v1/");
//       return urlHelper.parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: customDecorateReqHeaders()
//   }));

// app.use(["/action/asset/v1/create"], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function (req) {
//       console.log('proxyReqPathResolver ::', req.originalUrl);
//       let originalUrl = req.originalUrl.replace("/action/", "/api/");
//       return urlHelper.parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: decoratePublicRequestHeaders()
//   })
// );

// app.post(["/action/asset/v1/upload/*"], proxy(BASE_URL, {
//     https: true,
//     parseReqBody: false,
//     proxyReqPathResolver: function (req) {
//       console.log('proxyReqPathResolver ::', req.originalUrl);
//       let originalUrl = req.originalUrl.replace("/action/", "/api/");
//       return urlHelper.parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: customDecorateReqHeaders()
//   })
// );

app.get('/api/framework/v1/read/*', function (req, res) {
    res.send(fwReadResponse.frameworkRead);
})

app.get('/api/channel/v1/read/*', function (req, res) {
    res.send(channelResponse.channelRead);
})

app.all(['/api/question/v2/list'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/api/', '/learner/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action/questionset/v2/*',
    '/action/question/v2/*',
    '/action/collection/v1/*',
    '/action/object/category/definition/v1/*',
    '/action/collection/v1/*'
    ], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action/composite/v3/search',
    ], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/composite/v3/', '/api/composite/v1/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action/program/v1/*',
    '/action/question/v2/bulkUpload',
    '/action/question/v2/bulkUploadStatus',
    '/action/asset/v1'
    ], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action', '/assets'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function(req) {
        console.log('proxyReqPathResolver ',  urlHelper.parse(req.url).path);
        return urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

// app.use(['/action/content/*'], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function (req) {
//         let originalUrl = req.originalUrl.replace('/api/', '/api/')
//         console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
//         return require('url').parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: decoratePublicRequestHeaders()
// }));

app.use(['/assets/public/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function(req) {
        return require('url').parse(`https://${BASE_URL}` + req.originalUrl).path
    }
}));

// app.use(['/assets'], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function (req) {
//       return urlHelper.parse(req.originalUrl).path;
//     },
//     proxyReqOptDecorator: decoratePublicRequestHeaders()
//   }));
http.createServer(app).listen(app.get('port'), 3000);