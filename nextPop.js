document.addEventListener("DOMContentLoaded", () => {
    const submitQuestionButton = document.getElementById("submitQuestion");
  
    async function getFlashcardsAndCreateDictionary(notes) {
      console.log("Received notes:", notes); // Debugging
      try {
        const response = await fetch("http://127.0.0.1:5000/generate_flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        });
  
        console.log("API response status:", response.status);
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Flashcards:", data.flashcards);
  
        if (!data.flashcards || !Array.isArray(data.flashcards)) {
          throw new Error("API response does not contain 'flashcards' in the expected format.");
        }
  
        return data.flashcards.map((flashcard) => ({
          question: flashcard.question,
          answer: flashcard.answer,
        }));
      } catch (error) {
        console.error("Error in getFlashcardsAndCreateDictionary:", error);
        throw error;
      }
    }
  
    async function askQuestion(questions) {
      let currentQuestionIndex = 0;
  
      while (currentQuestionIndex < questions.length) {
        const userAnswer = prompt(questions[currentQuestionIndex].question);
  
        if (userAnswer === null) {
          alert("Please answer the question to proceed.");
          return;
        }
  
        if (userAnswer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
            alert("Correct! Next question.");
          } else {
            // All questions answered correctly
            removeBlurEffect();
            alert("Congratulations! The blur has been removed.");
          }
        } else {
          alert("Incorrect! Try again.");
        }
      }
    }
  
    function applyBlurEffect() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
  
        const tabId = tabs[0].id;
  
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            document.body.style.filter = "blur(5px)"; // Apply blur to the background
          },
        });
      });
    }
  
    function removeBlurEffect() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
  
        const tabId = tabs[0].id;
  
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            document.body.style.filter = ""; // Remove blur effect
          },
        });
      });
    }
  
    // Apply blur effect as soon as the page is loaded
    applyBlurEffect();
  
    submitQuestionButton.addEventListener("click", async () => {
      const notes = document.getElementById("notesArea").value.trim();
      console.log("Notes from textarea:", notes);
  
      if (!notes) {
        alert("Please enter some notes.");
        return;
      }
  
      try {
        const questions = await getFlashcardsAndCreateDictionary(notes);
        console.log("Generated flashcards:", questions);
        askQuestion(questions);
      } catch (error) {
        console.error("Error generating flashcards:", error);
        alert("Failed to generate flashcards. Please try again.");
      }
    });
  });
  