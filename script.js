/*
- The user should be able to set a color for boxes (this affects both current boxes and new boxes).  -- DONE
- The user should be able to add boxes with the set color to the div with the ID `box-container`: -- DONE
    - When the button with the ID `new-box-button` is clicked. -- DONE
    - When the `N` key is pressed. -- DONE
- The user should be able to remove a box when the box is double-clicked on. -- DONE
- Each box should display its ID. -- DONE
- Each box should display its page coordinates when hovered (when the mouse leaves, it displays its ID back). -- DONE
- Each box should have a class `box` for styling and selecting. -- DONE

v2
- The boxes from the events exercise become notes, and the only difference in terms of features is the user should
be able to update a note.

- The notes, color, and ID counter should be saved to local storage and read from the local storage when the page
opens. -- DONE

- If a note gets deleted, it should also be removed from the local storage. -- DONE
- If a note gets updated, it should also be reflected in the local storage.

*/


// Remove data from local storage
localStorage.removeItem('key');


document.addEventListener('DOMContentLoaded', () => {
    let noteID = localStorage.getItem('noteID') || 0;
    const style = document.createElement('style');
    document.head.append(style);

    const colorInput = document.querySelector('#color-input');
    const colorForm = document.querySelector('#color-form');
    const noteInput = document.querySelector('#note-input');
    const noteForm = document.querySelector('#note-form');
    const noteContainer = document.querySelector('#note-container');
    const clearButton = document.querySelector('#clear-button');

    function addNote(text = '', id = null) {
        const note = document.createElement('div');
        note.classList.add('note');
         // either use the noteID global counter (for new notes), or a passed id (when loading from localstorage)
        note.id = (id === null) ? 'note' + noteID : 'note' + id;
        note.innerHTML = `ID: ${note.id}<br><br>${text}`;

        // remove note
        note.addEventListener('dblclick', (e) => {
            notes.splice(e.target.dataset.index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            e.target.remove();
        });

        // show note coords on hover
        note.addEventListener('mouseover', (e) => {
            const rect = e.target.getBoundingClientRect();
            e.target.innerHTML =
            `x: ${rect.left + window.scrollX}
            y: ${rect.top + window.scrollY}`;
        });

        note.addEventListener('mouseout', (e) => {
            note.innerHTML = `ID: ${note.id}<br><br>${text}`;
        });

        // add note to the array of notes
        notes.push({'id': note.id, 'text': text});
        // set a data attribute with the index so we can splice it out of the array later
        note.dataset.index = notes.length - 1;
        // store
        localStorage.setItem('notes', JSON.stringify(notes));

        noteContainer.appendChild(note);
        noteID++;
        localStorage.setItem('noteID', noteID);
    }

    function loadNotes() {
        const s = localStorage.getItem('notes') || '[]';
        return JSON.parse(s);
    }

    function setNoteColor(color) {
        style.textContent = `.note { background-color: ${ color }}`;
        localStorage.setItem('noteColor', color);
    }

    function clearAll() {
        notes = [];
        noteID = 0;
        setNoteColor('none');
        
        document.querySelectorAll('.note').forEach(e => e.remove());

        localStorage.clear();
    }

    // on page load get stuff from localStorage

    const noteColor = localStorage.getItem('noteColor');
    if (noteColor) setNoteColor(noteColor);
    const notes = loadNotes();
    for (const note of notes) {
        addNote(note.text, note.id);
    }

    // events

    clearButton.addEventListener('click', () => {
        clearAll();
    });

    colorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setNoteColor(colorInput.value)
    });

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNote(noteInput.value);
    });
});