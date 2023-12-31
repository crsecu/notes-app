import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import {nanoid} from "nanoid";

export default function App() {

    const [notes, setNotes] = React.useState( () => JSON.parse(localStorage.getItem("notes")) || []);
    console.log(notes);
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    React.useEffect(() => {
      const notesToString = JSON.stringify(notes);
      localStorage.setItem("notes", notesToString)
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
      //Rearrange the most recently-modified note at the top
        setNotes(oldNotes => {
          const reorderedNotes = [];
          for (let i = 0; i < oldNotes.length; i++) {
            const note = oldNotes[i];
            if(note.id === currentNoteId){
              reorderedNotes.unshift({...note, body: text});
            } else {
              reorderedNotes.push(note);
            }
          }

          return reorderedNotes;
        })
    }

    function deleteNote(event, noteId) {
      event.stopPropagation()
      setNotes(prevNotes => prevNotes.filter(prevNotes => prevNotes.id !== noteId));
  }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
