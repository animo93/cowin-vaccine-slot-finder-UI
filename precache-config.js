var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: [],
    stripePrefix: 'dist',
    root: 'dist/CowinVaccineFinder/',
    /* plugins:[
        new SWPrecacheWebpackPlugin({
            cacheId: 'cowin-pwa',
            filename: 'service-worker.js',
            staticFileGlobs: [
                'dist/CowinVaccineFinder/index.html',
                'dist/CowinVaccineFinder/**.js',
                'dist/CowinVaccineFinder/**.css'
            ],

        })
    ], */
    stripePrefix: 'dist/assets',
    mergeStaticsConfig: true
};