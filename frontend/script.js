console.log("Script loaded");

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
  const resultAreaId = "resultArea";

  function getResultArea() {
    let area = document.getElementById(resultAreaId);
    if (!area) {
      area = document.createElement("div");
      area.id = resultAreaId;
      area.style.marginTop = "20px";
      area.style.padding = "15px";
      area.style.border = "1px solid #ccc";
      area.style.borderRadius = "8px";
      area.style.backgroundColor = "#fff";
      document.body.appendChild(area);
    }
    area.innerHTML = "";
    return area;
  }

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

    const resultArea = document.getElementById(resultAreaId);
    if (resultArea) resultArea.innerHTML = "";

    updateSearchButtonState();
  });

  searchBtn.addEventListener("click", async () => {
    const query = queryField.value.trim();
    const fileContent = filePreview.dataset.filesText || "";
    const tagsArray = Array.from(tags);
    const resultArea = getResultArea();

    try {
      const simulateFound = true;

      if (simulateFound) {
        let sortAsc = true;

        const answers = [
          {
            id: 1,
            content: "Restart the service and check logs in /var/log.",
            link: "https://example.com/solution1",
            author: "Admin",
            date: "2025-08-01"
          },
          {
            id: 2,
            content: "Ensure proper permissions on the config file.",
            link: "https://example.com/solution2",
            author: "EngineerX",
            date: "2025-08-02"
          },
          {
            id: 3,
            content: "Clear temp files and retry.",
            link: "https://example.com/solution3",
            author: "SupportBot",
            date: "2025-08-03"
          }
        ];

        const renderTable = () => {
          const sorted = [...answers].sort((a, b) =>
            sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
          );
          const arrow = sortAsc
            ? '<span style="color:#555;">&#9650;</span>'
            : '<span style="color:#555;">&#9660;</span>';

          let tableHTML = `
            <h3>✅ Answers Found (${answers.length})</h3>
            <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
              <thead style="background-color: #f9f9f9;">
                <tr>
                  <th>#</th>
                  <th>Answer</th>
                  <th>Author</th>
                  <th id="dateHeader" style="cursor:pointer;">
                    <span style="display: inline-flex; align-items: center; gap: 4px;">
                      <span>Date</span>
                      ${arrow}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
          `;

          sorted.forEach((ans, index) => {
            tableHTML += `
              <tr>
                <td>${index + 1}</td>
                <td><a href="${ans.link}" target="_blank">${ans.content}</a></td>
                <td>${ans.author}</td>
                <td>${ans.date}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
              <button id="showAnswerInputBtn">💬 Contribute Your Own Answer</button>
              <button id="submitQueryBtn">📝 Submit my brand New Query</button>
            </div>
            <div id="userAnswerContainer" style="display:none; margin-top: 12px;">
              <textarea id="userAnswer" rows="6" placeholder="Enter your answer here..." style="width: 90%;"></textarea>
              <div style="margin-top: 10px;">
                <button id="submitAnswerBtn">Submit Answer</button>
              </div>
            </div>
            <div id="queryIdContainer" style="margin-top: 15px; text-align:center;"></div>
          `;

          resultArea.innerHTML = tableHTML;

          document.getElementById("dateHeader").addEventListener("click", () => {
            sortAsc = !sortAsc;
            renderTable();
          });

          document.getElementById("showAnswerInputBtn").addEventListener("click", () => {
            document.getElementById("userAnswerContainer").style.display = "block";
            document.getElementById("showAnswerInputBtn").disabled = true;
          });

          document.getElementById("submitAnswerBtn").addEventListener("click", () => {
            const answer = document.getElementById("userAnswer").value.trim();
if (!answer) return alert("Please enter a valid answer.");
const stubQueryId = "q-" + Math.random().toString(36).slice(2, 10);
document.getElementById("queryIdContainer").innerHTML = `
  <p>✅ Thank you for your submission.</p>
  <p>📌 Answer submitted under Query ID: <strong>${stubQueryId}</strong></p>
`;

          });

          document.getElementById("submitQueryBtn").addEventListener("click", () => {
            const stubQueryId = "q-" + Math.random().toString(36).slice(2, 10);
            const output = `
              <p style="margin-top: 10px;">
                📌 Stub: Your query has been submitted. <strong>Query ID: ${stubQueryId}</strong>
              </p>`;
            document.getElementById("queryIdContainer").innerHTML = output;
            console.log("Stub query submitted:", stubQueryId);
          });
        };

        renderTable();
        return;
      }

      // No answer found
      const fakeQueryId = "stub-12345";
      resultArea.innerHTML = `
        <h3>❓ No Answer Found</h3>
        <p>You can contribute an answer for this unresolved query:</p>
        <textarea id="userAnswer" rows="6" style="width: 90%; margin-top: 5px;"></textarea><br><br>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
              <button id="submitAnswerBtn">💬 Contribute Your Own Answer</button>
              <button id="submitQueryBtn">📝 Submit my brand New Query</button>
            </div>
        <div id="queryIdContainer" style="margin-top: 15px;"></div>
      `;

      document.getElementById("submitAnswerBtn").addEventListener("click", () => {
        const answer = document.getElementById("userAnswer").value.trim();
if (!answer) return alert("Please enter a valid answer.");
const stubQueryId = "q-" + Math.random().toString(36).slice(2, 10);
document.getElementById("queryIdContainer").innerHTML = `
  <p>✅ Thank you for your submission.</p>
  <p>📌 Answer submitted under Query ID: <strong>${stubQueryId}</strong></p>
`;

      });

      document.getElementById("submitQueryBtn").addEventListener("click", () => {
        const stubQueryId = "q-" + Math.random().toString(36).slice(2, 10);
        document.getElementById("queryIdContainer").innerHTML = `
          <p>📌 Stub: Your query has been submitted. <strong>Query ID: ${stubQueryId}</strong></p>
        `;
        console.log("Stub query submitted:", stubQueryId);
      });

    } catch (err) {
      getResultArea().innerHTML = `<p style="color:red;">🚫 Error processing request.</p>`;
      console.error(err);
    }
  });
});
