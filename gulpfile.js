const { series, src, dest } = require('gulp');
const replace = require('gulp-replace');
const fs = require('fs');
const download = require('download-file');

var data;
let options = {
    configs: {
      src: "templates/*.conf",
      out: "output/*.json"
    }
};

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function replaceAll(cb) {
    src(options.configs.out)
    .pipe(replace('name' , 'name'))
    .pipe(dest('dest/'));
    cb();
}

function splitJSON(cb) {
    const splitSize = 20;
    const rawdata = fs.readFileSync('output/images.json');
    const data = JSON.parse(rawdata);
    const pages = Math.ceil(data.length/splitSize);
    fs.writeFileSync("dest/programming.json", data);
    console.log(pages);
    cb();
}

function load(cb) {
    let rawdata = fs.readFileSync('dest/images.json');
    data = JSON.parse(rawdata);
    cb();
}

function downloadFiles(cb) {
    data.forEach(element => {
        let options = {
            directory: "./files/",
            filename: element.name
        }
        if (!fs.existsSync(options.directory + options.filename)) {
          sleep(3000).then(() =>
            download(element.url, options, function (err) {
              if (err)  throw err
              console.log("ok");
            })
          );
        }
    });

    cb();
}

exports.splitJSON = splitJSON;
exports.default = series(load, downloadFiles);