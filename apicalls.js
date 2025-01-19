export default function getFlashcardsAndCreateDictionary() {
    //  notes = "capital of france = paris"
    // try {
    //   const response = await fetch('http://127.0.0.1:5000/generate_flashcards', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ notes })
    //   });
  
    //   console.log("API response status:", response.status);
  
    //   if (!response.ok) {
    //     throw new Error(`API request failed with status ${response.status}`);
    //   }
  
    //   const data = await response.json();
    //   console.log(data["flashcards"]);
  
    //   if (!data.flashcards || !Array.isArray(data.flashcards)) {
    //     throw new Error("API response does not contain 'flashcards' in the expected format.");
    //   }
  
    //   // Create the dictionary
    //   const flashcardDictionary = data.flashcards.map(flashcard => ({
    //     question: flashcard.question,
    //     answer: flashcard.answer,
    //   }));
  
    //   return flashcardDictionary;
      return [
        {
          question: "What is 5 + 3?",
          answer: "8",
        },
        {
          question: "What is the capital of France?",
          answer: "Paris",
        },
        {
          question: "What color is the sky on a clear day?",
          answer: "blue",
        },
      ];
    // } catch (error) {
    //   console.error("Error in getFlashcardsAndCreateDictionary:", error);
    //   throw error; // Propagate the error to the caller
    // }
  }
  
  