// Task Management Application
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.projects = this.loadProjects();
        this.currentFilter = 'all';
        this.currentEditingTask = null;
        this.currentProject = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.initTheme();
        this.updateProjectsList();
    }

    // Event Bindings
    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openTaskModal());
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleMenuClick(e));
        });
        
        // Add project button
        document.getElementById('addProjectBtn').addEventListener('click', () => this.addProject());
        
        // Close modal on overlay click
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.closeTaskModal();
            }
        });
        
        // Priority sort event
        document.getElementById('prioritySort').addEventListener('change', (e) => {
            this.renderTasks();
        });
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('taskflow-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('taskflow-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Data Management
    loadTasks() {
        const tasks = localStorage.getItem('taskflow-tasks');
        return tasks ? JSON.parse(tasks) : this.getDefaultTasks();
    }

    loadProjects() {
        const saved = localStorage.getItem('taskflow-projects');
        if (saved) return JSON.parse(saved);
        return [
            { name: 'Personal', color: '#6366f1' },
            { name: 'Work', color: '#10b981' }
        ];
    }

    saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
    }

    saveProjects() {
        localStorage.setItem('taskflow-projects', JSON.stringify(this.projects));
    }

    getDefaultTasks() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        return [
            {
                id: this.generateId(),
                title: 'Welcome to TaskFlow!',
                description: 'This is your first task. Click to mark it as complete.',
                dueDate: today,
                priority: 'medium',
                project: 'Personal',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Plan your week',
                description: 'Set up your weekly goals and priorities.',
                dueDate: tomorrow,
                priority: 'high',
                project: 'Personal',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Task Operations
    addTask(taskData) {
        const task = {
            id: this.generateId(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Task added successfully!', 'success');
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Task deleted successfully!', 'success');
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            // Show appropriate notification
            if (task.completed) {
                this.showNotification(`Task "${task.title}" marked as complete!`, 'success');
            } else {
                this.showNotification(`Task "${task.title}" moved back to active tasks`, 'info');
            }
        }
    }

    // UI Rendering
    renderTasks() {
        const sortOrder = document.getElementById('prioritySort').value;
        let filteredTasks = this.getFilteredTasks();
        if (sortOrder === 'high-to-low') {
            filteredTasks.sort((a, b) => this.priorityValue(b.priority) - this.priorityValue(a.priority));
        } else {
            filteredTasks.sort((a, b) => this.priorityValue(a.priority) - this.priorityValue(b.priority));
        }
        if (this.currentFilter === 'finished') {
            this.renderFinishedTasks(filteredTasks);
        } else {
            const todayTasks = this.getTodayTasks(filteredTasks);
            const upcomingTasks = this.getUpcomingTasks(filteredTasks);

            this.renderTaskList('todayTaskList', todayTasks);
            this.renderTaskList('upcomingTaskList', upcomingTasks);
            
            document.getElementById('todayCount').textContent = `${todayTasks.length} tasks`;
            document.getElementById('upcomingCount').textContent = `${upcomingTasks.length} tasks`;
        }
    }

    renderTaskList(containerId, tasks) {
        const container = document.getElementById(containerId);
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
        
        // Bind events for each task
        container.querySelectorAll('.task-item').forEach(taskElement => {
            const taskId = taskElement.dataset.taskId;
            
            // Task click to edit
            taskElement.addEventListener('click', (e) => {
                if (!e.target.closest('.task-checkbox') && !e.target.closest('.delete-btn')) {
                    this.editTask(taskId);
                }
            });
            
            // Checkbox click to toggle completion
            const checkbox = taskElement.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTaskComplete(taskId);
                });
            }
            
            // Delete button click
            const deleteBtn = taskElement.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.confirmDeleteTask(taskId);
                });
            }
        });
    }

    createTaskHTML(task) {
        const project = this.projects.find(p => p.name === task.project);
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                    <div class="task-content">
                        <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                        <div class="task-meta">
                            ${dueDate ? `<span class="task-due-date"><i class="fas fa-calendar"></i> ${dueDate}</span>` : ''}
                            <span class="task-priority ${task.priority}">${task.priority}</span>
                            ${project ? `<span class="task-project"><span class="project-color" style="background: ${project.color};"></span> ${project.name}</span>` : `<span class="task-project"><span class="project-color" style="background: #d1d5db;"></span> No Project</span>`}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn edit-btn" title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn delete-btn" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Task Filtering
    getFilteredTasks() {
        let baseTasks;
        
        // First filter by project if one is selected
        if (this.currentProject) {
            baseTasks = this.tasks.filter(task => task.project === this.currentProject);
        } else {
            baseTasks = this.tasks;
        }
        
        // Then apply the current filter
        switch(this.currentFilter) {
            case 'all':
                return baseTasks.filter(task => !task.completed);
            case 'important':
                return baseTasks.filter(task => !task.completed && task.priority === 'high');
            case 'today':
                return this.getTodayTasks(baseTasks.filter(task => !task.completed));
            case 'upcoming':
                return this.getUpcomingTasks(baseTasks.filter(task => !task.completed));
            case 'finished':
                return baseTasks.filter(task => task.completed);
            default:
                return baseTasks.filter(task => !task.completed);
        }
    }

    getTodayTasks(tasks) {
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === today);
    }

    getUpcomingTasks(tasks) {
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate && task.dueDate > today);
    }

    // Statistics
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const todayTasks = this.getTodayTasks(this.tasks).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('todayTasks').textContent = todayTasks;
    }

    // Modal Management
    openTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        // Reset form
        form.reset();
        
        if (task) {
            // Editing existing task
            this.currentEditingTask = task;
            modalTitle.textContent = 'Edit Task';
            this.populateForm(task);
        } else {
            // Creating new task
            this.currentEditingTask = null;
            modalTitle.textContent = 'Add New Task';
            // Set default due date to today
            document.getElementById('taskDueDate').value = new Date().toISOString().split('T')[0];
        }
        
        // Update project options
        this.updateProjectOptions();
        
        modal.classList.add('active');
        document.getElementById('taskTitle').focus();
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        modal.classList.remove('active');
        this.currentEditingTask = null;
    }

    populateForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskProject').value = task.project;
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            dueDate: document.getElementById('taskDueDate').value,
            priority: document.getElementById('taskPriority').value,
            project: document.getElementById('taskProject').value
        };

        if (!taskData.title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        if (this.currentEditingTask) {
            this.updateTask(this.currentEditingTask.id, taskData);
        } else {
            this.addTask(taskData);
        }

        this.closeTaskModal();
    }

    // Search Functionality
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderTasks();
            return;
        }

        const filteredTasks = this.tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm))
        );

        const todayTasks = this.getTodayTasks(filteredTasks);
        const upcomingTasks = this.getUpcomingTasks(filteredTasks);

        this.renderTaskList('todayTaskList', todayTasks);
        this.renderTaskList('upcomingTaskList', upcomingTasks);
        
        document.getElementById('todayCount').textContent = `${todayTasks.length} tasks`;
        document.getElementById('upcomingCount').textContent = `${upcomingTasks.length} tasks`;
    }

    // Menu Navigation
    handleMenuClick(e) {
        const menuItem = e.currentTarget;
        const menuText = menuItem.querySelector('span').textContent.toLowerCase();
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
        menuItem.classList.add('active');
        
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        pageTitle.textContent = menuItem.querySelector('span').textContent;
        
        // Set filter
        switch(menuText) {
            case 'all tasks':
                this.currentFilter = 'all';
                break;
            case 'important':
                this.currentFilter = 'important';
                break;
            case 'today':
                this.currentFilter = 'today';
                break;
            case 'upcoming':
                this.currentFilter = 'upcoming';
                break;
            case 'finished':
                this.currentFilter = 'finished';
                break;
            default:
                this.currentFilter = 'all';
        }
        
        this.renderTasks();
    }

    // Project Management
    addProject() {
        const name = prompt('Enter project name:');
        if (!name) return;
        if (this.projects.some(p => p.name === name)) {
            this.showNotification('Project already exists!', 'error');
            return;
        }
        const color = this.getRandomColor();
        this.projects.push({ name, color });
        this.saveProjects();
        this.updateProjectsList();
        this.updateProjectOptions();
        this.showNotification('Project added!', 'success');
    }

    deleteProject(projectName) {
        if (!confirm(`Delete project "${projectName}" and all its tasks?`)) return;
        this.projects = this.projects.filter(p => p.name !== projectName);
        this.tasks = this.tasks.filter(task => task.project !== projectName);
        this.saveProjects();
        this.saveTasks();
        this.updateProjectsList();
        this.updateProjectOptions();
        this.renderTasks();
        this.showNotification('Project deleted!', 'success');
    }

    updateProjectsList() {
        const projectList = document.getElementById('projectList');
        
        projectList.innerHTML = this.projects.map(project => `
            <div class="project-item ${this.currentProject === project.name ? 'active' : ''}" data-project="${project.name}">
                <div class="project-color" style="background: ${project.color};"></div>
                <span>${this.escapeHtml(project.name)}</span>
                <button class="delete-project-btn" title="Delete Project" data-project="${project.name}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Bind project click events
        projectList.querySelectorAll('.project-item').forEach(item => {
            const projectName = item.dataset.project;
            
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-project-btn')) {
                    this.handleProjectClick(projectName);
                }
            });
        });
        
        // Bind delete project events
        projectList.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectName = btn.dataset.project;
                this.deleteProject(projectName);
            });
        });
    }

    handleProjectClick(projectName) {
        // Toggle project filter
        if (this.currentProject === projectName) {
            this.currentProject = null;
        } else {
            this.currentProject = projectName;
        }
        
        this.renderTasks();
        this.updateProjectsList(); // Update to reflect active state
        
        // Show notification
        if (this.currentProject) {
            this.showNotification(`Filtering by project: ${projectName}`, 'info');
        } else {
            this.showNotification('Showing all projects', 'info');
        }
    }

    updateProjectOptions() {
        const select = document.getElementById('taskProject');
        if (!select) return;
        if (this.projects.length === 0) {
            select.innerHTML = '<option value="">No Projects</option>';
        } else {
            select.innerHTML = this.projects.map(project =>
                `<option value="${project.name}">${project.name}</option>`
            ).join('');
        }
    }

    // Task Actions
    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            this.openTaskModal(task);
        }
    }

    confirmDeleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.deleteTask(taskId);
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles if not already present
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 10px 40px var(--shadow-medium);
                    z-index: 2000;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification.success {
                    border-left: 4px solid var(--secondary-color);
                    color: var(--secondary-color);
                }
                .notification.error {
                    border-left: 4px solid var(--danger-color);
                    color: var(--danger-color);
                }
                .notification.info {
                    border-left: 4px solid var(--primary-color);
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper to assign priority values
    priorityValue(priority) {
        switch(priority) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
        }
    }

    // Render finished tasks in a dedicated section
    renderFinishedTasks(tasks) {
        let finished = tasks.filter(task => task.completed);
        let html = '';
        if (finished.length === 0) {
            html = `<div class="empty-state"><i class="fas fa-check-circle"></i><p>No finished tasks yet!</p></div>`;
        } else {
            html = finished.map(task => this.createTaskHTML(task)).join('');
        }
        document.getElementById('todayTaskList').innerHTML = html;
        document.getElementById('upcomingTaskList').innerHTML = '';
        document.getElementById('todayCount').textContent = `${finished.length} tasks`;
        document.getElementById('upcomingCount').textContent = '';
        // Bind delete and uncheck (restore) for finished tasks
        document.querySelectorAll('#todayTaskList .task-item').forEach(taskElement => {
            const taskId = taskElement.dataset.taskId;
            // Uncheck/restore
            const checkbox = taskElement.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTaskComplete(taskId);
                });
            }
            // Delete button
            const deleteBtn = taskElement.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.confirmDeleteTask(taskId);
                });
            }
        });
    }

    getRandomColor() {
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N to add new task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.taskManager.openTaskModal();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('taskModal');
        if (modal.classList.contains('active')) {
            window.taskManager.closeTaskModal();
        }
    }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}
