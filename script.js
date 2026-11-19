let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "All";
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}
function addTask() {
    let input = document.getElementById("taskInput");
    let priority = document.getElementById("priority").value;
    let date = document.getElementById("dueDate").value;
    let taskName = input.value.trim();
    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }
    let task = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        date: date,
        completed: false
    };
    tasks.push(task);
    input.value = "";
    document.getElementById("dueDate").value = "";
    saveTasks();
    displayTasks();
}
function displayTasks() {
    let list = document.getElementById("taskList");
    let emptyMessage = document.getElementById("emptyMessage");
    list.innerHTML = "";
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "Pending") {
            return !task.completed;
        }
        if (currentFilter === "Completed") {
            return task.completed;
        }
        return true;
    });
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
    filteredTasks.forEach(task => {
        let li = document.createElement("li");
        let row = document.createElement("div");
        row.className = "task-row";
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onchange = function() {
            toggleTask(task.id);
        };
        let details = document.createElement("div");
        details.className = "task-details";
        if (task.completed) {
            details.classList.add("completed");
        }
        let name = document.createElement("strong");
        name.textContent = task.name;
        let info = document.createElement("p");
        info.textContent = task.date
            ? "Due date: " + task.date
            : "No due date";
        let priorityText = document.createElement("div");
        priorityText.className =
            "priority " + task.priority.toLowerCase();
        priorityText.textContent =
            task.priority + " Priority";
        details.appendChild(name);
        details.appendChild(info);
        details.appendChild(priorityText);
        let actions = document.createElement("div");
        actions.className = "actions";
        let editBtn = document.createElement("button");
        editBtn.textContent = "EDIT";
        editBtn.className = "edit";
        editBtn.onclick = function() {
            editTask(task.id);
        };
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "DELETE";
        deleteBtn.className = "delete";
        deleteBtn.onclick = function() {
            deleteTask(task.id);
        };
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        row.appendChild(checkbox);
        row.appendChild(details);
        row.appendChild(actions);
        li.appendChild(row);

        list.appendChild(li);
    });
    updateStats();
}
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks();
    displayTasks();
}
function editTask(id) {
    let task = tasks.find(task => task.id === id);
    let newName = prompt("Edit your task:", task.name);
    if (newName === null) {
        return;
    }
    newName = newName.trim();
    if (newName === "") {
        alert("Task name cannot be empty!");
        return;
    }
    task.name = newName;
    saveTasks();
    displayTasks();
}
function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }
}
function filterTasks(filter) {
    currentFilter = filter;
    displayTasks();
}
function updateStats() {
    document.getElementById("totalTasks").textContent =
        tasks.length;
    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;
    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;
}
displayTasks();