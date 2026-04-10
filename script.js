/**
 * Remote Ruler - Minimalist Corporate Logic
 * Copyright (c) 2025 Remote Ruler.
 */

 // --------------------------------------------------
 // Content Protection (No Right-Click / No Select)
 // --------------------------------------------------
 document.addEventListener('contextmenu', event => event.preventDefault());
 
 document.addEventListener('keydown', function (event) {
     if (event.ctrlKey && (event.key === 'u' || event.key === 'U' || event.key === 'c' || event.key === 'C')) {
         event.preventDefault();
     }
 });
 
 // --------------------------------------------------
 // Random Quote Logic (Smooth fade transition)
 // --------------------------------------------------
 function displayRandomQuote() {
     const quoteContainer = document.getElementById('quoteContainer');
     if (!quoteContainer || typeof quoteLibrary === 'undefined') return;
 
     let seenIndices = JSON.parse(localStorage.getItem('seenQuotes') || '[]');
 
     // Reset if all quotes viewed
     if (seenIndices.length >= quoteLibrary.length) {
         seenIndices = [];
     }
 
     const availableIndices = [];
     for (let i = 0; i < quoteLibrary.length; i++) {
         if (!seenIndices.includes(i)) {
             availableIndices.push(i);
         }
     }
 
     const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
     const quote = quoteLibrary[randomIndex];
     
     // Animation: Fade out, update, fade in
     quoteContainer.classList.add('quote-fade-out');
     
     setTimeout(() => {
        // Output the quote directly without double quotes for a cleaner look
        quoteContainer.innerHTML = `
            <span class="quote-text"><a href="https://remoteruler.github.io/FahiJawz-Collection" target="_blank" class="rgb-text-anim" style="text-decoration: none;">FahiJawz Collection</a></span><br>
            <span class="bold-text" style="font-size: 0.7em; line-height: 1.3;">${quote}</span>
        `;
        
        quoteContainer.classList.remove('quote-fade-out');
        quoteContainer.classList.add('quote-fade-in');
        
        seenIndices.push(randomIndex);
        localStorage.setItem('seenQuotes', JSON.stringify(seenIndices));
     }, 400); // Wait for the fade-out CSS transition
 }
 
 // Initial load
 displayRandomQuote();
 
 // --------------------------------------------------
 // Search Logic
 // --------------------------------------------------
 document.getElementById('searchForm').addEventListener('submit', function (e) {
     e.preventDefault();
     const query = document.getElementById('searchInput').value; // Get the user's search text
     if (query) {
         // Forward to duckduckgo for privacy
         const params = new URLSearchParams({
             q: query,
             kp: '-2', kl: 'us-en', kav: '1'
         });
         window.open('https://duckduckgo.com/?' + params.toString(), '_self'); 
         // Optional: Changed to '_self' so it searches in the same tab for a native feel,
         // but if you prefer opening a new tab just change it back to '_blank'.
     }
 });
