const fs = require('fs');
const path = require('path');

const files = [
    'domains/academy/backend/package.json',
    'domains/academy/frontend/package.json',
    'domains/careers/frontend/package.json',
    'domains/con-tech/backend/package.json',
    'domains/con-tech\frontend/package.json',
    'domains/core-platform-services/api-gateway-service/package.json',
    'domains/core-platform-services/auth-service/package.json',
    'domains/core-platform-services/careers-service/package.json',
    'domains/core-platform-services/chat-service/package.json',
    'domains/core-platform-services/file-upload-service/package.json',
    'domains/core-platform-services/notification-service/package.json',
    'domains/core-platform-services/payment-service/package.json',
    'domains/events/backend/package.json',
    'domains/events/frontend/package.json',
    'domains/general/frontend/package.json',
    'libraries/common-data-types/package.json',
    'libraries/common-utils/package.json',
    'libraries/ui-libraries/package.json',
    'package.json'
];

files.forEach(f => {
    try {
        const full = path.join(process.cwd(), f.replace(/\\/g, '/'));
        const content = fs.readFileSync(full, 'utf8');
        const json = JSON.parse(content);
        if (json.version === undefined || json.version === null || json.version === '') {
            console.log('Bad or missing version in:', f, 'Value:', json.version);
        }

        for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
            if (json[key]) {
                for (const [dep, ver] of Object.entries(json[key])) {
                    if (ver === '') {
                        console.log('Empty dep version for', dep, 'in', f);
                    }
                }
            }
        }
    } catch (e) {
        console.log('Error reading/parsing', f, e.message);
    }
});
