import fs from 'fs';
import path from 'path';
import glob from 'glob';

export const command = {
    name: 'generate:api',
    //description: 'Generates API file'
};

export function action(args, options, logger) {
    const methods = getApiMethods();
    generateResultFile(methods, logger);
}

function getApiMethods() {
    const methods = [];
    const files = glob.sync(path.resolve(process.cwd(), 'app', 'api', 'methods', '*.js'), { nodir: true });

    files.forEach((file) => {
        const tmp = file.slice(0, -3);
        methods.push(tmp.substr(tmp.lastIndexOf(path.sep) + 1));
    });

    return methods;
}

function generateResultFile(methods, logger) {
    let output = '';

    methods.forEach((module) => {
        output += `import ${module} from 'app/api/methods/${module}';\n`;
    });

    output += '\nexport default [\n';
    output += methods.reduce((result, module) => (result + `    ${module},\n`), '');
    output += '];\n';

    const outputFile = path.resolve(process.cwd(), 'app', 'api', 'index.js');
    fs.writeFileSync(outputFile, output);
    logger.info(`Generated: ${outputFile}`);
}