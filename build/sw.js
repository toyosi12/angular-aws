
const SITE_BASE_HREF = 'http://localhost:8888/angular-app/';//modify this to your url and port

// also replace all occurences of 'angular-app' 
// to your folder's relative directory from the base_href defined above



/*
*
* Begin script
*
*/

const replace = require('replace-in-file');

const existingStateReplacements = {
    files: 'angular-app/ngsw-worker.js',
    from: /this\.state = DriverReadyState\.EXISTING_CLIENTS_ONLY;/g,
    to: '/*this.state = DriverReadyState.EXISTING_CLIENTS_ONLY;*/ ' + 
        '// removing EXISTING_CLIENTS_ONLY state, as it behaves incorrectly in offline testing, both locally & on GitHub pages'
}

const baseHrefInstances = {
    files: 'angular-app/ngsw.json',
    from: '"' + SITE_BASE_HREF + 'index.html",',
    to: '"' + SITE_BASE_HREF + 'index.html", ', // whitespace-only change indicates that the baseHref was found, so we should make the URL fix
};

const serviceWorkerURLFix = {
    files: 'angular-app/ngsw-worker.js',
    from: /return parsed\.path;/g,
    to: '/*return parsed.path;*/ ' +
        'return url; ' +
        '// overriding default @angular/service-worker URL behavior, to handle routing bug angular/angular #21636'
}

try {
    const existingInstances = replace.sync(existingStateReplacements);
    console.log('Replacements of EXISTING_CLIENTS_ONLY states: ', existingInstances.join(', '));
}
catch(error) {
    console.error('Error occurred while replacing EXISTING_CLIENTS_ONLY states: ', error);    
}

try {
    const foundBaseHref = replace.sync(baseHrefInstances);
    if (foundBaseHref && foundBaseHref.length > 0) {
        try {
            const override = replace.sync(serviceWorkerURLFix);
            console.log('Changes made: ', override.join(', '))
        }
        catch (error) {
            console.error('Error occurred while overriding default service worker URL behavior: ', error)
        }
    }
    else {
        console.log('baseHref was not set; no URL matching changes needed', foundBaseHref);
    }
}
catch (error) {
    console.error('Error occurred while looking for baseHref: ', error);
}