const Base64Prefix = "data:application/pdf;base64,";
const add = document.querySelector(".add");
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

// 使用原生 FileReader 轉檔
function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}

async function printPDF(pdfData) {
  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

  // 利用解碼的檔案，載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const pdfPage = await pdfDoc.getPage(1);

  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport,
  };
  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {
  // 設定 PDF 轉為圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

// 此處 canvas 套用 fabric.js
const pdfCanvasViewer = new fabric.Canvas("pdf-canvas-viewer");

document.querySelector("input").addEventListener("change", async (e) => {
  pdfCanvasViewer.requestRenderAll();
  const pdfData = await printPDF(e.target.files[0]);
  const pdfImage = await pdfToImage(pdfData);

  // 透過比例設定 canvas 尺寸 original
  pdfCanvasViewer.setWidth(pdfImage.width / window.devicePixelRatio);
  // pdfCanvasViewer.setHeight(pdfImage.height / window.devicePixelRatio);

  // pdfCanvasViewer.setWidth(document.querySelector("#steps-uid-0-p-1").offsetWidth - 32);
  pdfCanvasViewer.setHeight(pdfImage.height / window.devicePixelRatio);

  // 將 PDF 畫面設定為背景
  pdfCanvasViewer.setBackgroundImage(pdfImage, pdfCanvasViewer.renderAll.bind(pdfCanvasViewer));
});

function signatureImgSelector() {
  let localSignatureStr = localStorage.getItem("localSignature") || "";
  localSignatureArray = localSignatureStr.split(",");
  let signatureImgList = "";

  localSignatureArray.forEach((item) => {
    let signatureImgBase64 = localStorage.getItem(item);
    signatureImgList += `<li class="custom-rounded-20 custom-light-shadow-sm d-flex justify-content-center align-items-center border border-primary" style="min-width: 150px; width: 150px; min-height: 100px; height: 100%"><img class="img-fluid custom-rounded-20 sign-img" src="${signatureImgBase64}" alt="signature ${item}"></li>`;
  });

  document.querySelector("#signature-list-selector").innerHTML = "";
  document.querySelector("#signature-list-selector").innerHTML = signatureImgList;
}

signatureImgSelector();

const sign = document.querySelectorAll(".sign-img");

// 若 localStorage 有資料才放入
if (localStorage.getItem("img")) {
  sign.src = localStorage.getItem("img");
}

sign.forEach((element) => {
  element.addEventListener("click", () => {
    if (!element.src) return;

    fabric.Image.fromURL(element.src, function (image) {
      // 設定簽名出現的位置及大小，後續可調整
      image.top = 400;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      pdfCanvasViewer.add(image);
    });
  });
});

// 引入套件所提供的物件
const pdf = new jsPDF();

const download = document.querySelector(".download");

document.querySelectorAll("#modal-save-btn")[0].addEventListener("click", (e) => {
  const image = pdfCanvasViewer.toDataURL("image/png");
  const filename = localStorage.getItem("filename") || `${new Date().getTime()}`;
  const timestamp = new Date().getTime();

  let localPDFSrting = localStorage.getItem("localpdf") || "";

  const PDFDOCID = `pdffilename_${new Date().getTime()}`;

  setTimeout(() => {
    localPDFSrting += localPDFSrting.length > 0 ? `,${PDFDOCID}@${timestamp}@${filename}` : `${PDFDOCID}@${timestamp}@${filename}`;
    localStorage.setItem(PDFDOCID, image);
    localStorage.setItem("localpdf", localPDFSrting);

    setTimeout(() => {
      localStorage.removeItem("filename");
      pdfListInit();
    }, 2000);
  }, 1500);
});
