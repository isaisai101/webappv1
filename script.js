let currentSubject = "";
let currentDate = "";

// Load selections from LocalStorage
function loadSelection() {
  const savedSubject = localStorage.getItem('selectedSubject');
  const savedDate = localStorage.getItem('selectedDate');

  if (savedSubject) {
    document.getElementById("subjectSelect").value = savedSubject;
    currentSubject = savedSubject;
  }
  if (savedDate) {
    document.getElementById("dateSelect").value = savedDate;
    currentDate = savedDate;
  }

  if (savedSubject && savedDate) loadAttendance();
}

// Save selections to LocalStorage
function saveSelection() {
  localStorage.setItem('selectedSubject', currentSubject);
  localStorage.setItem('selectedDate', currentDate);
}

// Generate a unique key for each subject + date
function attendanceKey(subject, date) {
  return `attendance_${subject}_${date}`;
}

// Load attendance from LocalStorage
function loadAttendance() {
  currentSubject = document.getElementById("subjectSelect").value;
  currentDate = document.getElementById("dateSelect").value;

  if (!currentSubject || !currentDate) {
    alert("Please select subject and date!");
    return;
  }

  saveSelection();

  let students = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];

  document.getElementById("attendanceSection").style.display = "block";
  const list = document.getElementById("studentList");
  list.innerHTML = "";

  let presentCount = 0;

  students.forEach((student, index) => {
    if (student.present) presentCount++;

    const li = document.createElement("li");
    li.className = "student-item";

    const statusBox = document.createElement("span");
    statusBox.className = "status-box";
    statusBox.innerText = student.present ? "✅" : "❌";
    statusBox.onclick = () => toggleAttendance(index);

    const nameSpan = document.createElement("span");
    nameSpan.innerText = student.name;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deleteStudent(index);

    li.appendChild(statusBox);
    li.appendChild(nameSpan);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  document.getElementById("stats").innerText = `Total: ${students.length} | Present: ${presentCount}`;
}

// Add student
function addStudent() {
  const name = document.getElementById("studentName").value;
  if (!name) return;

  let students = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];
  students.push({ name: name, present: true });
  localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(students));

  document.getElementById("studentName").value = "";
  loadAttendance();
}

// Delete student
function deleteStudent(index) {
  let students = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];
  students.splice(index, 1);
  localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(students));
  loadAttendance();
}

// Toggle attendance
function toggleAttendance(index) {
  let students = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];
  students[index].present = !students[index].present;
  localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(students));
  loadAttendance();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadSelection);
