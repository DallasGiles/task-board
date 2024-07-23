$(document).ready(function() {
    loadTasks();
    $('#add-task-btn').click(openModal);
    $('#save-task-btn').click(saveTask);
    $('#close-modal-btn').click(closeModal);
    initializeSortable();
});

// Load tasks from localStorage and display them
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task);
    });
}

// Create a task element and append it to the appropriate column
function createTaskElement(task) {
    let taskElement = $('<div>')
        .addClass('task')
        .text(task.title)
        .data('task', task)
        .append($('<button>').text('Delete').click(() => deleteTask(task.id)));

    checkDeadlines(task, taskElement);
    $(`#${task.status} .task-list`).append(taskElement);
}

// Open the modal to add a new task
function openModal() {
    $('#task-modal').show();
}

// Close the modal
function closeModal() {
    $('#task-modal').hide();
    $('#task-title').val('');
    $('#task-desc').val('');
    $('#task-deadline').val('');
}

// Save a new task to localStorage and update the task board
function saveTask() {
    let task = {
        id: Date.now(),
        title: $('#task-title').val(),
        description: $('#task-desc').val(),
        deadline: $('#task-deadline').val(),
        status: 'not-started'
    };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    createTaskElement(task);
    closeModal();
}

// Initialize sortable functionality for task lists
function initializeSortable() {
    $('.task-list').sortable({
        connectWith: '.task-list',
        update: function(event, ui) {
            updateTaskState();
        }
    });
}

// Update task state and localStorage when tasks are moved
function updateTaskState() {
    let tasks = [];
    $('.column').each(function() {
        let status = $(this).attr('id');
        $(this).find('.task').each(function() {
            let task = $(this).data('task');
            task.status = status;
            tasks.push(task);
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete a task from localStorage and the UI
function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    $(`.task`).filter((_, el) => $(el).data('task').id === taskId).remove();
}

// Check deadlines and apply appropriate styling
function checkDeadlines(task, taskElement) {
    let now = dayjs();
    let deadline = dayjs(task.deadline);

    if (now.isAfter(deadline)) {
        taskElement.addClass('overdue'); // Red
    } else if (now.add(2, 'days').isAfter(deadline)) {
        taskElement.addClass('nearing-deadline'); // Orange
    } else {
        taskElement.addClass('on-time'); // Green
    }
}