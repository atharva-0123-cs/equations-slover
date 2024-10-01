import Compress from 'compress.js';

const compress = new Compress();

async function resizeImage(file: any) {
  const resizedImage = await compress.compress([file], {
    size: 2, 
    quality: 10, 
    maxWidth: document.body.clientWidth / 2, 
    maxHeight: document.body.clientHeight /  2,
    resize: true
  })
  const img = resizedImage[0];
  const base64str = img.data;
  const imgExt = img.ext;
  const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
  return resizedFile;
}

export default resizeImage;