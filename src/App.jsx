import React, { useMemo, useState } from "react";
import Bell from '@mui/icons-material/NotificationsNone';
import BookOpen from '@mui/icons-material/MenuBook';
import CalendarDays from '@mui/icons-material/CalendarMonth';
import CheckCircle2 from '@mui/icons-material/CheckCircle';
import ClipboardList from '@mui/icons-material/Assignment';
import Home from '@mui/icons-material/Home';
import Moon from '@mui/icons-material/DarkMode';
import Plus from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Sun from '@mui/icons-material/LightMode';
import Target from '@mui/icons-material/TrackChanges';
import Trash2 from '@mui/icons-material/Delete';
import Edit from "@mui/icons-material/Edit";
import X from '@mui/icons-material/Close';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';;
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./App.css";
import StatCard from "./component/StatCard.jsx";
import Priority from "./component/Priority.jsx";
import TaskList from "./component/TaskList.jsx";


function getDateKey(due) {
  if (!due || due === "No due date") return null;
  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");//padStart() is a string method that adds characters to the beginning of string.
  return `${year}-${month}-${day}`;
}


const initialTasks = [
  {
    id: 1,
    title: "Complete React Assignment",
    subject: "React",
    priority: "High",
    due: "2026-08-20T10:00",
    completed: false,
    description: "Build custom hooks component."
  },
  {
    id: 2,
    title: "Prepare OS Lab Record",
    subject: "Operating Systems",
    priority: "Medium",
    due: "2026-08-21T12:00",
    completed: false,
    description: "CPU scheduling algorithms."
  },
  {
    id: 3,
    title: "Submit Maths Assignment",
    subject: "Maths",
    priority: "Low",
    due: "2026-08-22T23:59",
    completed: true,
    description: "Linear algebra problem set."
  },
  {
    id: 4,
    title: "Study DBMS Chapter 3",
    subject: "DBMS",
    priority: "High",
    due: "2026-08-23T15:00",
    completed: false,
    description: "Normalization forms."
  },
  {
    id: 5,
    title: "Read Computer Graphics Notes",
    subject: "Computer Graphics",
    priority: "Medium",
    due: "2026-08-24T17:00",
    completed: false,
    description: "Rasterization techniques."
  },
  {
    id: 6,
    title: "Revise Java OOP Concepts",
    subject: "Java",
    priority: "Low",
    due: "2026-08-25T09:00",
    completed: false,
    description: "Polymorphism and Interfaces."
  }
];

