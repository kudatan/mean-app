const { put } = require('@vercel/blob');
const moment = require('moment');

const uploadToVercelBlob = async (fileBuffer, originalFileName) => {
    const timestamp = moment().format('DDMMYYYY-HHmmss');
    const fileName = `${timestamp}-${originalFileName}`;

    const storagePath = `uploads/${fileName}`;

    const { url } = await put(storagePath, fileBuffer, {
        access: 'public',
    });

    return url;
};

module.exports = {
    uploadToVercelBlob,
};