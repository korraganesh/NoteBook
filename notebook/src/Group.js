import React, { useState, useEffect, useRef } from "react";
import vector from "./img/Vector.png";
import "./style.css";

function Group() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [activeNote, setActiveNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [displayedContents, setDisplayedContents] = useState([]);
  const [selectedNoteGroup, setSelectedNoteGroup] = useState(null);
  const [selectedColor, setSelectedColor] = useState("blue");  

  const colorOptions = [
    "#B38BFA",
    "#FF79F2",
    "#43E6FC",
    "#F19576",
    "#0047FF",
    "#6691FF",
  ];
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const ppRef = useRef(null);
  const cntRef = useRef(null);

  useEffect(() => {
    if (cntRef.current) {
      cntRef.current.scrollTop = cntRef.current.scrollHeight;
    }
  }, [displayedContents]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ppRef.current && !ppRef.current.contains(event.target)) {
        setShowNoteInput(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (activeNote !== null) {
      setDisplayedContents(notes[activeNote]?.contents || []);
    }
  }, [activeNote, notes]);

  const showNoteInputForm = (e) => {
    e.stopPropagation();
    setShowNoteInput(true);
  };

  const generateRandomLogo = (groupName) => {
    const initials = groupName.substr(0, 2).toUpperCase();
    return initials;
  };

  const createNote = () => {
    if (noteName.trim() === "") {
      alert("Please enter a note name.");
      return;
    }

    const newNote = {
      name: noteName,
      contents: [],
      createdAt: "",
    };

    newNote.logo = generateRandomLogo(noteName);
    newNote.backgroundColor = selectedColor;

    setNotes([...notes, newNote]);
    setNoteName("");
    setShowNoteInput(false);
  };

  const selectNote = (index) => {
    setSelectedNoteGroup(index);
    setActiveNote(index);
    setNoteContent("");
    setDisplayedContents(notes[index]?.contents || []);
    // Set the group name and logo in the state
    const selectedNote = notes[index];
    setNoteName(selectedNote.name);
    setSelectedColor(selectedNote.backgroundColor);

    const noteButtons = document.querySelectorAll(".btncreatednote");
    noteButtons.forEach((button, i) => {
      if (i === index) {
        button.classList.add("selected-note");
      } else {
        button.classList.remove("selected-note");
      }
    });
  };

  const saveNoteContent = () => {
    if (activeNote !== null) {
      const updatedNotes = [...notes];
      const currentContent = noteContent;
      const createdAt = new Date().toLocaleString();
      updatedNotes[activeNote].contents.push({
        content: currentContent,
        createdAt,
      });
      updatedNotes[activeNote].createdAt = createdAt;
      setNotes(updatedNotes);
      setNoteContent("");
      setDisplayedContents([...updatedNotes[activeNote].contents]);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };
 const handleclickback = ()=>{
  window.location.reload()
 }
  return (
    <>
      <div className="main">
        <div className="group">
          <h2 className="pn">Pocket Notes</h2>
          <button className="btnAddnotes" onClick={showNoteInputForm}>
            <p>+ Create Notes group</p>
          </button>
          <div>
            {showNoteInput && (
              <div ref={ppRef} className="pp">
                <p className="ppdivtext" id="mobile">
                  Create New Notes group
                </p>
                <span className="ppdivtext">Group Name </span>
                <input
                  className="inp"
                  type="text"
                  placeholder="Enter Your note group name...."
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                />

                <div className="color-options">
                  <span className="ppdivtext">Choose color</span>
                  {colorOptions.map((color, index) => (
                    <div
                      key={index}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {selectedColor === color}
                    </div>
                  ))}
                </div>
                <button className="btncn" onClick={createNote}>
                  Create Note
                </button>
              </div>
            )}
          </div>

          {notes.map((note, index) => (
            <div key={index}>
              <button
                className={`btncreatednote ${
                  index === selectedNoteGroup ? "selected-note" : ""
                }`}
                onClick={() => selectNote(index)}
              >
                <div
                  className="logo"
                  style={{ backgroundColor: note.backgroundColor }}
                >
                  {note.logo}
                </div>
                {""}
                <span className="notename">{note.name}</span>
              </button>
            </div>
          ))}
        </div>
        <div
          className={`text ${
            selectedNoteGroup !== null ? "selected" : "default"
          }`}
        >
          {activeNote !== null ? (
            <div className="txtarea">
              <div className="Displaylognamemain">
                <button className="btnback" onClick={handleclickback}></button>
                <div className="selected-note-info">
                  <div className="logo" style={{ backgroundColor: selectedColor }}>
                    {generateRandomLogo(noteName)}
                  </div>
                  <h3 className="selected-group-name">{noteName}</h3>
                </div>
                </div>
                <textarea
                  className="txt"
                  placeholder="Enter your text here......"
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                  }}
                />
                <button className="bntsave" onClick={saveNoteContent}>
                  <img src={vector} alt="Save" />
                </button>
              </div>
          ) : (
            <div className="default-text">
              <h1>Pocket Notes</h1>
              <p>
                Send and receive messages without keeping your phone online. <br />
                Use Pocket Notes on up to 4 linked devices and 1 mobile phone
              </p>
            </div>
          )}
          {activeNote !== null && (
            <div className="cnt" ref={cntRef}>
              {displayedContents.map((content, i) => (
                <div className="cntf" key={i}>
                  <p className="time"> {content.createdAt}</p>
                  <div className="content">{content.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Group;
