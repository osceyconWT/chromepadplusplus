// elements
const noteArea = document.getElementById('note-area');
const newBtn = document.getElementById('new');
const saveBtn = document.getElementById('save');
const openFileBtn = document.getElementById('open-file');
const fileInput = document.getElementById('file-input');

let currentFileName = null; // pre-store the current file name as null

// new file function - clears the text area and resets the filename
newBtn.addEventListener('click', () => {
  noteArea.value = '';
  currentFileName = null; // reset file name
});

// save function - saves written file to disk.
saveBtn.addEventListener('click', () => {
  const noteContent = noteArea.value;
  const blob = new Blob([noteContent], { type: 'text/plain' });

  if (currentFileName) {
    // save to opened file
    const url = URL.createObjectURL(blob);

    // yay! my favorite! api grabs!
    chrome.downloads.download({
      url: url,
      filename: currentFileName, // use current file name
      conflictAction: 'overwrite' // overwrite?
    }, function(downloadId) {
      console.log('Download initiated with ID:', downloadId);
    });

    // clean up call
    URL.revokeObjectURL(url);
  } else {
    // prompt for filename if there's no current file
    let filename = prompt('Enter a filename to save:', 'my_note.txt');

    if (filename) {
      currentFileName = filename; // store file's name
      const url = URL.createObjectURL(blob);

      // yay! my favorite! api grabs!
      chrome.downloads.download({
        url: url,
        filename: currentFileName, // use current file name as save file name in order to overwrite if necessary
        conflictAction: 'overwrite' // overwrite?
      }, function(downloadId) {
        console.log('Download initiated with ID:', downloadId);
      });

      // clean up call
      URL.revokeObjectURL(url);
    } else {
      alert('Save canceled.');
    }
  }
});

// open file function
openFileBtn.addEventListener('click', () => {
  fileInput.click();
});

// load the selected file into chromepad++
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      noteArea.value = e.target.result;
      currentFileName = file.name; // store opened file's name
    };
    
    reader.onerror = function() {
      alert('Error reading file!');
    };

    // read the file -> notepad
    reader.readAsText(file);
  }
});
