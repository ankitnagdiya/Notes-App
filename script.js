const savedTheme = localStorage.getItem("theme");
if(savedTheme === "dark"){
    document.body.classList.add("dark");
};

let notesData = JSON.parse(localStorage.getItem("notes")) || [
    { title:"My favorite book", content:"Write something..."},
    { title:"Art Work", content:"Your ideas..."},
    { title:"Live like a pro", content:"Motivation..."} 
];

notesData = notesData.map(note => ({
    ...note,
    isDeleted: note.isDeleted || false
}));
const noteList = document.getElementById("note_list");
const titleInput = document.getElementById("note-title");
// const notes = document.querySelectorAll("#note_list > div"); 
const editor = document.getElementById("editor");
const newNoteBtn = document.getElementById("new_note_btn");
const searchInput = document.getElementById("searchbar");
const toggleBtn = document.getElementById("dark_mode");
const menuBtn = document.getElementById("menuBtn");
const countEl = document.querySelector(".count");
const trashBtn = document.getElementById("trashBtn");
const allNotesBtn = document.getElementById("allNotesBtn"); 

newNoteBtn.addEventListener("click",()=>{
    //create new note
    const newNote = {
        title:"New Note",
        content : "",
        isDeleted : false  
    };
    //added to data
    notesData.push(newNote);
    updateCount();
    //save data
    saveNotes();
    //render UI
    renderNotes();
    // set it active last index
    activeIndex = notesData.length - 1;
    //clear editor
    editor.innerText = ""; 
    titleInput.value = "New Note";
    renderByView();     
});

let activeIndex = -1;
let currentView = "all";

//saveNotes
function saveNotes(){
    localStorage.setItem("notes",JSON.stringify(notesData));
}

function renderNotes(data = notesData){
    noteList.innerHTML = ""; // clear old UI;
    
    data.forEach((note) =>{
        const div = document.createElement("div");
        
        const title = document.createElement("span");
        title.innerText = note.title || "untitled";

         const originalIndex = notesData.indexOf(note);

           // deleteBtn     
        const deleteBtn = document.createElement("span");
        deleteBtn.innerText = "🗑️";

        deleteBtn.addEventListener("click",(e)=>{
              e.stopPropagation();

            notesData[originalIndex].isDeleted = true;
              saveNotes();
              renderByView();
              updateCount();    
        });
        div.appendChild(title);

         // view Based buttons
        if(currentView === "all"){
            div.appendChild(deleteBtn);
        }
        if(currentView === "trash"){
          //restore note
        const restoreBtn = document.createElement("span");
        restoreBtn.innerText = "♻️";    
        
        restoreBtn.addEventListener("click",(e)=>{
            e.stopPropagation(); 
            
            notesData[originalIndex].isDeleted = false;

            saveNotes();
            renderByView();
            updateCount();
        });
         // delete foreever Btn
        const deleteForeverBtn = document.createElement("span");
        deleteForeverBtn.innerText = "❌";

        deleteForeverBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        notesData.splice(originalIndex, 1);

        saveNotes();
        renderByView();
        updateCount();
        });    
        div.appendChild(restoreBtn);
        div.appendChild(deleteForeverBtn);   
        }

        //click event
        div.addEventListener('click',()=>{
            //remove active class
            document.querySelectorAll("#note_list > div") 
            .forEach(n => n.classList.remove("active"));
            //add active
            div.classList.add("active");
            //set active index
            activeIndex = originalIndex;
            //load content
            editor.innerText = note.content;
            //edit-title
            //load title when note is clicked
            titleInput.value = note.title;
        });
        noteList.appendChild(div);
    });
}
// render by view
function renderByView(){
    if(currentView === "all"){
        const activeNotes = notesData.filter(n => !n.isDeleted);
        renderNotes(activeNotes);
    }else{
        const trashedNotes = notesData.filter(n => n.isDeleted);
        renderNotes(trashedNotes);
    }
}
//update content while typing - editor
editor.addEventListener("input",()=>{
    if(activeIndex !== -1){
        notesData[activeIndex].content = editor.innerText;
    }
    //save after change
    saveNotes();
})

//update title when typing
titleInput.addEventListener("input",()=>{
    if(activeIndex !== -1){
        notesData[activeIndex].title = titleInput.value;
    saveNotes();
    renderNotes();
    };
})

// search logic
searchInput.addEventListener("input",()=>{
    const query = searchInput.value.toLowerCase();

    const filtered = notesData.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
    renderNotes(filtered);
})

//toggle theme
toggleBtn.addEventListener("click",()=>{
    console.log(document.body.classList);
    document.body.classList.toggle("dark");

    //save theme
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }else{
        localStorage.setItem("theme","light");
    }
})

//menuBtn
menuBtn.addEventListener("click",()=>{
    document.body.classList.toggle("show-sidebar");
});
document.addEventListener("click",(e)=>{
    if(
        document.body.classList.contains("show-sidebar") &&
        !document.getElementById("sidebar1").contains(e.target) &&
        e.target !==menuBtn
    ){
        document.body.classList.remove("show-sidebar");
    }
});

//count
function updateCount(){
    const activeNotes = notesData.filter(n => !n.isDeleted);
    countEl.innerText = activeNotes.length; 
}

//trash 
trashBtn.addEventListener("click",()=>{
    currentView = "trash";
    renderByView(); 
});
// all note
if(allNotesBtn){
    allNotesBtn.addEventListener("click", () => {
    currentView = "all";
    renderByView();
});
}
renderNotes();
updateCount();