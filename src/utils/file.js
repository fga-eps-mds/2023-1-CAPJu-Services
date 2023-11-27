export function fileToByteArray(file) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    let reader = new FileReader();

    reader.onloadend = e => {
      // eslint-disable-next-line no-undef
      if (e.target.readyState === FileReader.DONE) {
        let byteArray = new Uint8Array(e.target.result);
        resolve(byteArray);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to convert file to byte array'));
    };

    reader.readAsArrayBuffer(file);
  });
}
