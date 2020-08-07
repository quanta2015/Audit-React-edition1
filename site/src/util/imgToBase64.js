function getBase64Image(imgUrl) {
    return new Promise (resolve => {
      var img = new Image();
      var timestamp = new Date().getTime();
      img.src = imgUrl + '?' + timestamp
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = (() => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      });
    })
}



export default async function imgToBase64(imageUrl) {
  return  await getBase64Image(imageUrl)
}
