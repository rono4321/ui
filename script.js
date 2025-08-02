document.addEventListener("DOMContentLoaded", function () {
  const queryField = document.getElementById("query");
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  const filePreview = document.getElementById("filePreviewContainer");
  const clearBtn = document.getElementById("clearBtn");
  const searchBtn = document.getElementById("searchBtn");
  const tagInput = document.getElementById("tagInput");
  const tagContainer = document.getElementById("tagContainer");

  let tags = new Set();

  function updateSearchButtonState() {
    const hasQueryOrFiles =
      queryField.value.trim() || (filePreview.dataset.filesText && filePreview.dataset.filesText.trim());
    const hasTags = tags.size > 0;
    searchBtn.disabled = !(hasQueryOrFiles || hasTags);
  }

  function updatePreview() {
    const queryText = queryField.value.trim();
    const filesText = filePreview.dataset.filesText || "";
    filePreview.textContent = `${queryText}${queryText && filesText ? "\n" : ""}${filesText}`;
  }

  function addTag(tag) {
    const cleanTag = tag.trim().toLowerCase();
    if (!cleanTag || tags.has(cleanTag)) return;

    tags.add(cleanTag);
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = cleanTag;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✖";
    removeBtn.className = "remove-tag";
    removeBtn.onclick = () => {
      tags.delete(cleanTag);
      tagContainer.removeChild(tagEl);
      updateSearchButtonState();
    };

    tagEl.appendChild(removeBtn);
    tagContainer.appendChild(tagEl);
    updateSearchButtonState();
  }

  tagInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput.value);
      tagInput.value = "";
    }
  });

  queryField.addEventListener("input", () => {
    updatePreview();
    updateSearchButtonState();
  });

  fileInput.addEventListener("change", handleFiles);
  dropZone.addEventListener("dragover", e => e.preventDefault());
  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    handleFiles({ target: { files: e.dataTransfer.files } });
  });

  function handleFiles(e) {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(f => f.name.endsWith(".txt") || f.name.endsWith(".log"));

    const readers = validFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    });

    Promise.all(readers).then(contents => {
      const filesText = contents.join("\n---\n");
      filePreview.dataset.filesText = filesText;
      updatePreview();
      updateSearchButtonState();
    });
  }

  clearBtn.addEventListener("click", function () {
    queryField.value = "";
    queryField.dispatchEvent(new Event("input"));

    fileInput.value = "";
    filePreview.dataset.filesText = "";
    updatePreview();

    tags.clear();
    tagContainer.innerHTML = "";

    updateSearchButtonState();
  });
});
