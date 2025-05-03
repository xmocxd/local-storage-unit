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


document.addEventListener('DOMContentLoaded', () => {
    let notes = [];
    let noteID = localStorage.getItem('noteID') || 0;
    const style = document.createElement('style');
    document.head.append(style);

    const colorInput = document.querySelector('#color-input');
    const colorForm = document.querySelector('#color-form');
    const noteInput = document.querySelector('#note-input');
    const noteForm = document.querySelector('#note-form');
    const noteContainer = document.querySelector('#note-container');
    const clearButton = document.querySelector('#clear-button');

    function handleEsc(e) {
        let p = e.target.parentElement.parentElement;

        if (e.key === 'Escape') {
            console.log('escaping', p);

            console.log(p.querySelectorAll('.hidden-html'));
            // restore old HTML of the note
            p.innerHTML = p.querySelector('.hidden-html').innerHTML;
            p.classList.remove('editing');
        }
    }

    function addNote(text = '', id = null) {
        const noteParent = document.createElement('div');
        const note = document.createElement('div');
        note.classList.add('note');
         // either use the noteID global counter (for new notes), or a passed id (when loading from localstorage)
        note.id = (id === null) ? 'note' + noteID : id;
        note.innerHTML = `ID: ${note.id}<br><br>${text}`;

        // add a div to show coords
        const coords = document.createElement('div');
        coords.classList.add('coords');
        note.appendChild(coords);

        // update note on click
        note.addEventListener('click', (e) => {
            console.log(e.target);
            // return if currently editing, or if click is from a child
            if (e.target.classList.contains('editing') || !e.target.classList.contains('note')) return;
            e.target.classList.add('editing');

            console.log('TRIGGER CLICK');

            // put the current html of the note into a hidden div
            const hiddenHTML = document.createElement('div');
            hiddenHTML.innerHTML = e.target.innerHTML;
            hiddenHTML.classList.add('hidden-html');

            e.target.innerHTML = '';

            const updateForm = document.createElement('form');
            updateForm.classList.add('update-form');
            updateForm.id = 'update-form' + e.target.id;
            updateForm.dataset.noteId = e.target.id;
            updateForm.dataset.noteIndex = e.target.dataset.index;

            const updateInput = document.createElement('input');
            updateInput.setAttribute('type', 'text');
            updateInput.classList.add('update');

            const updateButton = document.createElement('button');
            updateButton.setAttribute('type', 'submit');
            updateButton.innerText = 'Update';

            const cancelButton = document.createElement('button');
            cancelButton.setAttribute('type', 'button');
            cancelButton.innerText = 'Cancel';

            updateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const p = e.target.parentElement;
                const newText = e.target.querySelector('input').value
                const noteId = e.target.dataset.noteId;

                if (newText !== '') {
                    // update note text
                    document.querySelector('#' + noteId).innerHTML = `ID: ${noteId}<br><br>${newText}`;
                    // re-add coords
                    //const coords = document.createElement('div');
                    //coords.classList.add('coords');
                    note.appendChild(coords);
                    // update notes array
                    notes[e.target.dataset.noteIndex].text = newText;
                    // save notes array to localstorage
                    localStorage.setItem('notes', JSON.stringify(notes));
                } else {
                    // restore old HTML of the note
                    p.innerHTML = p.querySelector('.hidden-html').innerHTML;
                    p.classList.remove('editing');
                }

                // remove update form
                e.target.remove();
                p.classList.remove('editing');
            });

            cancelButton.addEventListener('click', (e) => {
                // restore old HTML of the note
                const p = e.target.parentElement.parentElement;
                p.innerHTML = p.querySelector('.hidden-html').innerHTML;
                p.classList.remove('editing');
            });

            // remove the form is esc pressed while focused
            updateInput.addEventListener('focus', (e) => {
                e.target.addEventListener('keydown', handleEsc);
            });

            updateInput.addEventListener('blur', (e) => {
                e.target.removeEventListener('keydown', handleEsc);
            });

            // add update form to note
            updateForm.appendChild(updateInput);
            updateForm.appendChild(updateButton);
            updateForm.appendChild(cancelButton);
            e.target.appendChild(updateForm);
            e.target.appendChild(hiddenHTML);
            updateInput.focus();
        });

        // remove note
        note.addEventListener('dblclick', (e) => {
            // return if click is from a child
            if (!e.target.classList.contains('note')) return;
            console.log('REMOVE ID/IDX', e.target.id, e.target.dataset.index);
            notes.splice(e.target.dataset.index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            e.target.remove();
        });

        // show note coords on hover
        note.addEventListener('mouseenter', (e) => {
            const rect = e.target.getBoundingClientRect();
            e.target.querySelector('.coords').innerHTML =
            `x: ${rect.left + window.scrollX}
            y: ${rect.top + window.scrollY}`;
        });
        note.addEventListener('mouseleave', (e) => {
            e.target.querySelector('.coords').innerHTML = '';
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

    function updateNote(text) {

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
    for (const note of loadNotes()) {
        // notes array is populated within addNotes
        addNote(note.text, note.id);
    }

    console.log(notes);

    // events

    clearButton.addEventListener('click', () => {
        clearAll();
        console.log('localStorage cleared');
    });

    colorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        setNoteColor(colorInput.value)
        colorInput.value = '';
    });

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (noteInput.value !== '') {
            addNote(noteInput.value);
            noteInput.value = '';
        }
    });
});