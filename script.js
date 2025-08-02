// script.js
const queryInput = document.getElementById('query');
const tagInput = document.getElementById('tagInput');
const tagContainer = document.getElementById('tagContainer');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const clearFilesBtn = document.getElementById('clearFilesBtn');
const searchBtn = document.getElementById('searchBtn');

let uploadedFileElements = [];

let queryPreviewElement = null;
let tags = [];
let files = [];

function updateSearchButtonState() {
  const hasQuery = queryInput.value.trim().length > 0;
  const hasFiles = files.length > 0;
  searchBtn.disabled = !(hasQuery || hasFiles);
}

queryInput.addEventListener('input', updateSearchButtonState);

tagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const tag = tagInput.value.trim();
    if (tag && !tags.includes(tag.toLowerCase())) {
      tags.push(tag.toLowerCase());
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;

      const removeBtn = document.createElement("span");
      removeBtn.className = "remove-tag";
      removeBtn.textContent = "×";
      removeBtn.onclick = () => {
        tagContainer.removeChild(span);
        tags = tags.filter((t) => t !== tag.toLowerCase());
      };

      span.appendChild(removeBtn);
      tagContainer.appendChild(span);
      tagInput.value = "";
    } else {
      tagInput.value = ""; // Clear input if duplicate or empty
    }
  }
});


function previewFiles(fileList) {
  filePreviewContainer.innerHTML = '';
  fileList.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.createElement('div');
      preview.textContent = e.target.result;
      filePreviewContainer.appendChild(preview);
    };
    reader.readAsText(file);
  });
}

function handleFiles(files) {
  const container = document.getElementById("filePreviewContainer");

  Array.from(files).forEach((file) => {
    if (!file.name.match(/\.(txt|log)$/)) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;

      const filePreview = document.createElement("div");
      filePreview.className = "file-preview";
      filePreview.innerHTML = `<strong>${file.name}:</strong><pre>${content}</pre>`;

      container.appendChild(filePreview);
      uploadedFileElements.push(filePreview);
    };

    reader.readAsText(file);
  });
}


fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

clearFilesBtn.addEventListener('click', () => {
  files = [];
  fileInput.value = '';
  filePreviewContainer.innerHTML = '';
  updateSearchButtonState();
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

document.getElementById("query").addEventListener("input", function () {
  const container = document.getElementById("filePreviewContainer");
  const content = this.value.trim();

  if (!queryPreviewElement) {
    queryPreviewElement = document.createElement("div");
    queryPreviewElement.className = "file-preview";
    queryPreviewElement.innerHTML = "<strong>Query Text:</strong><pre></pre>";
    container.insertBefore(queryPreviewElement, container.firstChild);
  }

  queryPreviewElement.querySelector("pre").textContent = content;
});



queryField.dispatchEvent(new Event('input'));


document.getElementById("clearBtn").addEventListener("click", function () {
  const queryField = document.getElementById("query");
  queryField.value = "";
  queryField.dispatchEvent(new Event('input')); // ensures preview clears too
  queryField.value = "";
  queryField.dispatchEvent(new Event("input"));


  if (queryPreviewElement) {
    queryPreviewElement.remove();
    queryPreviewElement = null;
  }

  uploadedFileElements.forEach(el => el.remove());
  uploadedFileElements = [];
  document.getElementById("fileInput").value = "";

  updateSearchButtonState();
});

document.addEventListener("DOMContentLoaded", function () {
  const clearBtn = document.getElementById("clearBtn");
  const queryField = document.getElementById("query");

  clearBtn.addEventListener("click", function () {
    console.log("Clear button clicked");
    queryField.value = "";
    queryField.dispatchEvent(new Event("input"));
  });
});

