"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBootstrap = void 0;
const core_1 = require("@angular-devkit/core");
const path = require("path");
/**
 * Convert the project to use asyncronous dynamic imports.
 * This is required for projects using the ModuleFederationPlugin.
 * Also updates the main script to dynamically load remote entries.
 * For more detailed information, checkout this article by Manfred Steyer:
 * https://www.angulararchitects.io/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular
 */
function updateBootstrap(isShell, main) {
    return (host) => {
        const bootstrapName = core_1.normalize(`${path.dirname(main)}/bootstrap.ts`);
        if (host.exists(bootstrapName)) {
            // tslint:disable-next-line: no-console
            console.info(`${bootstrapName} already exists.`);
            return host;
        }
        let mainData = `import('./bootstrap')\n  .catch((err) => console.error(err));\n`;
        if (isShell) {
            mainData = `import { loadRemoteEntry } from 'ng-module-federation';

import { microFrontends } from './micro-frontends';

Promise.all([
  Object.keys(microFrontends).map((m) => loadRemoteEntry(microFrontends[m].remoteEntry, microFrontends[m].remoteName)),
])
  .catch((err) => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
`;
        }
        host.rename(main, bootstrapName);
        host.create(main, mainData);
        return host;
    };
}
exports.updateBootstrap = updateBootstrap;
//# sourceMappingURL=bootstrap.js.map