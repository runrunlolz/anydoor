const path = require('path');
const conf = require('../config/defaultConfig');
const fileIcon = 'http://'+conf.hostname +':'+ conf.port+'/src/image/file.jpg';
const finderIcon = 'http://'+conf.hostname +':'+ conf.port+'/src/image/finder.png';

const mimeTypes = {
    'css': {
        text: 'text/css',
        icon: fileIcon
    },
    'gif': 'image/gif',
    'jpg': {
        text:'image/jpg',
        icon: fileIcon
    },
    'html': 'text/html',
    'ico': 'image/jpeg',
    'xml': 'text/xml',
    'txt': {
        text: 'text/plain',
        icon: finderIcon
    },
    'js': {
        text: 'text/javascript',
        icon: fileIcon
    },
    'json': {
        text: 'application/json',
        icon: fileIcon
    },
    'pdf': 'application/pdf',
    'png': {
        text:'image/png',
        icon: fileIcon
    }
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
        .split('.')
        .pop()
        .toLowerCase();
    if (!ext) {
        ext = filePath;
    }

    return mimeTypes[ext] || mimeTypes['txt'];
};

