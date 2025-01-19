// Function to toggle blurring
function toggleBlurring(isEnabled) {
    if (isEnabled) {
      // Enable blurring
      if (!document.getElementById("learning-overlay")) {
        document.body.style.pointerEvents = "none"; // Disable interactions with the page
  
        // Create and display the overlay
        const overlay = document.createElement("div");
        overlay.id = "learning-overlay";
        overlay.innerHTML = `
          <h1>Time's up! Let's learn something new!</h1>
          <button id="learn-button">Start Learning</button>
        `;
        document.body.appendChild(overlay);
  
        // Add event listener to the button
        document.getElementById("learn-button").addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "open_learning_popup" });
  
          // Clean up blur and overlay
          document.body.style.filter = "";
          document.body.style.pointerEvents = "";
          overlay.remove();
        });
      }
    } else {
      // Disable blurring
      document.body.style.filter = "";
      document.body.style.pointerEvents = "";
      const overlay = document.getElementById("learning-overlay");
      if (overlay) overlay.remove();
    }
  }
  
  // Retrieve the blur toggle state from storage
  chrome.storage.sync.get(["blurEnabled"], (data) => {
    const blurEnabled = data.blurEnabled !== undefined ? data.blurEnabled : true; // Default to true
    toggleBlurring(blurEnabled);
  });
  
  // Listen for changes to the blur toggle
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blurEnabled) {
      toggleBlurring(changes.blurEnabled.newValue);
    }
  });
  