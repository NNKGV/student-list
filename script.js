let students = [];

// Đọc file Excel
document.getElementById("fileInput").addEventListener("change", function (e) {
  let file = e.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = function (e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });

    // Lấy sheet đầu tiên
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    students = [];

    // Giả sử Excel có dạng: STT | Tên | Điểm
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i];
      if (row[1] && row[2]) {
        students.push({ name: row[1], score: Number(row[2]) });
      }
    }

    renderTable(students);
  };
  reader.readAsArrayBuffer(file);
});

// Lấy số N từ input
function getTopN() {
  const n = parseInt(document.getElementById("topInput").value) || 30;
  return Math.max(1, n); // ít nhất là 1
}

// Hiển thị bảng
function renderTable(data) {
  let n = getTopN();
  let sorted = [...data].sort((a, b) => b.score - a.score).slice(0, n);

  let tbody = document.querySelector("#studentTable tbody");
  if (!tbody) {
    console.error("Không tìm thấy <tbody> trong #studentTable");
    return;
  }

  tbody.innerHTML = "";
  sorted.forEach((s, i) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${s.name}</td><td>${s.score}</td>`;
    tbody.appendChild(tr);
  });
}

// Lọc theo tên
function filterTable() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
}

// Xuất file Excel
function exportFile() {
  if (students.length === 0) {
    alert("Chưa có dữ liệu để xuất!");
    return;
  }

  let n = getTopN();
  let sorted = [...students].sort((a, b) => b.score - a.score).slice(0, n);

  let data = [["STT", "Tên", "Điểm"]];
  sorted.forEach((s, i) => {
    data.push([i + 1, s.name, s.score]);
  });

  let worksheet = XLSX.utils.aoa_to_sheet(data);
  let workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Top" + n);

  XLSX.writeFile(workbook, `Top${n}HocSinh.xlsx`);
}

// Gắn sự kiện
document.getElementById("exportBtn").addEventListener("click", exportFile);
document.getElementById("searchInput").addEventListener("input", filterTable);
document.getElementById("sortBtn").addEventListener("click", function () {
  renderTable(students);
});
