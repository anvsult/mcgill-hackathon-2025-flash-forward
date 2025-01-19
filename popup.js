document.addEventListener("DOMContentLoaded", () => {
    const minutesInput = document.getElementById("minutesInput");
    const startTimerButton = document.getElementById("startTimerButton");
    const timerDisplay = document.getElementById("timerDisplay");
    const nextButton = document.getElementById("nextButton");
  
    // Check that all required elements exist
    if (!minutesInput || !startTimerButton || !timerDisplay || !nextButton) {
      console.error("One or more required elements are missing from the DOM.");
      return;
    }
  
    let timerInterval;
  
    startTimerButton.addEventListener("click", () => {
      const minutes = parseInt(minutesInput.value, 10);
  
      if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
      }
  
      // Save timer start time and duration
      const startTime = Date.now();
      const duration = minutes * 60 * 1000; // Convert minutes to milliseconds
      chrome.storage.sync.set({
        timerStartTime: startTime,
        timerDuration: duration,
      });
  
      // Start countdown
      startCountdown(duration, startTime);
    });  function startCountdown(duration, startTime) {
        clearInterval(timerInterval);
    
        const endTime = startTime + duration;
    
        timerInterval = setInterval(() => {
          const currentTime = Date.now();
        //   const remainingTime = endTime - currentTime;
        const remainingTime = 0
    
          if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's up!";
            applyBlurEffect(true);
            showNextButton();
          } else {
            const minutesLeft = Math.floor(remainingTime / 60000);
            const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
            timerDisplay.textContent = `Time remaining: ${minutesLeft}m ${secondsLeft}s`;
          }
        }, 1000);
      }
    
      function applyBlurEffect(enable) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) return;
    
          const tabId = tabs[0].id;
    
          chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            func: (enable) => {
              document.body.style.filter = enable ? "blur(5px)" : "";
            },
            args: [enable],
          });
        });
      }  function showNextButton() {
        nextButton.style.display = "block";
        nextButton.addEventListener("click", navigateToNextPage);
      }
    
      function navigateToNextPage() {
        // Clear everything
        clearInterval(timerInterval);
        chrome.storage.sync.remove(["timerStartTime", "timerDuration"]);
        minutesInput.value = "";
        timerDisplay.textContent = "";
        applyBlurEffect(false);
    
        // Navigate to a new page
        window.location.href = "next.html"; // Replace "next.html" with the desired page URL
      }
    
      // Restore and resume timer if previously set
      chrome.storage.sync.get(["timerStartTime", "timerDuration"], (result) => {
        const { timerStartTime, timerDuration } = result;
    
        if (timerStartTime && timerDuration) {
          const elapsedTime = Date.now() - timerStartTime;
          const remainingTime = timerDuration - elapsedTime;
    
          if (remainingTime > 0) {
            startCountdown(remainingTime, Date.now() - elapsedTime);
          } else {
            applyBlurEffect(true);
            timerDisplay.textContent = "Time's up!";
            showNextButton();
          }
        }
      });
    });