const addNote = document.querySelector('#addNote');
const contentBox = document.querySelector('#content');

// maintaining UI for the display 
class UI {
    static displayUI() {
        const notes = noteStore.getNotes();
        notes.forEach(note => UI.addToUI(note));
    }

    /*
        takes note from the textarea and insert it into a bootstrap card,
        here in the buttonm every time when 'view more' is clicked same static modal is called, just the text viewed is changes using the onclick() -> modalView(para)

        modalView(para) : para -> textarea value
        just adds the textarea ot the static modal
    */
    static addToUI(note) {
        const noteText = note;
        const visibleText = noteText.substring(0, 50);
        let newEle = document.createElement('div');


        newEle.innerHTML =
            `
        <div class="card">
            <div class="card-body">
                <span class="modalSpan"><button type="button" class="btn btn-sm btn-secondary delete">X</button></span>
                <p class="card-text">${visibleText} .... </p>
                <p class="fullText" style="display:none">${note}</p>
                <button type="button" class="btn btn-primary viewModal">
                    View more
                </button>
            </div>
        </div>
        `;

        // adding class styles
        let modalClasses = ['col-sm-6']
        newEle.classList = modalClasses;
        newEle.style.display = 'inline-block';
        newEle.style.padding = '10px';

        contentBox.append(newEle);
        document.querySelector('#note').value = "";
    }
}

// localstorage
class noteStore {
    static getNotes() {
        let noteArr;
        if (localStorage.getItem('notes') === null) {
            noteArr = [];
        } else {
            noteArr = JSON.parse(localStorage.getItem('notes'));
        }
        return noteArr;
    }

    static addNote(note) {
        let notes = noteStore.getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static removeNote(note) {
        const notes = noteStore.getNotes();
        notes.forEach((e, index) => {
            if (note === e) {
                notes.splice(index, 1);
            }
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

// loas's the UI from the ocalstorage, everytime
window.addEventListener('DOMContentLoaded', UI.displayUI());

// add's note's to the UI & the localstorage
addNote.addEventListener('click', (e) => {
    const noteText = document.querySelector('#note').value;
    UI.addToUI(noteText);
    noteStore.addNote(noteText);
});

// deleting the note, from the UI, and the localstorage
contentBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        let all = document.querySelectorAll('.card');
        let curr = e.target.parentElement.parentElement.parentElement;

        let childIndex = -1;
        all.forEach((e, index) => {
            if (e === curr) {
                childIndex = index;
            }
        });

        console.log(childIndex);
        const cont = document.querySelectorAll('.fullText');
        const textCnt = cont[childIndex].textContent;
        console.log(cont);

        if (childIndex > -1) {
            all[childIndex].remove();
            noteStore.removeNote(textCnt);
        }
    }
});

// to view the full text in modal view
const textModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
});

contentBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('viewModal')) {
        const note = e.target.previousElementSibling.textContent;
        document.getElementById('modalTextContent').textContent = note;
        textModal.show();
    }
});