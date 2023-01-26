document.querySelectorAll("#modal-save-btn")[0].classList.add("custom-hide");

document.querySelector("#modalprevTab").addEventListener("click", function () {
  let modalStepPagination = document.querySelectorAll("[aria-label='Pagination']")[0];
  let saveBtn = document.querySelectorAll("#modal-save-btn")[0];
  let prevStep = document.querySelectorAll(".step-tab.first")[0];
  let currentStep = document.querySelectorAll(".step-tab.second")[0];
  let prevfieldset = document.querySelectorAll("#steps-uid-0-p-0")[0];
  let currentfieldset = document.querySelectorAll("#steps-uid-0-p-1")[0];

  modalStepPagination.querySelector(".prev").classList.add("custom-hide");
  modalStepPagination.querySelector(".next").classList.remove("custom-hide");

  prevStep.classList.add("current");
  prevStep.classList.remove("done");

  currentStep.classList.remove("current");
  currentStep.classList.add("done");

  prevfieldset.classList.remove("custom-hide");
  prevfieldset.classList.add("current");

  currentfieldset.classList.add("custom-hide");
  currentfieldset.classList.remove("current");

  saveBtn.classList.add("custom-hide");
});

document.querySelector("#modalnextTab").addEventListener("click", function () {
  let modalStepPagination = document.querySelectorAll("[aria-label='Pagination']")[0];
  let saveBtn = document.querySelectorAll("#modal-save-btn")[0];

  let currentStep = document.querySelectorAll(".step-tab.first")[0];
  let nextStep = document.querySelectorAll(".step-tab.second")[0];
  let currentfieldset = document.querySelectorAll("#steps-uid-0-p-0")[0];
  let nextfieldset = document.querySelectorAll("#steps-uid-0-p-1")[0];

  modalStepPagination.querySelector(".prev").classList.remove("custom-hide");
  modalStepPagination.querySelector(".next").classList.add("custom-hide");

  currentStep.classList.add("done");
  currentStep.classList.remove("current");

  nextStep.classList.add("current");
  nextStep.classList.remove("done");

  currentfieldset.classList.remove("current");
  currentfieldset.classList.add("custom-hide");

  nextfieldset.classList.remove("custom-hide");
  nextfieldset.classList.add("current");

  saveBtn.classList.remove("custom-hide");
});

let isAdvancedUpload = (function () {
  let div = document.createElement("div");
  return ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
})();

let draggableFileArea = document.querySelector(".drag-file-area");
let browseFileText = document.querySelector(".browse-files");
let uploadIcon = document.querySelector(".upload-icon");
let dragDropText = document.querySelector(".dynamic-message");
let fileInput = document.querySelector(".default-file-input");
let cannotUploadMessage = document.querySelector(".cannot-upload-message");
let cancelAlertButton = document.querySelector(".cancel-alert-button");
let uploadedFile = document.querySelector(".file-block");
let fileName = document.querySelector(".file-name");
let fileSize = document.querySelector(".file-size");
let progressBar = document.querySelector(".progress-bar");
let removeFileButton = document.querySelector(".remove-file-icon");
let uploadButton = document.querySelector(".upload-button");
let fileFlag = 0;

let overflowWidth = document.querySelector(".upload-files-container").offsetWidth * 0.25;
let progressBarMaxWidth = document.querySelector(".upload-files-container").offsetWidth - overflowWidth;

fileInput.addEventListener("click", function () {
  fileInput.value = "";
});

fileInput.addEventListener("change", function (e) {
  let startIndex = fileInput.value.indexOf("\\") >= 0 ? fileInput.value.lastIndexOf("\\") : fileInput.value.lastIndexOf("/");
  let filename = fileInput.value.substring(startIndex);
  if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
    filename = filename.substring(1);
  }

  uploadIcon.innerHTML = "確認文件：";
  dragDropText.innerHTML = `${filename}`;
  localStorage.setItem("filename", filename);

  document.querySelector(".label").innerHTML = `將檔案拖曳到這裡 或者 
          <span class="browse-files" >
            <input type="file" class="default-file-input" accept=".pdf" />
            <span class="browse-files-text" style="top: 0;" > 預覽 </span>
          </span>`;
  uploadButton.innerHTML = `上傳`;
  fileName.innerHTML = fileInput.files[0].name;
  fileSize.innerHTML = (fileInput.files[0].size / 1024).toFixed(1) + " KB";
  uploadedFile.style.cssText = "display: flex;";
  progressBar.style.width = 0;
  fileFlag = 0;
});

