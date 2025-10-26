// script.js
const API_URL = "http://localhost:8080/tasks"; // URL backend

// --- Fungsi pop-up notifikasi ---
function showPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.textContent = message;
  document.body.appendChild(popup);

  // Animasi muncul
  setTimeout(() => popup.classList.add("show"), 50);

  // Hilang otomatis setelah 2.5 detik
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 2500);
}

// --- Halaman Utama (index.html) ---
if (document.getElementById("addTaskBtn")) {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const goListBtn = document.getElementById("goListBtn");
  const errorMsg = document.getElementById("errorMsg");

  addTaskBtn.addEventListener("click", async () => {
    const taskName = taskInput.value.trim();

    if (taskName === "") {
      showPopup("Tugas tidak boleh kosong!", "error");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: taskName }),
      });
      if (!response.ok) throw new Error("Gagal menambah tugas");

      taskInput.value = "";
      showPopup("✅ Tugas berhasil ditambahkan!", "success");
    } catch (err) {
      console.error(err);
      showPopup("❌ Terjadi kesalahan saat menambah tugas.", "error");
    }
  });

  goListBtn.addEventListener("click", () => {
    window.location.href = "list.html";
  });
}

// --- Halaman Daftar Tugas (list.html) ---
if (document.getElementById("taskList")) {
  const taskList = document.getElementById("taskList");
  const backBtn = document.getElementById("backBtn");
  const viewArchivedBtn = document.getElementById("viewArchivedBtn");
if (viewArchivedBtn) {
  viewArchivedBtn.addEventListener("click", () => {
    window.location.href = "archived.html";
  });
}

  // Load semua tugas
  async function loadTasks() {
    try {
      const response = await fetch(API_URL);
      const tasks = await response.json();

      taskList.innerHTML = "";

      if (tasks.length === 0) {
        taskList.innerHTML = "<p>Tidak ada tugas.</p>";
        return;
      }

      tasks.forEach((task) => {
        const li = document.createElement("li");

        // Checkbox untuk status selesai
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
          await toggleTaskStatus(task._id);
        });

        // Nama tugas
        const taskName = document.createElement("span");
        taskName.textContent = task.name;
        taskName.style.textDecoration = task.completed ? "line-through" : "none";

        // Tombol hapus
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async () => {
          await deleteTask(task._id);
        });

        // Tombol arsipkan
        const archiveBtn = document.createElement("button");
        archiveBtn.classList.add("archive-btn");
        archiveBtn.innerHTML = "📦 Arsipkan"; // bisa ganti ikon sesuai keinginan
        archiveBtn.title = "Arsipkan tugas ini"; // tooltip saat hover
        archiveBtn.addEventListener("click", async () => {
          await archiveTask(task._id);
        });


        li.appendChild(checkbox);
        li.appendChild(taskName);
        li.appendChild(deleteBtn);
        li.appendChild(archiveBtn); // jika pakai arsip
        taskList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      showPopup("❌ Gagal memuat daftar tugas.", "error");
    }
  }

  // DELETE tugas
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus tugas");

      showPopup("🗑️ Tugas berhasil dihapus!", "success");
      loadTasks();
    } catch (err) {
      console.error(err);
      showPopup("❌ Gagal menghapus tugas.", "error");
    }
  }

  // PUT toggle status selesai
  async function toggleTaskStatus(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, { method: "PUT" });
      if (!response.ok) throw new Error("Gagal memperbarui status tugas");
      loadTasks();
    } catch (err) {
      console.error(err);
      showPopup("❌ Gagal memperbarui status tugas.", "error");
    }
  }

  // Optional: PUT arsipkan tugas
  async function archiveTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/archive`, { method: "PUT" });
      if (!response.ok) throw new Error("Gagal mengarsipkan tugas");
      showPopup("📦 Tugas berhasil diarsipkan", "success");
      loadTasks();
    } catch (err) {
      console.error(err);
      showPopup("❌ Gagal mengarsipkan tugas.", "error");
    }
  }

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Load daftar tugas saat halaman dibuka
  loadTasks();
}
