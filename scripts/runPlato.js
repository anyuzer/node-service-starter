const path = require('path');
const plato = require('es6-plato');

const localPackage = require('../package.json');

const srcPath = `${path.resolve('./src/**/*.js')}`;
const outputDir = `${path.resolve(localPackage.plato?.reportDirectory || './')}`;

plato.inspect(srcPath, outputDir, {}, (reports) => {
    const overview = plato.getOverviewReport(reports);
    const { average } = overview.summary;

    const thresholds = localPackage.plato?.thresholds || {};

    if(thresholds.eslint && thresholds.eslint > +average.eslint) {
        console.log(`Failed to meet minimum eslint threshold: ${average.eslint}/${thresholds.eslint}`);
        process.exit(1);
    }

    if(thresholds.sloc && thresholds.sloc > +average.sloc) {
        console.log(`Failed to meet minimum sloc threshold: ${average.sloc}/${thresholds.sloc}`);
        process.exit(1);
    }

    if(thresholds.maintainability && thresholds.maintainability > +average.maintainability) {
        console.log(`Failed to meet minimum maintainability threshold: ${average.maintainability}/${thresholds.maintainability}`);
        process.exit(1);
    }

    console.log('Successfully met all threshold limits.');
    process.exit(0);
})