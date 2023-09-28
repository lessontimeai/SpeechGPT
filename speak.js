// Function to add the microphone icon to the document
function addMicrophoneIcon() {
  // Create a container div for the icon and background
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "10px";
  container.style.right = "10px";
  container.style.background = "#ffffff"; // Background color
  container.style.padding = "10px"; // Padding for the icon
  container.style.borderRadius = "50%"; // Make it round
  container.style.cursor = "pointer"; // Change cursor to pointer
  container.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"; // Add a shadow
  
  // Create the microphone icon SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.innerHTML = '<path d="M12 2c2.76 0 5 2.24 5 5v7c0 2.76-2.24 5-5 5s-5-2.24-5-5v-7c0-2.76 2.24-5 5-5zM19 10v-1a7 7 0 00-14 0v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>';
  
  // Add a click event listener to start speech recognition
  container.addEventListener("click", startSpeechRecognition);
  
  // Append the SVG to the container
  container.appendChild(svg);
  
  // Append the container to the document body
  document.body.appendChild(container);
}

// Function to start speech recognition
function startSpeechRecognition() {
  // Initialize speech recognition
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  
  recognition.onresult = function (event) {
    // Get the recognized text
    const result = event.results[0][0].transcript;
    const textarea = document.getElementById("prompt-textarea");
    
    // Append the recognized text to the textarea followed by a new line
    textarea.value += result + '\n';
    
    // Focus on the textarea
    textarea.focus();
    
    // Send a space key press event
    const spaceKeyEvent = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      bubbles: true,
    });
    textarea.dispatchEvent(spaceKeyEvent);

    // Send a enter key press event
    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
    });
    textarea.dispatchEvent(spaceKeyEvent);
    
    
    // Trigger an input event to ensure the textarea content is updated
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(inputEvent);
  };
  
  recognition.onerror = function (event) {
    // Handle speech recognition errors
    alert("Speech recognition error: " + event.error);
  };
  
  recognition.start();
  
  // Observe changes in the container's children
  const container = document.querySelector('.flex.flex-col');
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      // Extract and speak the text content of the container
      const textContent = container.textContent.trim();
      if (textContent !== "") {
        speakText(textContent);
      }
    });
  });
  
  // Configure the observer to listen for child list changes
  const observerConfig = {
    childList: true,
  };
  observer.observe(container, observerConfig);
}

// Function to speak text using the Web Speech API
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

// Add the microphone icon when the document is loaded
addMicrophoneIcon();
