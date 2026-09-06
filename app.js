const KEY = "do-it-now-v1";

const moves = [
  "Open the thing you need, and stop there if that is all you have today.",
  "Write the rough first sentence. It does not need to be good yet.",
  "Put one item where it belongs. Let the next item wait.",
  "Make the first small choice, then pause if you need to.",
  "Set a one-minute timer and touch only the first visible piece.",
  "Send the essential line. You can make it prettier later."
];

let state = JSON.parse(localStorage.getItem(KEY) || "null") || {
  tasks: [],
  finished: {},
  sessions: {},
  activity: [],
  reminder: 0
};

let active = null;
let moveIndex = 0;
let timerSeconds = 1500;
let timerLength = 25;
let timerLoop = null;
let reminderLoop = null;

const $ = selector => document.querySelector(selector);

function today(){
  const date = new Date();
  return date.toISOString().slice(0,10);
}

function save(){
  localStorage.setItem(KEY, JSON.stringify(state));
}

function note(text){
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function activity(){
  if(!state.activity.includes(today())){
    state.activity.push(today());
  }
}

function time(value){
  return String(value).padStart(2,"0");
}

function showTimer(){
  $("#timer").textContent =
    time(Math.floor(timerSeconds / 60)) + ":" + time(timerSeconds % 60);
}

function getTask(){
  return state.tasks.find(task =>
    task.id === active && task.status !== "done"
  ) || state.tasks.find(task =>
    task.status === "doing"
  ) || state.tasks.find(task =>
    task.status !== "done"
  );
}

function streak(){
  let count = 0;
  const date = new Date();

  if(!state.activity.includes(today())){
    date.setDate(date.getDate() - 1);
  }

  while(state.activity.includes(date.toISOString().slice(0,10))){
    count++;
    date.setDate(date.getDate() - 1);
  }

  return count;
}

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[character]));
}

function render(){
  const list = $("#tasks");

  const tasks = [...state.tasks].sort((a,b) =>
    (a.status === "done") - (b.status === "done") ||
    new Date(b.created) - new Date(a.created)
  );

  $("#empty").style.display = tasks.length ? "none" : "block";

  list.innerHTML = tasks.map(task => `
    <article class="task
      ${task.status === "doing" ? "doing" : ""}
      ${task.status === "done" ? "done" : ""}">

      <button
        class="check ${task.status === "done" ? "on" : ""}"
        data-action="toggle"
        data-id="${task.id}">
        ${task.status === "done" ? "✓" : ""}
      </button>

      <div>
        <div class="title">${escapeHTML(task.text)}</div>
        <div class="meta">
          ${
            task.status === "doing"
              ? "In motion"
              : task.status === "done"
                ? "Done"
                : "Ready"
          }
        </div>
      </div>

      <div class="actions">
        ${
          task.status !== "done"
            ? `
              <button class="secondary" data-action="start" data-id="${task.id}">
                ${task.status === "doing" ? "Keep going" : "Start"}
              </button>
              <button class="secondary" data-action="move" data-id="${task.id}">
                Next move
              </button>
            `
            : `
              <button class="secondary" data-action="undo" data-id="${task.id}">
                Undo
              </button>
            `
        }

        <button class="secondary" data-action="delete" data-id="${task.id}">
          ×
        </button>
      </div>
    </article>
  `).join("");

  const day = today();
  const finished = state.finished[day] || 0;

  const activeToday = state.tasks.filter(task =>
    task.status !== "done" &&
    task.created.slice(0,10) === day
  ).length;

  const visibleDone = state.tasks.filter(task =>
    task.status === "done" &&
    task.doneAt &&
    task.doneAt.slice(0,10) === day
  ).length;

  const total = Math.max(finished, activeToday + visibleDone);
  const percent = total ? Math.round(finished / total * 100) : 0;

  $("#finished").textContent = finished;
  $("#caption").textContent = finished
    ? "Small progress is still progress."
    : "Start with one small win.";

  const currentStreak = streak();
  $("#streak").textContent =
    currentStreak + " " + (currentStreak === 1 ? "day" : "days");

  $("#sessions").textContent = state.sessions[day] || 0;
  $("#percent").textContent = percent + "%";
  $("#bar").style.width = percent + "%";
  $("#total").textContent = total + " " + (total === 1 ? "task" : "tasks");

  $("#progressText").textContent = percent === 100
    ? "The day moved. You moved it."
    : "One move changes the shape of the day.";
}

$("#form").addEventListener("submit", event => {
  event.preventDefault();

  const text = $("#input").value.trim();

  if(!text){
    note("Give the next move a small name.");
    return;
  }

  const task = {
    id: Date.now().toString(),
    text,
    status: "todo",
    created: new Date().toISOString(),
    doneAt: null
  };

  state.tasks.unshift(task);
  active = task.id;

  save();
  render();

  $("#input").value = "";
  $("#prompt").textContent = moves[0];

  note("Added. Start with one visible piece.");
});

