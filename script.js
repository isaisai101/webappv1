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

  // Get global student list
  let globalStudents = JSON.parse(localStorage.getItem(`students_${currentSubject}`)) || [];
  // Get attendance for the date
  let studentsForDate = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];

  // Merge: ensure all global students are in today's attendance
  globalStudents.forEach(name => {
    if (!studentsForDate.some(s => s.name === name)) {
      studentsForDate.push({ name: name, present: true });
    }
  });

  // Save merged attendance back to LocalStorage
  localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(studentsForDate));

  document.getElementById("attendanceSection").style.display = "block";
  const list = document.getElementById("studentList");
  list.innerHTML = "";

  let presentCount = 0;

  studentsForDate.forEach((student, index) => {
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

  document.getElementById("stats").innerText = `Total: ${studentsForDate.length} | Present: ${presentCount}`;
}

// Add student globally for the subject
function addStudent() {
  const name = document.getElementById("studentName").value;
  if (!name) return;

  // Add to global subject list
  let globalStudents = JSON.parse(localStorage.getItem(`students_${currentSubject}`)) || [];
  if (!globalStudents.includes(name)) {
    globalStudents.push(name);
    localStorage.setItem(`students_${currentSubject}`, JSON.stringify(globalStudents));
  }

  // Ensure attendance entry exists for current date
  let studentsForDate = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];
  if (!studentsForDate.some(s => s.name === name)) {
    studentsForDate.push({ name: name, present: true });
    localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(studentsForDate));
  }

  document.getElementById("studentName").value = "";
  loadAttendance();
}

// Delete student across all dates
function deleteStudent(index) {
  let studentsForDate = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];
  const studentName = studentsForDate[index].name;

  // Remove from all dates
  for (let key in localStorage) {
    if (key.startsWith(`attendance_${currentSubject}_`)) {
      let students = JSON.parse(localStorage.getItem(key)) || [];
      students = students.filter(s => s.name !== studentName);
      localStorage.setItem(key, JSON.stringify(students));
    }
  }

  // Remove from global list
  let globalStudents = JSON.parse(localStorage.getItem(`students_${currentSubject}`)) || [];
  globalStudents = globalStudents.filter(name => name !== studentName);
  localStorage.setItem(`students_${currentSubject}`, JSON.stringify(globalStudents));

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
