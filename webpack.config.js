// Angular >= 12 
// This Patch is needed to ensure the functionality without the need for custom webpack
const fs = require('fs')
// path to the builder webpack 5 config
const webpackFile = 'node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js'


fs.readFile(webpackFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err)
    }

    // make sure the file is not already patched
    const alreadyPatched = data.match(/fallback: {/g);
    if (alreadyPatched && alreadyPatched.length > 0) return;

    // if not patched already add the fallback options for the packages you need
    // it is possible to add "false" instead of providing a browserify package
    // you can add all packages required by your app here
    var result = data.replace(/resolve: {/g, `resolve: {
    fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        fs: require.resolve('browserify-fs')
    },fallback: 
    { 
        "os": require.resolve("os-browserify/browser") }`)

    fs.writeFile(webpackFile, result, 'utf8', function (err) {
        if (err) return console.log(err)
    })
});

// done