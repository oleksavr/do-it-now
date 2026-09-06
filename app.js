<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>do it now</title>
<meta name="description" content="A gentle local anti-procrastination app for starting tasks, focusing, and tracking progress.">

<style>
:root{--bg:#f5f4ef;--ink:#21333d;--muted:#718087;--line:#dce3df;--green:#68a487;--mint:#dceee4;--coral:#ed765d;--dark:#223b48}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px system-ui,sans-serif}
.wrap{max-width:1050px;margin:auto;padding:22px 16px 40px}.top{display:flex;justify-content:space-between;margin-bottom:22px}
.brand{font-weight:800;font-size:20px}.private{color:var(--muted);font-size:12px}
.hero{padding:45px 35px;border-radius:26px;color:white;background:var(--dark)}
h1,h2,h3,p{margin-top:0}h1{font:clamp(45px,8vw,82px) Georgia,serif;line-height:1;margin-bottom:12px}
.hero p{color:#c7d4d1;font-size:18px}.entry{display:flex;gap:10px;margin-top:35px}.entry input{flex:1}
input,select{min-height:48px;padding:0 14px;border:1px solid var(--line);border-radius:11px;font:inherit}
.entry input{background:#ffffff1c;border-color:#ffffff44;color:white}.entry input::placeholder{color:#c8d3d2}
button{border:0;border-radius:10px;padding:11px 15px;font-weight:700;cursor:pointer}
.primary{background:var(--coral);color:white}.secondary{background:white;border:1px solid var(--line);color:var(--ink)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px}.chip{border:1px solid #ffffff44;background:transparent;color:white;font-size:12px}
.stats,.grid,.bottom{display:grid;gap:12px}.stats{grid-template-columns:repeat(3,1fr);margin:12px 0}
.stat,.panel{background:white;border:1px solid var(--line);border-radius:18px;padding:22px}.stat strong{display:block;font:34px Georgia,serif}.label{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.grid{grid-template-columns:1.45fr .85fr}.side{display:grid;gap:12px}.bottom{grid-template-columns:1fr 1fr;margin-top:12px}
h2{font-size:21px;margin-bottom:0}.heading{display:flex;justify-content:space-between;align-items:start}
.tasklist{display:grid;gap:9px;margin-top:23px}.task{display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid var(--line);border-radius:13px}
.task.doing{background:#fff8f5;border-color:#efb2a3}.task.done{opacity:.58}.task.done .title{text-decoration:line-through}
.check{width:24px;height:24px;padding:0;border:2px solid #b5c4bd;border-radius:50%;background:white;color:white}.check.on{background:var(--green);border-color:var(--green)}
.title{font-weight:700}.meta{color:var(--muted);font-size:11px;margin-top:4px}.actions{display:flex;gap:5px}.actions button{padding:7px;font-size:11px}
.empty{text-align:center;padding:70px 20px;color:var(--muted)}.empty h3{color:var(--ink)}
.timer{text-align:center;font:62px Georgia,serif;margin:25px 0 15px}.presets{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:#eef3ef;padding:4px;border-radius:10px}.presets button{padding:8px 3px;background:transparent;color:var(--muted);font-size:11px}.presets button.selected{background:white;color:var(--ink)}
.actions-wide{display:flex;gap:8px;margin-top:14px}.actions-wide>*{flex:1}.hint{color:var(--muted);font-size:12px;line-height:1.5;margin-top:14px}
.progress{height:10px;background:#eaf0ec;border-radius:20px;overflow:hidden;margin:25px 0 10px}.bar{height:100%;width:0;background:var(--green);transition:.3s}.progressmeta{display:flex;justify-content:space-between;color:var(--muted);font-size:12px}
.prompt{background:#f1f8f3;border-radius:12px;padding:17px;margin:22px 0 12px;font:18px Georgia,serif;line-height:1.35}.small{font-size:12px;color:var(--muted)}
.toast{position:fixed;right:18px;bottom:18px;background:#21333d;color:white;border-radius:11px;padding:13px 17px;display:none;max-width:350px}.toast.show{display:block}
footer{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;padding-top:22px}
@media(max-width:760px){.grid,.bottom,.stats{grid-template-columns:1fr}.entry{display:grid}.hero{padding:32px 22px}.task{grid-template-columns:28px 1fr}.actions{grid-column:2}.private{display:none}}
</style>
</head>

<body>
<div class="wrap">
<header class="top"><div class="brand">↗ do it now</div><div class="private">● stays on this device</div></header>

<section class="hero">
<div class="label" style="color:#a5c9b9">A gentler way to begin</div>
<h1>Make the next move.</h1>
<p>You do not need the whole plan. Just the next visible action.</p>

<form class="entry" id="form">
<input id="input" maxlength="120" placeholder="What needs a next move?">
<button class="primary">Add task ↗</button>
</form>

<div class="chips">
<button class="chip" data-start="Do one minute">Do one minute</button>
<button class="chip" data-start="Send the first message">Send the first message</button>
<button class="chip" data-start="Clear one small surface">Clear one small surface</button>
</div>
</section>

<section class="stats">
<div class="stat"><div class="label">Finished today</div><strong id="finished">0</strong><span id="caption">Start with one small win.</span></div>
<div class="stat"><div class="label">Momentum</div><strong id="streak">0 days</strong><span>A chain, not a judgment.</span></div>
<div class="stat"><div class="label">Focus sessions</div><strong id="sessions">0</strong><span>Every finished session counts.</span></div>
</section>

<section class="grid">
<section class="panel">
<div class="heading"><div><div class="label">Today</div><h2>Your next moves</h2></div><button class="secondary" id="clear">Clear completed</button></div>
<div class="tasklist" id="tasks"></div>
<div class="empty" id="empty"><h3>Nothing is asking for your attention yet.</h3><p>Add one concrete task above.</p></div>
</section>

<aside class="side">
<section class="panel">
<div class="heading"><div><div class="label">Gentle focus</div><h2>A little time is enough.</h2></div>◷</div>
<div class="timer" id="timer">25:00</div>
<div class="presets">
<button data-min="5">5 min</button><button data-min="15">15 min</button><button class="selected" data-min="25">25 min</button><button data-min="45">45 min</button>
</div>
<div class="actions-wide"><button class="primary" id="startTimer">Start session</button><button class="secondary" id="resetTimer">Reset</button></div>
<p class="hint">A finished session is a win—even if the task is not finished yet.</p>
</section>

<section class="panel">
<div class="label">Gentle interruption</div><h2>Interrupt the drift.</h2>
<p class="hint">Nudge me every</p>
<select id="reminder">
<option value="0">Off</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option>
</select>
<div class="actions-wide"><button class="secondary" id="notifications">Enable browser nudges</button></div>
<p class="hint" id="reminderText">In-app reminders work while this tab is open.</p>
</section>
</aside>
</section>

<section class="bottom">
<section class="panel">
<div class="heading"><div><div class="label">Small evidence</div><h2>Today is already moving.</h2></div><strong id="percent">0%</strong></div>
<div class="progress"><div class="bar" id="bar"></div></div>
<div class="progressmeta"><span id="progressText">One move changes the shape of the day.</span><span id="total">0 tasks</span></div>
</section>

<section class="panel">
<div class="label">When the task feels too large</div><h2>Shrink the doorway.</h2>
<div class="prompt" id="prompt">Open the thing you need, and stop there if that is all you have today.</div>
<button class="secondary" style="width:100%" id="next">Give me a smaller move</button>
</section>
</section>

<footer><span>No account. No feed. No guilt spiral.</span><button class="secondary" id="reset">Reset local data</button></footer>
</div>

<div class="toast" id="toast"></div>

<script>
const KEY="do-it-now-v1";
const moves=[
"Open the thing you need, and stop there if that is all you have today.",
"Write the rough first sentence. It does not need to be good yet.",
"Put one item where it belongs. Let the next item wait.",
"Make the first small choice, then pause if you need to.",
"Set a one-minute timer and touch only the first visible piece.",
"Send the essential line. You can make it prettier later."
];

let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
 tasks:[],finished:{},sessions:{},activity:[],reminder:0
};
let active=null,moveIndex=0,timerSeconds=1500,timerLength=25,timerLoop=null,reminderLoop=null;

const $=x=>document.querySelector(x);
const today=()=>{let d=new Date();return d.toISOString().slice(0,10)};
const esc=x=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function note(text){$("#toast").textContent=text;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),3500)}
function activity(){if(!state.activity.includes(today()))state.activity.push(today())}
function time(x){return String(x).padStart(2,"0")}
function showTimer(){$("#timer").textContent=time(Math.floor(timerSeconds/60))+":"+time(timerSeconds%60)}
function getTask(){return state.tasks.find(t=>t.id===active&&t.status!="done")||state.tasks.find(t=>t.status=="doing")||state.tasks.find(t=>t.status!="done")}

function streak(){
 let n=0,d=new Date();
 if(!state.activity.includes(today()))d.setDate(d.getDate()-1);
 while(state.activity.includes(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}
 return n;
}

function render(){
 const list=$("#tasks");
 let tasks=[...state.tasks].sort((a,b)=>(a.status=="done")-(b.status=="done")||new Date(b.created)-new Date(a.created));
 $("#empty").style.display=tasks.length?"none":"block";
 list.innerHTML=tasks.map(t=>`
 <article class="task ${t.status=="doing"?"doing":""} ${t.status=="done"?"done":""}">
 <button class="check ${t.status=="done"?"on":""}" data-action="toggle" data-id="${t.id}">${t.status=="done"?"✓":""}</button>
 <div><div class="title">${esc(t.text)}</div><div class="meta">${t.status=="doing"?"In motion":t.status=="done"?"Done":"Ready"}</div></div>
 <div class="actions">
 ${t.status!="done"?`<button class="secondary" data-action="start" data-id="${t.id}">${t.status=="doing"?"Keep going":"Start"}</button><button class="secondary" data-action="move" data-id="${t.id}">Next move</button>`:`<button class="secondary" data-action="undo" data-id="${t.id}">Undo</button>`}
 <button class="secondary" data-action="delete" data-id="${t.id}">×</button>
 </div></article>`).join("");

 let day=today(),done=state.finished[day]||0;
 let activeToday=state.tasks.filter(t=>t.status!="done"&&t.created.slice(0,10)==day).length;
 let visibleDone=state.tasks.filter(t=>t.status=="done"&&t.doneAt&&t.doneAt.slice(0,10)==day).length;
 let total=Math.max(done,activeToday+visibleDone),pct=total?Math.round(done/total*100):0;
 $("#finished").textContent=done;
 $("#caption").textContent=done?"Small progress is still progress.":"Start with one small win.";
 $("#streak").textContent=streak()+" "+(streak()==1?"day":"days");
 $("#sessions").textContent=state.sessions[day]||0;
 $("#percent").textContent=pct+"%";$("#bar").style.width=pct+"%";
 $("#total").textContent=total+" "+(total==1?"task":"tasks");
 $("#progressText").textContent=pct==100?"The day moved. You moved it.":"One move changes the shape of the day.";
}

$("#form").addEventListener("submit",e=>{
 e.preventDefault();let text=$("#input").value.trim();
 if(!text)return note("Give the next move a small name.");
 let t={id:Date.now().toString(),text,status:"todo",created:new Date().toISOString(),doneAt:null};
 state.tasks.unshift(t);active=t.id;save();render();$("#input").value="";$("#prompt").textContent=moves[0];note("Added. Start with one visible piece.");
});

document.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>{$("#input").value=b.dataset.start;$("#input").focus()});

$("#tasks").addEventListener("click",e=>{
 let b=e.target.closest("[data-action]");if(!b)return;
 let t=state.tasks.find(x=>x.id==b.dataset.id);if(!t)return;
 let a=b.dataset.action;
 if(a=="toggle"&&!t.doneAt){
   t.status="done";t.doneAt=new Date().toISOString();let d=t.doneAt.slice(0,10);
   state.finished[d]=(state.finished[d]||0)+1;activity();save();render();note("Nice. One move completed.");
 }
 else if(a=="undo"){
   let d=t.doneAt.slice(0,10);state.finished[d]=Math.max(0,(state.finished[d]||1)-1);
   t.status="todo";t.doneAt=null;save();render();note("Back on the list. No guilt.");
 }
 else if(a=="start"){
   state.tasks.forEach(x=>{if(x.status=="doing")x.status="todo"});t.status="doing";active=t.id;save();render();note("Start with the first visible action.");
 }
 else if(a=="move"){
   active=t.id;$("#prompt").textContent=moves[moveIndex++%moves.length];note("Here is a smaller doorway into it.");
 }
 else if(a=="delete"){state.tasks=state.tasks.filter(x=>x.id!=t.id);save();render();note("Task removed.");}
});

$("#clear").onclick=()=>{
 let n=state.tasks.filter(t=>t.status=="done").length;
 if(!n)return note("There are no completed tasks to clear.");
 state.tasks=state.tasks.filter(t=>t.status!="done");save();render();note("Completed tasks cleared. Progress stays counted.");
};

document.querySelectorAll("[data-min]").forEach(b=>b.onclick=()=>{
 timerLength=+b.dataset.min;timerSeconds=timerLength*60;showTimer();
 document.querySelectorAll("[data-min]").forEach(x=>x.classList.toggle("selected",x==b));
});

$("#startTimer").onclick=()=>{
 if(timerLoop){clearInterval(timerLoop);timerLoop=null;$("#startTimer").textContent="Start session";return}
 if(timerSeconds<=0)timerSeconds=timerLength*60;
 $("#startTimer").textContent="Pause session";
 timerLoop=setInterval(()=>{
   timerSeconds--;showTimer();
   if(timerSeconds<=0){
     clearInterval(timerLoop);timerLoop=null;$("#startTimer").textContent="Start session";
     let d=today();state.sessions[d]=(state.sessions[d]||0)+1;activity();save();render();note("Session complete. That counts as a win.");
   }
 },1000);
};

$("#resetTimer").onclick=()=>{clearInterval(timerLoop);timerLoop=null;timerSeconds=timerLength*60;$("#startTimer").textContent="Start session";showTimer()};

function scheduleReminder(){
 clearInterval(reminderLoop);
 if(state.reminder)reminderLoop=setInterval(()=>{
   let t=getTask(),body=t?moves[moveIndex++%moves.length]:"Choose one tiny action, then begin.";
   note(t?"Touch the next move: "+t.text+" — "+body:"Interrupt the drift: "+body);
   if("Notification"in window&&Notification.permission=="granted")new Notification("do it now",{body});
 },state.reminder*60000);
}

$("#reminder").value=state.reminder;
$("#reminder").onchange=()=>{
 state.reminder=+$("#reminder").value;save();scheduleReminder();
 $("#reminderText").textContent=state.reminder?"In-app reminders repeat every "+state.reminder+" minutes while this tab is open.":"Reminders are off.";
};

$("#notifications").onclick=async()=>{
 if(!("Notification"in window))return note("Browser nudges are unavailable here.");
 let p=await Notification.requestPermission();note(p=="granted"?"Browser nudges enabled.":"In-app reminders still work.");
};

$("#next").onclick=()=>$("#prompt").textContent=moves[moveIndex++%moves.length];

$("#reset").onclick=()=>{
 if(confirm("Reset all local tasks and progress?")){localStorage.removeItem(KEY);location.reload()}
};

render();showTimer();scheduleReminder();
</script>
</body>
</html>