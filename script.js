// ---------- Data ----------
var events=[
  {id:1,title:"CodeSprint 2026",cat:"Technical",date:"2026-11-05",venue:"Lab 1",seats:40},
  {id:2,title:"Web Design Workshop",cat:"Workshop",date:"2026-11-08",venue:"Seminar Hall",seats:30},
  {id:3,title:"Annual Cultural Fest",cat:"Cultural",date:"2026-11-14",venue:"Auditorium",seats:150},
  {id:4,title:"Inter-Dept Throwball",cat:"Sports",date:"2026-11-18",venue:"Ground",seats:24},
  {id:5,title:"AI & Cloud Seminar",cat:"Technical",date:"2026-11-22",venue:"Smart Room",seats:60},
  {id:6,title:"Dance & Music Night",cat:"Cultural",date:"2026-11-28",venue:"Open Stage",seats:100}
];
var registrations=[], current=null;
try{var s=localStorage.getItem("ce_regs");if(s)registrations=JSON.parse(s)}catch(e){}
function save(){try{localStorage.setItem("ce_regs",JSON.stringify(registrations))}catch(e){}}
function $(id){return document.getElementById(id)}
function taken(id){return registrations.filter(function(r){return r.eventId===id}).length}
function fmt(d){return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}

// ---------- Render ----------
function renderEvents(){
  var q=$("search").value.toLowerCase(),c=$("cat").value,box=$("events");box.innerHTML="";
  var list=events.filter(function(e){return (c==="All"||e.cat===c)&&e.title.toLowerCase().indexOf(q)>-1});
  if(!list.length){box.textContent="No events found.";return}
  list.forEach(function(e){
    var left=e.seats-taken(e.id),card=document.createElement("div");card.className="card";
    card.innerHTML='<span class="tag">'+e.cat+'</span><h3>'+e.title+'</h3>'+
      '<div class="meta">📅 '+fmt(e.date)+'<br>📍 '+e.venue+'</div>'+
      '<div class="seats">'+(left>0?left+' seats left':'Full')+'</div>';
    var b=document.createElement("button");b.textContent=left>0?"Register":"Sold out";b.disabled=left<=0;
    b.onclick=function(){openForm(e)};card.appendChild(b);box.appendChild(card);
  });
}
function renderRegs(){
  var box=$("regs");box.innerHTML="";
  if(!registrations.length){box.innerHTML='<div class="meta">No registrations yet.</div>';return}
  registrations.forEach(function(r){
    var d=document.createElement("div");d.className="reg";
    d.innerHTML='<span><b>'+r.eventTitle+'</b><br>'+r.name+' · '+r.regno+'</span><span>'+r.code+'</span>';
    var x=document.createElement("button");x.className="ghost";x.style.marginTop="0";x.textContent="Cancel";
    x.onclick=function(){registrations=registrations.filter(function(z){return z.code!==r.code});save();renderAll()};
    d.appendChild(x);box.appendChild(d);
  });
}
function renderAll(){renderEvents();renderRegs()}

// ---------- Form ----------
function openForm(e){
  current=e;$("mTitle").textContent="Register: "+e.title;
  ["name","regno","email","phone"].forEach(function(i){$(i).value=""});
  ["eName","eReg","eMail","ePhone"].forEach(function(i){$(i).textContent=""});
  $("formView").style.display="block";$("doneView").style.display="none";$("overlay").classList.add("show");
}
function closeForm(){$("overlay").classList.remove("show")}
function validate(){
  var ok=true,n=$("name").value.trim(),r=$("regno").value.trim(),m=$("email").value.trim(),p=$("phone").value.trim();
  $("eName").textContent=n.length<3?(ok=false,"Enter your full name"):"";
  $("eReg").textContent=!/^[A-Za-z0-9]{6,15}$/.test(r)?(ok=false,"6–15 letters/digits"):"";
  $("eMail").textContent=!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)?(ok=false,"Enter a valid email"):"";
  $("ePhone").textContent=!/^[6-9]\d{9}$/.test(p)?(ok=false,"Enter a valid 10-digit mobile number"):"";
  if(ok&&registrations.some(function(x){return x.eventId===current.id&&x.regno.toLowerCase()===r.toLowerCase()})){
    $("eReg").textContent="Already registered for this event";ok=false}
  return ok;
}
$("submit").onclick=function(){
  if(!validate())return;
  var code="CE"+current.id+"-"+Math.floor(1000+Math.random()*9000);
  registrations.push({eventId:current.id,eventTitle:current.title,name:$("name").value.trim(),regno:$("regno").value.trim(),email:$("email").value.trim(),dept:$("dept").value,phone:$("phone").value.trim(),code:code});
  save();renderAll();
  $("doneMsg").textContent="Your ticket ID is "+code+". See you at "+current.title+"!";
  $("formView").style.display="none";$("doneView").style.display="block";
  var t=$("toast");t.textContent="✅ Registration Successful for "+current.title+"!";t.classList.add("show");
  setTimeout(function(){t.classList.remove("show")},3500);
};
$("cancel").onclick=closeForm;$("close").onclick=closeForm;
$("search").oninput=renderEvents;$("cat").onchange=renderEvents;
renderAll();