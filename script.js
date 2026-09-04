const screens=[...document.querySelectorAll(".screen")];
const cat=document.getElementById("cat");
const noBtn=document.getElementById("noBtn");
const arena=document.getElementById("choiceArena");
const catComment=document.getElementById("catComment");
const pawBurst=document.getElementById("pawBurst");
const selectedDatePreview=document.getElementById("selectedDatePreview");
const finalDate=document.getElementById("finalDate");
const whatsappBtn = document.getElementById("whatsappBtn");

let noAttempts=0;
let selectedDate="";

function showScreen(name){
  screens.forEach(s=>s.classList.toggle("screen--active",s.dataset.screen===name));
  setCatMood(name);
  window.scrollTo({top:0,behavior:"smooth"});
}

function setCatMood(name){
  cat.classList.remove("cat--sleepy","cat--awake","cat--happy","cat--mischief","cat--coffee");
  if(name==="intro") cat.classList.add("cat--sleepy");
  else if(name==="question") cat.classList.add("cat--awake");
  else if(name==="date"||name==="final") cat.classList.add("cat--happy");
  else if(name==="place") cat.classList.add("cat--awake","cat--coffee");
  else cat.classList.add("cat--awake");
}

function runHappyAnimation(){
  cat.classList.remove("cat--happy"); void cat.offsetWidth; cat.classList.add("cat--happy");
  pawBurst.classList.remove("is-active"); void pawBurst.offsetWidth; pawBurst.classList.add("is-active");
}

function runMischiefAnimation(){
  cat.classList.remove("cat--mischief"); void cat.offsetWidth; cat.classList.add("cat--awake","cat--mischief");
}

function moveNoButton(){
  const a=arena.getBoundingClientRect(), b=noBtn.getBoundingClientRect(), pad=8;
  const maxX=Math.max(pad,a.width-b.width-pad), maxY=Math.max(pad,a.height-b.height-pad);
  const x=Math.random()*(maxX-pad)+pad, y=Math.random()*(maxY-pad)+pad;
  noBtn.classList.add("is-floating");
  noBtn.style.left=`${x}px`; noBtn.style.top=`${y}px`;
}

function resetNoButton(){
  noBtn.classList.remove("is-floating"); noBtn.removeAttribute("style");
  noAttempts=0; catComment.textContent="";
}

function handleNoAttempt(){
  noAttempts++;
  if(noAttempts===1){
    catComment.textContent="El gato intervino.";
    runMischiefAnimation(); moveNoButton(); return;
  }
  if(noAttempts===2){
    catComment.textContent="Ok, ok… ahora sí prometo dejarte elegir 😼";
    runMischiefAnimation(); moveNoButton(); return;
  }
  showScreen("decline");
}

function updateWhatsappLink() {
  const phoneNumber = "5213787080031";

  let message = "";

  if (selectedDate === "Otro día") {
    message =
      "Sí quiero salir contigo 🐾\n" +
      "Pero me funciona mejor otro día. Lo vemos por aquí ☕";
  } else {
    message =
      "Acepto la invitación 🐾\n" +
      `${selectedDate} en Gonda ☕`;
  }

  whatsappBtn.href =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("click",e=>{
  const action=e.target.closest("[data-action]")?.dataset.action;
  const dateChoice=e.target.closest("[data-date]")?.dataset.date;

  if(dateChoice){
    selectedDate=dateChoice;
    selectedDatePreview.textContent=dateChoice==="Otro día"
      ?"Elegimos juntos otro día que te venga mejor."
      :`Tentativamente: ${dateChoice}.`;
    showScreen("place"); return;
  }

  if(!action) return;
  if(action==="start") showScreen("question");
  else if(action==="yes"){runHappyAnimation();setTimeout(()=>showScreen("date"),450);}
  else if(action==="no") handleNoAttempt();
  else if(action==="confirm-place"){
    finalDate.textContent=selectedDate==="Otro día"?"Fecha por elegir juntos":selectedDate||"Fecha por confirmar";

    updateWhatsappLink();

    runHappyAnimation(); setTimeout(()=>showScreen("final"),350);
  }
  else if(action==="restart"){selectedDate="";resetNoButton();showScreen("intro");}
});

window.addEventListener("resize",()=>{if(noBtn.classList.contains("is-floating")) moveNoButton();});
showScreen("intro");