document.querySelectorAll("[data-start]").forEach(button => {
  button.onclick = () => {
    $("#input").value = button.dataset.start;
    $("#input").focus();
  };
});

$("#tasks").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if(!button) return;

  const task = state.tasks.find(item =>
    item.id === button.dataset.id
  );

  if(!task) return;

  const action = button.dataset.action;

  if(action === "toggle" && !task.doneAt){
    task.status = "done";
    task.doneAt = new Date().toISOString();

    const day = task.doneAt.slice(0,10);
    state.finished[day] = (state.finished[day] || 0) + 1;

    activity();
    save();
    render();

    note("Nice. One move completed.");
  }

  else if(action === "undo"){
    const day = task.doneAt.slice(0,10);

    state.finished[day] = Math.max(
      0,
      (state.finished[day] || 1) - 1
    );

    task.status = "todo";
    task.doneAt = null;

    save();
    render();

    note("Back on the list. No guilt.");
  }

  else if(action === "start"){
    state.tasks.forEach(item => {
      if(item.status === "doing"){
        item.status = "todo";
      }
    });

    task.status = "doing";
    active = task.id;

    save();
    render();

    note("Start with the first visible action.");
  }

  else if(action === "move"){
    active = task.id;
    $("#prompt").textContent =
      moves[moveIndex++ % moves.length];

    note("Here is a smaller doorway into it.");
  }

  else if(action === "delete"){
    state.tasks = state.tasks.filter(item =>
      item.id !== task.id
    );

    save();
    render();

    note("Task removed.");
  }
});

$("#clear").onclick = () => {
  const count = state.tasks.filter(task =>
    task.status === "done"
  ).length;

  if(!count){
    note("There are no completed tasks to clear.");
    return;
  }

  state.tasks = state.tasks.filter(task =>
    task.status !== "done"
  );

  save();
  render();

  note("Completed tasks cleared. Progress stays counted.");
};

document.querySelectorAll("[data-min]").forEach(button => {
  button.onclick = () => {
    timerLength = Number(button.dataset.min);
    timerSeconds = timerLength * 60;

    showTimer();

    document.querySelectorAll("[data-min]").forEach(item => {
      item.classList.toggle("selected", item === button);
    });
  };
});

$("#startTimer").onclick = () => {
  if(timerLoop){
    clearInterval(timerLoop);
    timerLoop = null;
    $("#startTimer").textContent = "Start session";
    return;
  }

  if(timerSeconds <= 0){
    timerSeconds = timerLength * 60;
  }

  $("#startTimer").textContent = "Pause session";

  timerLoop = setInterval(() => {
    timerSeconds--;
    showTimer();

    if(timerSeconds <= 0){
      clearInterval(timerLoop);
      timerLoop = null;

      $("#startTimer").textContent = "Start session";

      const day = today();
      state.sessions[day] = (state.sessions[day] || 0) + 1;

      activity();
      save();
      render();

      note("Session complete. That counts as a win.");
    }
  },1000);
};

$("#resetTimer").onclick = () => {
  clearInterval(timerLoop);
  timerLoop = null;
  timerSeconds = timerLength * 60;
  $("#startTimer").textContent = "Start session";
  showTimer();
};

function scheduleReminder(){
  clearInterval(reminderLoop);

  if(state.reminder){
    reminderLoop = setInterval(() => {
      const task = getTask();

      const body = task
        ? moves[moveIndex++ % moves.length]
        : "Choose one tiny action, then begin.";

      note(
        task
          ? "Touch the next move: " + task.text + " — " + body
          : "Interrupt the drift: " + body
      );

      if(
        "Notification" in window &&
        Notification.permission === "granted"
      ){
        new Notification("do it now", {body});
      }
    }, state.reminder * 60000);
  }
}

$("#reminder").value = state.reminder;

$("#reminder").onchange = () => {
  state.reminder = Number($("#reminder").value);

  save();
  scheduleReminder();

  $("#reminderText").textContent = state.reminder
    ? "In-app reminders repeat every " +
      state.reminder +
      " minutes while this tab is open."
    : "Reminders are off.";
};

$("#notifications").onclick = async () => {
  if(!("Notification" in window)){
    note("Browser nudges are unavailable here.");
    return;
  }

  const permission = await Notification.requestPermission();

  note(
    permission === "granted"
      ? "Browser nudges enabled."
      : "In-app reminders still work."
  );
};

$("#next").onclick = () => {
  $("#prompt").textContent =
    moves[moveIndex++ % moves.length];
};

$("#reset").onclick = () => {
  if(confirm("Reset all local tasks and progress?")){
    localStorage.removeItem(KEY);
    location.reload();
  }
};

render();
showTimer();
scheduleReminder();