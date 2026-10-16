import ImageKit from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

const imageKit = privateKey
  ? new ImageKit({ privateKey })
  : null;

export default imageKit;

/*
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imageKit;
*/
