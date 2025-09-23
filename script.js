let students = [];

document.getElementById("fileInput").addEventListener("change", function(e) {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onload = function(e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });

    // Lấy sheet đầu tiên
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Excel đọc được:", rows);

    students = [];

    // Giả sử Excel có dạng: Tên | Điểm
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i];
      if (row[0] && row[1]) {
        students.push({ name: row[1], score: Number(row[2]) });
      }
    }

    console.log("Danh sách học sinh:", students);

    renderTable(students);
  };

  reader.readAsArrayBuffer(file);
});

function renderTable(data) {
  let sorted = [...data].sort((a, b) => b.score - a.score);
  sorted = sorted.slice(0, 30); // chỉ lấy top 30

  let result = "<h3>Top 30 học sinh điểm cao nhất</h3>";
  result += "<table id='studentTable'><tr><th>STT</th><th>Tên</th><th>Điểm</th></tr>";
  sorted.forEach((s, i) => {
    result += `<tr><td>${i+1}</td><td>${s.name}</td><td>${s.score}</td></tr>`;
  });
  result += "</table>";
  document.getElementById("result").innerHTML = result;
}

function filterTable() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(keyword));
  renderTable(filtered);
}
