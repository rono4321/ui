// script.js
const queryInput = document.getElementById('query');
const tagInput = document.getElementById('tagInput');
const tagContainer = document.getElementById('tagContainer');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const clearFilesBtn = document.getElementById('clearFilesBtn');
const searchBtn = document.getElementById('searchBtn');

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

function handleFiles(newFiles) {
  const validFiles = Array.from(newFiles).filter(file =>
    file.name.endsWith('.txt') || file.name.endsWith('.log')
  );

  validFiles.forEach(file => {
    if (!files.some(f => f.name === file.name && f.size === file.size)) {
      files.push(file);
    }
  });

  previewFiles(files);
  updateSearchButtonState();
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
