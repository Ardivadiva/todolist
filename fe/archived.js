const ARCHIVED_API_URL = "http://localhost:8080/tasks/archived";

if (document.getElementById("archivedList")) {
  const archivedList = document.getElementById("archivedList");
  const backBtn = document.getElementById("backBtn");

  async function loadArchivedTasks() {
    try {
      const response = await fetch(ARCHIVED_API_URL);
      const tasks = await response.json();

      archivedList.innerHTML = "";

      if (tasks.length === 0) {
        archivedList.innerHTML = "<p>Tidak ada tugas arsip.</p>";
        return;
      }

      tasks.forEach((task) => {
        const li = document.createElement("li");

        const taskName = document.createElement("span");
        taskName.textContent = task.name;
        taskName.style.textDecoration = task.completed ? "line-through" : "none";

        li.appendChild(taskName);
        archivedList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      alert("❌ Gagal memuat tugas arsip.");
    }
  }

  backBtn.addEventListener("click", () => {
    window.location.href = "list.html";
  });

  loadArchivedTasks();
}