uploadButton.addEventListener("click", function () {
  let isFileUploaded = fileInput.value;
  removeFileButton.classList.add("custom-hide");
  let modalStepPagination = document.querySelectorAll("[aria-label='Pagination']")[0];

  if (isFileUploaded != "") {
    if (fileFlag == 0) {
      fileFlag = 1;
      var width = 0;
      var id = setInterval(frame, 50);

      function frame() {
        // if (width >= 350) {
        if (width >= progressBarMaxWidth) {
          clearInterval(id);
          uploadButton.innerHTML = `<span class="material-icons-outlined upload-button-icon"> 成功 </span> 上傳`;
          modalStepPagination.querySelector(".next").classList.remove("custom-hide");
        } else {
          width += 10;
          progressBar.style.width = width + "px";
        }
      }
    }
  } else {
    cannotUploadMessage.style.cssText = "display: flex; animation: fadeIn linear 1.5s;";
  }
});

cancelAlertButton.addEventListener("click", function () {
  cannotUploadMessage.style.cssText = "display: none;";
});

if (isAdvancedUpload) {
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach((evt) =>
    draggableFileArea.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
    })
  );

  ["dragover", "dragenter"].forEach(function (evt) {
    draggableFileArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadIcon.innerHTML = "file_download";
      dragDropText.innerHTML = "Drop your file here!";
    });
  });

  draggableFileArea.addEventListener("drop", function (e) {
    uploadIcon.innerHTML = "成功";
    dragDropText.innerHTML = "檔案拖曳成功！";
    document.querySelector(
      ".label"
    ).innerHTML = `將檔案拖曳到這裡 或者 <span class="browse-files" > <input type="file" class="default-file-input" accept=".pdf" /> <span class="browse-files-text" style="top: -23px; left: -20px;" > 預覽 </span> </span>`;
    uploadButton.innerHTML = `上傳`;

    let files = e.dataTransfer.files;
    fileInput.files = files;
    fileName.innerHTML = files[0].name;
    fileSize.innerHTML = (files[0].size / 1024).toFixed(1) + " KB";
    uploadedFile.style.cssText = "display: flex;";
    progressBar.style.width = 0;
    fileFlag = 0;
  });
}

removeFileButton.addEventListener("click", function () {
  uploadedFile.style.cssText = "display: none;";
  fileInput.value = "";
  uploadIcon.innerHTML = "上傳文件";
  dragDropText.innerHTML = "將檔案拖曳到這裡";
  document.querySelector(".label").innerHTML = `<span class="browse-files">
          <input type="file" class="default-file-input" accept=".pdf" />
          <span class="browse-files-text"> 瀏覽 </span>
          <span> 本地文件 </span>
        </span>`;
  uploadButton.innerHTML = `上傳`;
});

function downloadPDFfile(id) {
  let pdfIMG = localStorage.getItem(id);
  let jsforpdf = new jsPDF();
  // 設定背景在 PDF 中的位置及大小
  const width = jsforpdf.internal.pageSize.width;
  const height = jsforpdf.internal.pageSize.height;
  jsforpdf.addImage(pdfIMG, "png", 0, 0, width, height);
  jsforpdf.save(`${id}.pdf`);
}

function bookmark(id) {
  let listItem = document.querySelectorAll(`#${id} span`);
  let localFavoriteString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let favoriteListSrting = localStorage.getItem("favoritelist") || "";
  if (!favoriteListSrting.includes(localFavoriteString)) {
    favoriteListSrting += favoriteListSrting.length > 0 ? `,${localFavoriteString}` : `${localFavoriteString}`;
    localStorage.setItem("favoritelist", favoriteListSrting);
  }
  favoritelistInit();
}

