import * as x from 'geolib';

// @types/geolib is written in a way that `import * as geolib from 'geolib';` does not work

const theGeolib = (x as any).default as any;

export { theGeolib as geolib };
