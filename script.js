let generatedData = [];

function addColumn() {
  const container = document.getElementById("fields-container");
  const columnGroup = document.createElement("div");
  columnGroup.className = "grid grid-cols-12 gap-4 items-center column-group";

  columnGroup.innerHTML = `
    <div class="col-span-4">
      <input
        type="text"
        placeholder="e.g., Name"
        class="col-name w-full p-2 border rounded"
        required
      />
    </div>
    <div class="col-span-7">
      <input
        type="text"
        placeholder="e.g., $[A-Z]####"
        class="col-pattern w-full p-2 border rounded"
        required
      />
    </div>
    <div class="col-span-1">
      <button type="button" class="remove-column text-red-500 hover:text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `;

  // Find the form actions container
  let formActions = container.querySelector(".form-actions");

  // If form-actions doesn't exist yet, append to the container
  if (!formActions) {
    container.appendChild(columnGroup);
  } else {
    // Insert before the form actions container
    container.insertBefore(columnGroup, formActions);
  }

  // Add event listener to the new remove button
  columnGroup.querySelector(".remove-column").addEventListener("click", (e) => {
    const container = document.getElementById("fields-container");
    const columnGroups = container.querySelectorAll(".column-group");
    if (columnGroups.length > 1) {
      columnGroup.remove();
    } else {
      alert("You must have at least one column.");
    }
  });
}

function parseArrayPattern(pattern) {
  // Check if the pattern is an array pattern like ["a", "b", "c"]
  const arrayMatch = pattern.match(/^\s*\[([^\]]*)\]\s*$/);
  if (!arrayMatch) return null;

  try {
    // Use JSON parsing to safely extract the array
    const arrayString = `[${arrayMatch[1]}]`;
    const parsedArray = JSON.parse(arrayString);
    return Array.isArray(parsedArray) ? parsedArray : null;
  } catch (e) {
    return null;
  }
}

function generateFromPattern(pattern) {
  // Check if the pattern is an array pattern
  const arrayValues = parseArrayPattern(pattern);
  if (arrayValues && arrayValues.length > 0) {
    // Return a random item from the array
    return arrayValues[Math.floor(Math.random() * arrayValues.length)];
  }

  let result = "";
  let i = 0;

  while (i < pattern.length) {
    const char = pattern[i];

    // If # or $ followed by a range like [a-z] or [1-9]
    if ((char === "#" || char === "$") && pattern[i + 1] === "[") {
      const endBracket = pattern.indexOf("]", i + 2);
      if (endBracket === -1) {
        result += char;
        i++;
        continue;
      }

      const range = pattern.substring(i + 2, endBracket);

      if (char === "#") {
        // Numeric range
        const [start, end] = range.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          const digit = Math.floor(Math.random() * (end - start + 1)) + start;
          result += digit;
        } else {
          result += char + "[" + range + "]";
        }
      } else {
        // Character range
        const [startChar, endChar] = range.split("-");
        if (
          startChar &&
          endChar &&
          startChar.length === 1 &&
          endChar.length === 1
        ) {
          const codeStart = startChar.charCodeAt(0);
          const codeEnd = endChar.charCodeAt(0);
          const randChar = String.fromCharCode(
            Math.floor(Math.random() * (codeEnd - codeStart + 1)) + codeStart
          );
          result += randChar;
        } else {
          result += char + "[" + range + "]";
        }
      }
      i = endBracket + 1;
    } else if (char === "#") {
      result += Math.floor(Math.random() * 10);
      i++;
    } else if (char === "$") {
      result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
      i++;
    } else {
      result += char;
      i++;
    }
  }

  return result;
}

