// Add student globally for the subject
function addStudent() {
  const name = document.getElementById("studentName").value;
  if (!name) return;

  // 1. Add to global subject list
  let globalStudents = JSON.parse(localStorage.getItem(`students_${currentSubject}`)) || [];
  if (!globalStudents.includes(name)) {
    globalStudents.push(name);
    localStorage.setItem(`students_${currentSubject}`, JSON.stringify(globalStudents));
  }

  // 2. Ensure attendance entry exists for current date
  let studentsForDate = JSON.parse(localStorage.getItem(attendanceKey(currentSubject, currentDate))) || [];

  // Only add if not already in today's attendance
  if (!studentsForDate.some(s => s.name === name)) {
    studentsForDate.push({ name: name, present: true });
    localStorage.setItem(attendanceKey(currentSubject, currentDate), JSON.stringify(studentsForDate));
  }

  document.getElementById("studentName").value = "";
  loadAttendance();
}

// Update loadAttendance to include all global students
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
