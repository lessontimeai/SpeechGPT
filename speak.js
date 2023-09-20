function addMicrophoneIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.style.position = "fixed";
  svg.style.bottom = "10px";
  svg.style.left = "10px";
  svg.innerHTML = '<path d="M12 2c2.76 0 5 2.24 5 5v7c0 2.76-2.24 5-5 5s-5-2.24-5-5v-7c0-2.76 2.24-5 5-5zM19 10v-1a7 7 0 00-14 0v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>';

  svg.addEventListener("click", startSpeechRecognition);

  document.body.appendChild(svg);
}

function startSpeechRecognition() {
  const recognition = new webkitSpeechRecognition() || SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    const result = event.results[0][0].transcript;
    const textarea = document.getElementById("prompt-textarea");

    // Append the recognized text to the textarea
    textarea.value += result + ' ';

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

    // Trigger an input event to ensure the textarea content is updated
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    textarea.dispatchEvent(inputEvent);
  };

  recognition.onerror = function (event) {
    alert("Speech recognition error: " + event.error);
  };

  recognition.start();

  // Listen for changes in the container's children
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

addMicrophoneIcon();
