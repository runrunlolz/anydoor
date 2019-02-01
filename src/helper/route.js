const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat =  promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath, config){
    try {
        const stats = await stat(filePath);
        if(stats.isFile()){
            const contentType = mime(filePath).text;
            res.setHeader('Content-Type',contentType);

            if (isFresh(stats, req, res)) {
                res.statsCode =304;
                res.end();
                return;
            }

            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code == 200) {
                res.statsCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statsCode = 206;
                rs =fs.createReadStream(filePath, {start: start, end: end});
            }
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        }else if(stats.isDirectory()){
            const files = await readdir(filePath);
            res.statsCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => {
                    return {
                        file,
                        icon: mime(file).icon
                    }
                })
            }
            res.end(template(data));
        }
    } catch (error) {
        console.error(error)
        res.statsCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.end(`${filePath} is not a directory or file ${error}`);
    }
}