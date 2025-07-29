# TaskFlow - Modern Task Management Website

A beautiful, modern task management application built with vanilla JavaScript, featuring a contemporary design with glassmorphism effects, dark mode support, and smooth animations.

## ✨ Features

### 🎨 Modern Design
- **Glassmorphism UI** - Beautiful frosted glass effects
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Delightful micro-interactions throughout the app
- **Contemporary Typography** - Using Inter font for modern readability

### 📋 Task Management
- **Create, Edit, Delete Tasks** - Full CRUD operations
- **Task Priorities** - High, Medium, Low priority levels with color coding
- **Due Dates** - Set and track task deadlines
- **Project Organization** - Organize tasks by projects with custom colors
- **Task Completion** - Mark tasks as complete with visual feedback
- **Search Functionality** - Quickly find tasks by title or description

### 📊 Dashboard & Analytics
- **Statistics Cards** - Overview of total, completed, pending, and today's tasks
- **Today's Tasks** - Focus on what needs to be done today
- **Upcoming Tasks** - Plan ahead with future task visibility
- **Progress Tracking** - Visual indicators of task completion

### 🔧 Advanced Features
- **Local Storage** - All data persists locally in your browser
- **Keyboard Shortcuts** - Ctrl/Cmd + N to add new task, Escape to close modals
- **Real-time Updates** - Instant UI updates without page refresh
- **Notifications** - Success/error notifications for user actions
- **Empty States** - Helpful messages when no tasks are present

## 🚀 Getting Started

### Quick Start
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start managing your tasks immediately!

### File Structure
```
task-management/
├── index.html          # Main HTML file
├── styles.css          # Modern CSS with glassmorphism and dark mode
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 💾 Database Options

This application currently uses **Local Storage** for data persistence, which is perfect for personal use. For production or multi-user scenarios, here are the best **free** database options:

### 1. Supabase (Recommended)
- **Free Tier**: Up to 500MB database, 50MB file storage, 2GB bandwidth
- **Features**: PostgreSQL database, real-time subscriptions, authentication
- **Setup**: 
  1. Sign up at [supabase.com](https://supabase.com)
  2. Create a new project
  3. Use the provided API keys and URL
  4. Replace local storage calls with Supabase client calls

### 2. Firebase Firestore
- **Free Tier**: 1GB storage, 50K reads/day, 20K writes/day
- **Features**: NoSQL document database, real-time updates
- **Setup**:
  1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
  2. Enable Firestore Database
  3. Add Firebase SDK to your project

### 3. MongoDB Atlas
- **Free Tier**: 512MB storage, shared clusters
- **Features**: MongoDB database, cloud hosting
- **Setup**:
  1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
  2. Create a free cluster
  3. Use MongoDB drivers or REST API

### 4. PlanetScale
- **Free Tier**: 5GB storage, 1 billion row reads/month
- **Features**: MySQL-compatible, serverless
- **Perfect for**: Applications that need SQL database

## 🎯 Usage

### Adding Tasks
1. Click the "Add Task" button or press `Ctrl/Cmd + N`
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Due Date** (optional)
   - **Priority** (Low, Medium, High)
   - **Project** (Personal, Work, or custom)
3. Click "Save Task"

### Managing Tasks
- **Complete Task**: Click the checkbox next to any task
- **Edit Task**: Click the edit icon on task hover
- **Delete Task**: Click the delete icon on task hover
- **Search Tasks**: Use the search box in the header

### Navigation
- **Dashboard**: Overview of all tasks and statistics
- **All Tasks**: View all tasks regardless of date
- **Important**: Filter to show only high-priority tasks
- **Today**: Show tasks due today
- **Upcoming**: Show future tasks

### Projects
- **Add Project**: Click "Add Project" in the sidebar
- **Custom Colors**: Each project gets a random color automatically
- **Organization**: Tasks are organized by project with visual indicators

## 🎨 Customization

### Themes
The app supports both light and dark themes. Click the theme toggle in the sidebar to switch between them. Your preference is saved automatically.

### Colors
You can customize the color scheme by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #10b981;    /* Success/secondary color */
    --accent-color: #f59e0b;       /* Warning/accent color */
    --danger-color: #ef4444;       /* Error/danger color */
}
```

### Adding New Features
The code is well-structured and modular. To add new features:

1. **New Task Properties**: Modify the task object structure in `script.js`
2. **New UI Elements**: Add HTML in `index.html` and style in `styles.css`
3. **New Functionality**: Extend the `TaskManager` class in `script.js`

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **Font Awesome** - Icons
- **Google Fonts** - Inter typography

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- **Lightweight**: No external dependencies except fonts and icons
- **Fast Loading**: Minimal CSS and JavaScript
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Efficient Rendering**: Virtual DOM-like updates for task lists

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Deploy automatically on every push
3. Get a custom domain for free

### Vercel
1. Import your GitHub repository
2. Deploy with zero configuration
3. Automatic deployments on git push

## 🤝 Contributing

Feel free to contribute to this project! Here are some ways you can help:

- 🐛 Report bugs
- 💡 Suggest new features
- 🎨 Improve the design
- 📝 Improve documentation
- 🔧 Add new functionality

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- Design inspiration from modern task management apps
- Icons by [Font Awesome](https://fontawesome.com)
- Typography by [Google Fonts](https://fonts.google.com)
- Color palette inspired by [Tailwind CSS](https://tailwindcss.com)

---

**Happy Task Managing! 🚀**

For questions or support, please open an issue in the repository.