function removePDF(id) {
  let listItem = document.querySelectorAll(`#${id} > span`);
  let localTrashString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let trashListSrting = localStorage.getItem("trashlist") || "";
  if (!trashListSrting.includes(localTrashString)) {
    trashListSrting += trashListSrting.length > 0 ? `,${localTrashString}` : `${localTrashString}`;
    localStorage.setItem("trashlist", trashListSrting);
  }

  let removeIDString = `${id}@${id.split("_")[1]}@${listItem[1].textContent}`;
  let localPDFSrting = localStorage.getItem("localpdf");
  let localPDFArray = localPDFSrting.split(",");
  let filterArray = localPDFArray.filter((string) => string !== removeIDString);
  localStorage.setItem("localpdf", filterArray);
  pdfListInit();
  trashlistInit();
}

function removeBookmark(id) {
  let listItem = document.querySelectorAll(`#${id} > span`);
  let localFavoriteString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let favoriteListSrting = localStorage.getItem("trashlist") || "";
  if (!favoriteListSrting.includes(localFavoriteString)) {
    favoriteListSrting += favoriteListSrting.length > 0 ? `,${localFavoriteString}` : `${localFavoriteString}`;
    localStorage.setItem("trashlist", favoriteListSrting);
  }

  let removeIDString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let localFavoriteSrting = localStorage.getItem("favoritelist");
  let localFavoriteArray = localFavoriteSrting.split(",");
  let filterArray = localFavoriteArray.filter((string) => string !== removeIDString);
  localStorage.setItem("favoritelist", filterArray);
  pdfListInit();
  favoritelistInit();
}

function recoverPDFfile(id) {
  let listItem = document.querySelectorAll(`#${id} > span`);
  let localPDFString = `${id}@${id.split("_")[1]}@${listItem[1].textContent}`;
  let pdfListArray = localStorage.getItem("localpdf") || "";
  if (!pdfListArray.includes(localPDFString)) {
    pdfListArray += pdfListArray.length > 0 ? `,${localPDFString}` : `${localPDFString}`;
    localStorage.setItem("localpdf", pdfListArray);
  }

  let removeIDString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let localTrashSrting = localStorage.getItem("trashlist");
  let localTrashArray = localTrashSrting.split(",");
  let filterArray = localTrashArray.filter((string) => string !== removeIDString);
  localStorage.setItem("trashlist", filterArray);
  pdfListInit();
  trashlistInit();
}

function removeLocalPDF(id) {
  let listItem = document.querySelectorAll(`#${id} > span`);
  let removePDFString = `${id}@${listItem[0].textContent}@${listItem[1].textContent}`;
  let localTrashSrting = localStorage.getItem("trashlist");
  let localTrashArray = localTrashSrting.split(",");
  let filterArray = localTrashArray.filter((string) => string !== removePDFString);
  localStorage.setItem("trashlist", filterArray);
  trashlistInit();
}

// Load PDF File from local storage
function pdfListInit() {
  let localPDFSrting = localStorage.getItem("localpdf") || "";
  let localPDFArray = localPDFSrting.split(",");
  let pdfListItemStr = "";
  document.querySelector("#pdf-list").innerHTML = "";
  if (localPDFArray[0] !== "") {
    localPDFArray.forEach((item) => {
      let infoArray = item.split("@");
      const [ID, TIMESTAMP, FILENAME] = infoArray;
      let dateFormat = new Date(parseInt(TIMESTAMP));

      pdfListItemStr += `
          <li class="row m-0 px-2 py-1 mb-1 d-flex justify-content-center align-items-center custom-dark-shadow-sm custom-rounded-20" id="${ID}"><i class="col-md-1 col-sm-2 col-2 p-0 ft-paperclip text-center font-medium-3"></i><span class="col-md-3 col-sm-10 col-10 p-0 font-medium-2">${dateFormat.getDate()}-${
        dateFormat.getMonth() + 1
      }-${dateFormat.getFullYear()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}:${dateFormat.getSeconds()}</span><span class="col-md-3 col-sm-10 col-12 p-0 font-medium-2">${FILENAME}</span><div class="col-md-5 col-sm-12 p-0 d-flex justify-content-end" style="gap: 10px;"><a href="javascript:void(0)" class="btn btn-outline-primary" onclick="downloadPDFfile('${ID}')"><i class="ft-download font-medium-3"></i></a><a href="javascript:void(0)" class="btn btn-outline-success" onclick="bookmark('${ID}')"><i class="ft-bookmark font-medium-3"></i></a><a href="javascript:void(0)" class="btn btn-outline-danger removePDF" id="${ID}" onclick="removePDF('${ID}')"><i class="ft-trash font-medium-3"></i></a></div></li>`;
    });

    document.querySelector("#pdf-list").innerHTML = "";
    document.querySelector("#pdf-list").innerHTML = pdfListItemStr;
  }
}
pdfListInit();

