/**
 * Copyright (c) 2016 Rob Wu <rob@robwu.nl> (https://robwu.nl)
 * Published under a MIT license.
 * https://github.com/Rob--W/zipinfo.js
 * https://github.com/coder0107git/number-of-zip-entries
 **/

/**
 * Reports the number of entries in a zip file. This method itself is resilient 
 * against malformed zip files, but you should take any result with a pinch of 
 * salt since it is trivial to spoof the metadata (which often breaks unzipping).
 *
 * The file must match the format as specified by:
 * https://en.wikipedia.org/wiki/Zip_(file_format)
 * https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
 *
 * The following zip variants are not supported:
 * - ZIP64
 * - Encrypted zip files
 * 
 * @param {Uint8Array | ArrayBuffer} data - Valid zip data. This must be the entire zip file.
 * @returns {number | null} The number of entries in the zip file or null if not found.
 */
function numberOfPathsInZip(data) {
    if(data instanceof ArrayBuffer) 
        data = new Uint8Array(data);
    const view = new DataView(data.buffer, data.byteOffset, data.length);

    let numberOfEntries = null;

    // Find EOCD (0xFFFF is the maximum size of an optional trailing comment).
    for (let i = data.length - 22, ii = Math.max(0, i - 0xFFFF); i >= ii; --i) {
        if (data[i] === 0x50 && data[i + 1] === 0x4b && data[i + 2] === 0x05 && data[i + 3] === 0x06) {
            numberOfEntries = view.getUint16(i + 8, true);
            break;
        }
    }

    return numberOfEntries;
};

export { 
    numberOfPathsInZip,
    numberOfPathsInZip as default
};
