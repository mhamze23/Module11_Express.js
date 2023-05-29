// Function to prepare fetch options
const fetchOptions = (method, data) => ({
  method, // HTTP method
  headers: { 'Content-Type': 'application/json' }, // Headers
  body: JSON.stringify(data), // Data to send, if any, in JSON format
});

// Function to handle fetch requests
const fetchAPI = async (path, options = {}) => {
  const response = await fetch(path, options);
  return response.json(); // Return parsed JSON response
};

// Wrapper functions for API calls
const getNotes = () => fetchAPI('/api/notes');
const saveNote = note => fetchAPI('/api/notes', fetchOptions('POST', note));
const deleteNote = id => fetchAPI(`/api/notes/${id}`, fetchOptions('DELETE'));

// Functions to show or hide HTML elements
const show = (elem) => { elem.style.display = 'inline'; };
const hide = (elem) => { elem.style.display = 'none'; };

// Active note object
let activeNote = {};

// Function to render the active note in the note editor
const renderActiveNote = () => {
  hide(saveNoteBtn);

  // If the note is active, show it in the editor
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else { // If no note is active, clear the editor
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Function to handle note saving
const handleNoteSave = async () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  await saveNote(newNote);
  await getAndRenderNotes();
  renderActiveNote();
};

// Function to handle note deletion
const handleNoteDelete = async (e) => {
  e.stopPropagation();
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  await deleteNote(noteId);
  await getAndRenderNotes();
  renderActiveNote();
};

// Function to handle viewing of a note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle creating a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Function to handle rendering the save button
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Function to render a list of notes
const renderNoteList = async (notes) => {
  let jsonNotes = await notes;
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Function to create list item
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);
    liEl.append(spanEl);

    // Add delete button, if necessary
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);
      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  // Create list item for each note
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Function to get and render notes
const getAndRenderNotes = async () => renderNoteList(await getNotes());

// Function to initialize the notes page
const initializeNotesPage = () => {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  [noteTitle, noteText].forEach(element =>
    element.addEventListener('keyup', handleRenderSaveBtn)
  );
};

// Initialize the notes page if the current path is '/notes'
if (window.location.pathname === '/notes') {
  initializeNotesPage();
}

// Fetch and render notes
getAndRenderNotes();