// Load Favorite PDF File from local storage
function favoritelistInit() {
  let localFavoriteSrting = localStorage.getItem("favoritelist") || "";
  let localFavoriteArray = localFavoriteSrting.split(",");
  document.querySelector("#favorite-list").innerHTML = "";
  if (localFavoriteArray[0] !== "") {
    let favoriteListItemStr = "";
    localFavoriteArray.forEach((item) => {
      let infoArray = item.split("@");
      const [ID, TIMESTAMP, FILENAME] = infoArray;
      favoriteListItemStr += `
        <li class="row m-0 px-2 py-1 mb-1 d-flex justify-content-center align-items-center custom-dark-shadow-sm custom-rounded-20" id='${ID}'>
            <i class="col-md-1 col-sm-2 col-2 p-0 ft-paperclip text-center font-medium-3"></i>
            <span class="col-md-3 col-sm-10 col-10 p-0 font-medium-2">${TIMESTAMP}</span>
            <span class="col-md-3 col-sm-10 col-12 p-0 font-medium-2">${FILENAME}</span>
            <div class="col-md-5 col-sm-12 p-0 d-flex justify-content-end" style="gap: 10px;">
            <a href="javascript:void(0)" class="btn btn-warning" onclick="removeBookmark('${ID}')"><i class="ft-heart font-medium-3"></i></a>
            </div>
        </li>`;
    });
    document.querySelector("#favorite-list").innerHTML = "";
    document.querySelector("#favorite-list").innerHTML = favoriteListItemStr;
  }
}
favoritelistInit();

// Load Trash PDF File from local storage
function trashlistInit() {
  let localTrashSrting = localStorage.getItem("trashlist") || "";
  let localTrashArray = localTrashSrting.split(",");
  let trashListItemStr = "";
  document.querySelector("#trash-list").innerHTML = "";
  if (localTrashArray[0] !== "") {
    localTrashArray.forEach((item) => {
      let infoArray = item.split("@");
      const [ID, TIMESTAMP, FILENAME] = infoArray;
      trashListItemStr += `
        <li class="row m-0 px-2 py-1 mb-1 d-flex justify-content-center align-items-center custom-dark-shadow-sm custom-rounded-20" id='${ID}'>
            <i class="col-md-1 col-sm-2 col-2 p-0 ft-paperclip text-center font-medium-3"></i>
            <span class="col-md-3 col-sm-10 col-10 p-0 font-medium-2">${TIMESTAMP}</span>
            <span class="col-md-3 col-sm-10 col-12 p-0 font-medium-2">${FILENAME}</span>
            <div class="col-md-5 col-sm-12 p-0 d-flex justify-content-end" style="gap: 10px;">
            <a href="#" class="btn btn-outline-success" onclick="recoverPDFfile('${ID}')"><i class="ft-rotate-cw font-medium-3"></i></a>
            <a href="#" class="btn btn-outline-danger" onclick="removeLocalPDF('${ID}')"><i class="ft-trash font-medium-3"></i></a>
            </div>
        </li>`;
    });
    document.querySelector("#trash-list").innerHTML = "";
    document.querySelector("#trash-list").innerHTML = trashListItemStr;
  }
}
trashlistInit();