function generateData(e) {
  if (e) e.preventDefault();

  const colNames = Array.from(document.querySelectorAll(".col-name")).map(
    (el) => el.value.trim()
  );
  const colPatterns = Array.from(document.querySelectorAll(".col-pattern")).map(
    (el) => el.value.trim()
  );
  const recordCount = parseInt(document.getElementById("record-count").value);

  // Validate form
  if (colNames.includes("") || colPatterns.includes("")) {
    alert("Please fill in all column names and patterns.");
    return;
  }

  if (isNaN(recordCount) || recordCount < 1) {
    alert("Please enter a valid number of records.");
    return;
  }

  generatedData = [];

  // Show loading state
  const generateBtn = document.getElementById("generate");
  const originalBtnText = generateBtn.innerHTML;
  generateBtn.disabled = true;
  generateBtn.innerHTML = "Generating...";

  // Use setTimeout to allow UI to update before heavy processing
  setTimeout(() => {
    try {
      for (let i = 0; i < recordCount; i++) {
        const row = {};
        for (let j = 0; j < colNames.length; j++) {
          row[colNames[j]] = generateFromPattern(colPatterns[j]);
        }
        generatedData.push(row);
      }

      displayData(colNames);
    } catch (error) {
      console.error("Error generating data:", error);
      alert(
        "An error occurred while generating data. Please check the console for details."
      );
    } finally {
      // Restore button state
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalBtnText;
    }
  }, 100);
}

function displayData(headers) {
  const output = document.getElementById("output");
  const outputSection = document.getElementById("output-section");

  // Format the data as a table
  const maxRows = 100; // Limit preview to 100 rows
  const previewData = generatedData.slice(0, maxRows);

  // Create a formatted table
  let table =
    '<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200">';

  // Add header row
  table += '<thead class="bg-gray-50"><tr>';
  headers.forEach((header) => {
    table += `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`;
  });
  table += "</tr></thead>";

  // Add data rows
  table += '<tbody class="bg-white divide-y divide-gray-200">';
  previewData.forEach((row) => {
    table += "<tr>";
    headers.forEach((header) => {
      table += `<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border">${row[header]}</td>`;
    });
    table += "</tr>";
  });

  // Add row count info if data was truncated
  if (generatedData.length > maxRows) {
    table += `<tr><td colspan="${headers.length}" class="px-4 py-2 text-sm text-gray-500 text-center bg-gray-50">
      Showing first ${maxRows} of ${generatedData.length} rows
    </td></tr>`;
  }

  table += "</tbody></table></div>";

  output.innerHTML = table;

  // Show the output section with smooth scroll
  outputSection.classList.remove("hidden");
  outputSection.scrollIntoView({ behavior: "smooth" });
}

function downloadCSV() {
  if (!generatedData.length) {
    alert("No data to download. Generate it first.");
    return;
  }

  const headers = Object.keys(generatedData[0]);
  const csv = [headers.join(",")];
  generatedData.forEach((row) => {
    const values = headers.map((h) => row[h]);
    csv.push(values.join(","));
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mock_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function downloadExcel() {
  if (!generatedData.length) {
    alert("Please generate data first!");
    return;
  }

  try {
    // Get headers from the first data row
    const headers = Object.keys(generatedData[0]);

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(generatedData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Generated Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `mock_data_excel.xlsx`);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert("Error generating Excel file. Please check the console for details.");
  }
}

// Add event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add form submit handler
  const form = document.getElementById("data-form");
  form.addEventListener("submit", generateData);

  // Add event listener for download buttons
  document.getElementById("download").addEventListener("click", downloadCSV);
  document
    .getElementById("download-excel")
    .addEventListener("click", downloadExcel);

  // Add event listener for add column button
  document.getElementById("add-column").addEventListener("click", addColumn);

  // Add event listener for the first remove button
  const firstRemoveBtn = document.querySelector(".remove-column");
  if (firstRemoveBtn) {
    firstRemoveBtn.addEventListener("click", (e) => {
      const container = document.getElementById("fields-container");
      if (container.querySelectorAll(".column-group").length > 1) {
        e.target.closest(".column-group").remove();
      } else {
        alert("You must have at least one column.");
      }
    });
  }

  // Add a class to the form actions div for easier targeting
  const formActions = document.createElement("div");
  formActions.className = "form-actions";
  const addColumnBtn = document.querySelector("#add-column").parentElement;
  addColumnBtn.parentNode.insertBefore(formActions, addColumnBtn);
  formActions.appendChild(addColumnBtn);
});
