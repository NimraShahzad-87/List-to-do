let tasks = [];

// Load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompletion(${index})">
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="update" onclick="showUpdateButton(${index})">Update</button>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
                <button onclick="moveUp(${index})" ${index === 0 ? 'disabled' : ''} title="Move Up">&#9650;</button>
                <button onclick="moveDown(${index})" ${index === tasks.length - 1 ? 'disabled' : ''} title="Move Down">&#9660;</button>
                <button onclick="duplicateTask(${index})" title="Duplicate">&#128203;</button>
            </div>
        `;
        taskList.appendChild(taskCard);
    });
}

// Add task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false }); // Initialize completed property
        taskInput.value = '';
        saveTasks(); // Save to local storage
        renderTasks();
    }
}

// Edit task
function editTask(index) {
    const taskList = document.getElementById('taskList');
    const listItem = taskList.children[index];
    
    // Replace task text with an input field for editing
    const taskText = listItem.querySelector('span');
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = taskText.textContent;
    
    // Replace text with input field
    listItem.replaceChild(inputField, taskText);
    
    // Show update button
    const updateButton = listItem.querySelector('.update');
    updateButton.style.display = 'inline-block';
    
    // Hide edit button
    const editButton = listItem.querySelector('.edit');
    editButton.style.display = 'none';
    
    // Add event listener for update button
    updateButton.onclick = () => updateTask(index, inputField);
}

// Update task
function updateTask(index, inputField) {
    const taskList = document.getElementById('taskList');
    const listItem = taskList.children[index];
    
    // Update the new task text
    tasks[index].text = inputField.value;
    
    // Replace input field with new text
    const taskText = document.createElement('span');
    taskText.textContent = tasks[index].text;
    listItem.replaceChild(taskText, inputField);
    
    // Hide update button
    const updateButton = listItem.querySelector('.update');
    updateButton.style.display = 'none';
    
    // Show edit button
    const editButton = listItem.querySelector('.edit');
    editButton.style.display = 'inline-block';
    
    // Save to local storage
    saveTasks();
}

// Toggle completion
function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(); // Save to local storage
    renderTasks(); // Re-render the task list
}

// Delete task
let taskToDeleteIndex = null; // Store the index of the task to delete

function deleteTask(index) {
    taskToDeleteIndex = index; // Set the index to delete
    document.getElementById('customModal').style.display = 'block'; // Show the modal
}

document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (taskToDeleteIndex !== null) {
        tasks.splice(taskToDeleteIndex, 1);
        saveTasks(); // Save to local storage
        renderTasks(); // Re-render the task list
        taskToDeleteIndex = null; // Reset the index
        document.getElementById('customModal').style.display = 'none'; // Hide the modal
    }
});

document.getElementById('cancelDeleteButton').addEventListener('click', function() {
    taskToDeleteIndex = null; // Reset the index
    document.getElementById('customModal').style.display = 'none'; // Hide the modal
});

// Move up task
function moveUp(index) {
    if (index > 0) {
        [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
        saveTasks(); // Save to local storage
        renderTasks();
    }
}

// Move down task
function moveDown(index) {
    if (index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
        saveTasks(); // Save to local storage
        renderTasks();
    }
}

// Duplicate task
function duplicateTask(index) {
    const taskToDuplicate = tasks[index];
    tasks.splice(index + 1, 0, { text: taskToDuplicate.text, completed: taskToDuplicate.completed });
    saveTasks(); // Save to local storage
    renderTasks();
}

// Initial setup
loadTasks();