const initialSubjects = [
  { name: "DBMS", color: "#20a866" },
  { name: "Operating Systems", color: "#f5aa13" },
  { name: "Computer Graphics", color: "#2d91e8"  },
  { name: "Maths", color: "#c83232" },
  { name: "Java", color: "#a349c6" }
];

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Tasks", icon: ClipboardList },
  { label: "Subjects", icon: BookOpen },
  { label: "Calendar", icon: CalendarDays },
  { label: "Completed", icon: CheckCircle2 },
  { label: "Reminders", icon: Bell },
  { label: "Settings", icon: Settings }
];
function App() {
  const [tasks, setTasks] = useState(initialTasks);//tasks:current list of task,settasks:-change the task
  const [subjects, setSubjects] = useState(initialSubjects);//subject:-current subj,setsubject:-change subject
  const [page, setPage] = useState("Dashboard");
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");//search stores curren
  const [showAdd, setShowAdd] = useState(false);//It tracks whether the "Add Task" modal or form is currently open and visible on the screen
  const [editingTask, setEditingTask] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState(null);
  

  // Change this date if you want the calendar to open on a different month.
  // Example: new Date(2026, 7, 1) = August 2026
  const [calendarDate, setCalendarDate] = useState(
    new Date(2026, 7, 1)
  );

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    subject: "React",
    priority: "Medium",
    due: ""
  });

  const [newSubject, setNewSubject] = useState({
    name: "",
    color: "#6545df"
  });

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const subjectData = useMemo(() => {//Your app does the math once, writes the answer down on a sticky note (caches it), and looks at the sticky note whenever it needs the answer
    return subjects.map(sub => {//loops through every item in the subjects and returns a brand-new array.
      const count = tasks.filter(t => t.subject === sub.name).length;//Counting Tasks per Subject
      return {
        name: sub.name,
        value: count,
        color: sub.color
      };
    });
  }, [subjects, tasks]);//Closes the useMemo hook.

  // Reminders: tasks that have a real due date, closest deadline first.
  const reminderTasks = useMemo(() => {
    return tasks
      .filter(
        t =>
          t.due &&
          t.due !== "No due date" &&
          !Number.isNaN(new Date(t.due).getTime())
      )
      .slice()//creates a full, exact copy of the entire array from beginning to end.
      .sort((a, b) => new Date(a.due) - new Date(b.due));
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  //This function toggles the completion status (done or not done) of a specific task
  function toggleTask(id) {
    setTasks(current =>
      current.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  }

  function deleteTask(id) {
    setTasks(current =>
      current.filter(t => t.id !== id)
    );
  }

  function editTask(task) {
  setEditingTask(task);
  setNewTask({
    title: task.title,
    description: task.description,
    subject: task.subject,
    priority: task.priority,
    due: task.due === "No due date" ? "" : task.due
  });
  setShowAdd(true);
}

  function addTask(e) {
  e.preventDefault();

  if (!newTask.title.trim()) return;

  if (editingTask) {
    // Update existing task         //current=>list of tasks
    setTasks(current =>
      current.map(t =>
        t.id === editingTask.id
          ? {
              ...t,
              title: newTask.title,
              description: newTask.description,
              subject: newTask.subject,
              priority: newTask.priority,
              due: newTask.due || "No due date"
            }
          : t
      )
    );

    setEditingTask(null);//stop editing
  } else {
    // Add new task
    setTasks(current => [
      ...current,
      {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        subject: newTask.subject,
        priority: newTask.priority,
        due: newTask.due || "No due date",
        completed: false
      }
    ]);
  }

  setNewTask({
    title: "",
    description: "",
    subject: "React",
    priority: "Medium",
    due: ""
  });

  setShowAdd(false);
}

  function addSubject(e) {
  e.preventDefault();

  if (!newSubject.name.trim()) return;

  if (editingSubject) {
    // EDIT EXISTING SUBJECT
    setSubjects(current =>
      current.map(s =>
        s.name === editingSubject.name
          ? {
              ...s,
              name: newSubject.name,
              color: newSubject.color
            }
          : s
      )
    );

    setEditingSubject(null);
  } else {
    // ADD NEW SUBJECT
    if (
      subjects.some(
        s =>
          s.name.toLowerCase() ===
          newSubject.name.toLowerCase()
      )
    ) {
      return;
    }

    setSubjects(current => [
      ...current,
      newSubject
    ]);
  }

  // Reset form
  setNewSubject({
    name: "",
    color: "#6545df"
  });

  setShowAddSubject(false);
}
function editSubject(subject) {
  setEditingSubject(subject);

  setNewSubject({
    name: subject.name,
    color: subject.color
  });

  setShowAddSubject(true);
}

  const pageTitle =
    page === "Dashboard" ? "Dashboard" : page;

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎓</div>

          <div>
            <h2>StudyTask</h2>
            <small>Student To-Do App</small>
          </div>
        </div>

        <nav>
          {navItems.map(//Mapping Over Navigation Items
          //Map:-it loops through an array 
            ({ label, icon: Icon }) => (
              <button
                key={label}
                className={
                  page === label &&
                  !selectedSubject
                    ? "nav-item active"
                    : "nav-item"
                    //Is the current active page state equal to this button's label
                }
                onClick={() => {
                  setPage(label);//Updates the main page state to the clicked button's label
                  setSelectedSubject(null);//Resets any selected subject back to null
                }}
              >
               <Icon sx={{ fontSize: 20 }} />
                <span>{label}</span>
              </button>
            )
          )}
        </nav>

        <div className="profile">
          <div className="avatar">👨‍🎓</div>

          <div>
            <strong>Arpan</strong>
            <small>Computer Engineering</small>
            <small>6th Semester</small>
          </div>
        </div>

        
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>
              {pageTitle === "Dashboard"
                ? "Good Morning, Arpan! "
                : pageTitle}
            </h1>

            <p>
              {pageTitle === "Dashboard"
                ? "Stay focused and complete your tasks"
                : "Manage your student tasks and stay organized."}
            </p>
          </div>
 {/* --- search taks does not show in these pages*/}
      <div className="header-actions">
  {page !== "Calendar" &&
    page !== "Settings" &&
    page !== "Reminders" &&
    page !== "Subjects" &&
    page !== "Completed" && (
      <div className="search">
        <Search sx={{ fontSize: 18 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>
    )}
</div>
        </header>

        {selectedSubject ? (
          <section className="card page-card">
            <div className="page-toolbar subject-toolbar">
              <button
                className="secondary"
                onClick={() =>
                  setSelectedSubject(null)
                }
              >
              <ArrowLeft sx={{ fontSize: 16 }} />
                Back to Subjects
              </button>
            </div>

            <div className="subject-detail-header">
              <div
                className="subject-color-dot"
                style={{ "--subject-color": selectedSubject.color }}
              />

              <h2>
                {selectedSubject.name} Dashboard
              </h2>
            </div>

            <div className="related-tasks">
              <h3>Related Tasks</h3>

              
            </div>
          </section>
        ) : (
          <>
            {page === "Dashboard" && (
              <>{/*this shows the color of the status of the tasks*/}
                <section className="stats">
                  <StatCard
                    icon={ClipboardList}
                    value={tasks.length}
                    label="Total Tasks"
                    tone="purple"   
                  />
{/*purple for total task*/}
                  <StatCard
                    icon={Target}
                    value={pending}
                    label="Pending Tasks"
                    tone="orange"
                  />
{/*orange  for pending task*/}
                  <StatCard
                    icon={CheckCircle2}
                    value={completed}
                    label="Completed"
                    tone="green"
                  />
{/*green for completed task*/}
                  <StatCard
                    icon={CalendarDays}
                    value="3"
                    label="Due Today"
                    tone="blue"
                  />
                </section>
{/*blue for due today */}
                <section className="dashboard-grid">
                  <div className="card tasks-card">
                    <div className="card-heading">
                      <h2>Today's Tasks</h2>

                      <button
                        onClick={() =>
                          setPage("My Tasks")
                        }
                      >
                        View All
                      </button>
                    </div>

                   <TaskList
  tasks={visibleTasks.slice(0, 5)}
  toggleTask={toggleTask}
  deleteTask={deleteTask}
  editTask={editTask}
/>



                    <div className="progress">
                      <div className="progress-label">
                        <span>
                          Today's Progress
                        </span>
                        <b>{progress}%</b>
                      </div>

                      <div className="progress-track">
                        <div style={{ "--progress": `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="card chart-card">
                    <div className="card-heading">
                      <h2>Tasks by Subject</h2>
                    </div>

                    <div className="chart-wrap">{/*used to render a donut/pie chart (using the Recharts library*/}
                      <ResponsiveContainer
                        width="100%"
                        height={190}
                      >{/*it is declared in responsivecontainer.d.ts (typescript)*/}
                        <PieChart>
                          <Pie
                            data={subjectData}
                            dataKey="value"
                            innerRadius={52}
                            outerRadius={78}
                            paddingAngle={2}
                          >
                            {subjectData.map(
                              entry => (
                                <Cell
                                  key={
                                    entry.name
                                  }
                                  fill={
                                    entry.color
                                  }
                                />
                              )
                            )}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="chart-center">
                        <strong>
                          {tasks.length}
                        </strong>
                        <span>Total</span>
                      </div>
                    </div>

                    <div className="legend">{/*legend is used in lib.dom.d.ts*/}
                      {subjectData.map(s => (
                        <div key={s.name}>
                          <i style={{ "--subject-color": s.color }} />
                          {s.name}
                          <span>
                            {s.value} Tasks
                          </span>{/*builds that chart legend for your application by looping through your subjectData*/}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {page === "Subjects" && (
              <section className="card page-card">
                <div className="page-toolbar">
                  <h2>All Subjects</h2>

                  <button
                    className="primary"
                    onClick={() =>
                      setShowAddSubject(true)
                    }
                  >{/*its true bcoz user want to open add subject form */}
                    <Plus sx={{ fontSize: 18 }} />
                    Add Subject
                  </button>
                </div>

                

                <div className="subjects-grid">
                  {subjects.map(sub => {
                    const subTasks =
                      tasks.filter(
                        t =>
                          t.subject ===
                          sub.name
                      );
{/*This code loops through your main subjects array to dynamically generate and display a visual card or grid item for every single subject*/}
                    const subCompleted =
                      subTasks.filter(
                        t => t.completed
                      ).length;

                    const subProgress =
                      subTasks.length
                        ? Math.round(
                            (subCompleted /
                              subTasks.length) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={sub.name}
                        className="card subject-card"
                        onClick={() =>
                          setSelectedSubject(sub)
                        }
                        style={{ "--subject-color": sub.color }}
                      >
                        <div className="subject-card-heading">
  <h3>{sub.name}</h3>

  <button
    className="edit-subject-btn"
    onClick={(e) => {
      e.stopPropagation();
      editSubject(sub);
    }}
  >
    <Edit sx={{ fontSize: 16 }} />
    Edit
  </button>

  <span className="subject-count">
    {subCompleted} /{" "}
    {subTasks.length}{" "}
    Done
  </span>
</div>

                        <div className="progress subject-progress">
                          <div className="progress-track">
                            <div style={{ "--progress": `${subProgress}%` }} />
                          </div>
                        </div>

                        <small className="subject-progress-label">
                          {subProgress}%
                          Completed
                        </small>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {page === "My Tasks" && (
              <section className="card page-card">
                <div className="page-toolbar">
                  <div className="filters">
                    {[
                      "All",
                      "Pending",
                      "Completed"
                    ].map(f => (
                      <button
                        className={
                          filter === f
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setFilter(f)
                        }
                        key={f}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    className="primary"
                    onClick={() =>
                      setShowAdd(true)
                    }
                  >
                    <Plus size={18} />
                    Add Task
                  </button>
                </div>

                <TaskList
                  tasks={visibleTasks}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                />
              </section>
            )}

            {page === "Completed" && (
              <section className="card page-card">
                <h2>Completed Tasks</h2>

                <TaskList
                  tasks={tasks.filter(
                    t => t.completed
                  )}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                />
              </section>
            )}

            {/* --- CALENDAR --- */}
            {page === "Calendar" && (
              <section className="card page-card calendar-card">
                <div className="calendar-toolbar">
                  <div>
                    <h2 className="calendar-title">
                      Task Calendar
                    </h2>

                    <p className="calendar-subtitle">
                      See your tasks by date
                      and time
                    </p>
                  </div>

                  <div className="calendar-nav">
                    <button
                      className="secondary"
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() -
                              1,
                            1
                          )
                        )
                      }
                    >
                      <ChevronLeft sx={{ fontSize: 18 }} />
                      
                    </button>

                    <strong className="calendar-month">
                      {calendarDate.toLocaleString(
                        "en-IN",
                        {
                          month: "long",
                          year: "numeric"
                        }
                      )}
                    </strong>

                    <button
                      className="secondary"
                      onClick={() =>
                        setCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth() +
                              1,
                            1
                          )
                        )
                      }
                    >
                      <ChevronRight sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>

                <div className="calendar-scroll">
                  <div className="calendar-grid">
                    {[
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat"
                    ].map(day => (
                      <div key={day} className="calendar-weekday">
                        {day}
                      </div>
                    ))}
{/*renders the weekdays header row (Sun, Mon, Tue, Wed, Thu, Fri, Sat*/}
                    {(() => {
                      const year =
                        calendarDate.getFullYear();

                      const month =
                        calendarDate.getMonth();

                      const firstDay =
                        new Date(
                          year,
                          month,
                          1
                        ).getDay();
{/*for First day:- Finding Where the Month Starts*/}
                      const daysInMonth =
                        new Date(
                          year,
                          month + 1,
                          0
                        ).getDate();
{/*for dayinmonth :- Finding Total Days in the Month*/}
                      const cells = [];
{/*creates empty cell */}
                      for (
                        let i = 0;
                        i < firstDay;
                        i++
                      ) {
                        // If the first falls on Wednesday, firstDay is 3.
                        cells.push(
                          <div key={`empty-${i}`} className="calendar-day calendar-day-empty" />
                        );
                      }
{/*cell.push--Adds a new element into your cells array*/}
                      for (
                        let day = 1;
                        day <= daysInMonth;
                        day++
                      ) {
                        const dateKey =
                          `${year}-${String(
                            month + 1
                          ).padStart(
                            2,
                            "0"
                          )}-${String(
                            day
                          ).padStart(
                            2,
                            "0"
                          )}`;
{/*const datekey-- Formats the current year, month, and day into a standardized "YYYY-MM-DD" strin*/}
                        const dayTasks =
                          tasks.filter(
                            task =>
                              getDateKey(
                                task.due
                              ) === dateKey
                          );

                        cells.push(
                          <div key={dateKey} className="calendar-day">
                            <div className="calendar-date">
                              {day}
                            </div>

                            <div className="calendar-tasks">
                              {dayTasks.map(
                                task => (
                                  <div key={task.id} className={`calendar-task ${task.completed ? "completed" : ""}`}>
                                    <div className="calendar-task-title">
                                      {
                                        task.title
                                      }
                                    </div>

                                    <div className="calendar-task-time">
                                      {new Date(
                                        task.due
                                      ).toLocaleTimeString(
                                        "en-IN",
                                        {
                                          hour:
                                            "2-digit",
                                          minute:
                                            "2-digit"
                                        }
                                      )}
                                    </div>

                                    <div className="calendar-task-meta">
                                      {
                                        task.subject
                                      }{" "}
                                      ·{" "}
                                      {
                                        task.priority
                                      }
                                    </div>
                                  </div>
                                )
                              )}
{/*Renders an "No tasks" message box if the dayTasks array is empty*/}
                              {!dayTasks.length && (
                                <span className="calendar-empty-message">
                                  No tasks
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return cells;
                    })()}
                  </div>
                </div>
              </section>
            )}

            {/* --- REMINDERS --- */}
            {page === "Reminders" && (
              <section className="card page-card">
                <div className="page-toolbar">
                  <h2>Upcoming Reminders</h2>
                </div>
{/*tasklist func is made on 1135 line*/}
                <TaskList
                  tasks={reminderTasks}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                />
              </section>
            )}
            {page === "Settings" && (
  <section className="card page-card">
    <h2>Settings</h2>
    <button className="theme-toggle" onClick={() => setDark(!dark)}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "Light Mode" : "Dark Mode"}</span>
      <span className={`switch ${dark ? "on" : ""}`}><i /></span>
    </button>
  </section>
)}

            {page !== "Dashboard" &&
              page !== "My Tasks" &&
              page !== "Completed" &&
              page !== "Subjects" &&
              page !== "Calendar" &&
              page !== "Reminders" &&
              page !== "Settings" && (
                <section className="card empty-page">
                  <div className="empty-icon">
                    ⚙️
                  </div>
                </section>
              )}
          </>
        )}
      </main>

      <button
        className="floating"
        onClick={() => setShowAdd(true)}
      >
       <Plus sx={{ fontSize: 28 }} />
      </button>

      {/* --- ADD TASK MODAL --- */}
      {showAdd && (
        <div
          className="modal-backdrop"
          onMouseDown={() =>
            setShowAdd(false)
          }
        >
          <form
            className="modal"
            onSubmit={addTask}
            onMouseDown={e =>
              e.stopPropagation()
            }
          >
            <div className="modal-heading">
              <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

              <button
  type="button"
  onClick={() => {
    setShowAddSubject(false);
    setEditingSubject(null);
    setNewSubject({
      name: "",
      color: "#6545df"
    });
  }}
>
  <X />
</button>
            </div>

            <label>
              Task Title

              <input
                required
                value={newTask.title}
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value
                  })
                }
                placeholder="Learn useEffect Hook"
              />
            </label>

            <label>
              Description

              <textarea
                value={newTask.description}
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    description:
                      e.target.value
                  })
                }
                placeholder="Write task details..."
              />
            </label>

            <label>
              Subject

              <select
                value={newTask.subject}
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    subject:
                      e.target.value
                  })
                }
              >
                {subjects.map(s => (
                  <option
                    key={s.name}
                    value={s.name}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority

              <select
                value={newTask.priority}
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    priority:
                      e.target.value
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            {/* CHANGE THE DUE DATE AND TIME HERE */}
            <label>
              Due Date & Time

              <input
                type="datetime-local"
                value={newTask.due}
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    due: e.target.value
                  })
                }
              />
            </label>

           <button
  className="primary full"
  type="submit"
>
  {editingTask ? "Save Changes" : "Add Task"}
</button>
          </form>
        </div>
      )}

      {/* --- ADD SUBJECT MODAL --- */}
      {showAddSubject && (
        <div
          className="modal-backdrop"
          onMouseDown={() =>
            setShowAddSubject(false)
          }
        >
          <form
            className="modal"
            onSubmit={addSubject}
            onMouseDown={e =>
              e.stopPropagation()
            }
          >
            <div className="modal-heading">
             <h2>
  {editingSubject ? "Edit Subject" : "Add New Subject"}
</h2>

              <button
                type="button"
                onClick={() =>
                  setShowAddSubject(false)
                }
              >
                <X />
              </button>
            </div>

            <label>
              Subject Name

              <input
                required
                value={newSubject.name}
                onChange={e =>
                  setNewSubject({
                    ...newSubject,
                    name: e.target.value
                  })
                }
                placeholder="e.g. Physics"
              />
            </label>

            <label>
              Badge Color

              <input
                type="color"
                value={newSubject.color}
                onChange={e =>
                  setNewSubject({
                    ...newSubject,
                    color: e.target.value
                  })
                }
                className="color-input"
              />
            </label>

            <button
  className="primary full"
  type="submit"
>
  {editingSubject ? "Save Changes" : "Create Subject"}
</button>
          </form>
        </div>
      )}
    </div>
  );
}



export default App;
