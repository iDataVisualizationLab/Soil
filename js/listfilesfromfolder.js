function listFiles(dir){
    var files = [];
    var fs = require('fs');
    var files = fs.readdirSync(dir);
    return files;
}