document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultContainer = document.getElementById("result")

  const handleFetch = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if(response.ok) {
        return await response.json();
      }else {
        throw new Error("Not found")
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play();
  }

  const renderData = (data) => {
    console.log("🚀 ~ renderData ~ data:", data)
    let html = "";

    html = `
      <div class="word-header">
        <h2>${data.word}</h2>
          ${data.phonetics.some(p => p.audio) ? `<button class="audio-button" onclick=(playAudio("${data.phonetics.find(p => p.audio).audio}"))>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                  <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
              </svg>
          </button>` : ''}
        </div>
        <p class="phonetic">${data.phonetics.find(p => p.text).text}</p>
    `

    data.meanings.forEach(m => {
      html += `
        <div class="meaning-section">
          <p class="part-of-speech">${m.partOfSpeech}</p>
            <div class="definition">
              ${m.definitions.map(d => (
                `
                  <p>• ${d.definition}</p>
                  <p class="example">${d.example ? `"${d.example}"`: ""}</p>
                `
              )).join("")}
            </div>
        </div>
      `
    })

    resultContainer.innerHTML = html;
  }

  const handleSearch = async () => {
    const word = searchInput.value.trim().toLowerCase();

    if(!word) return;

    try {
      resultContainer.innerHTML = `<div class="text-center"><div class="spinner-border" role="status"></div></div>`;
      const data = await handleFetch(word);
      renderData(data[0])
    } catch (error) {
      console.log("something hapened")
      console.log("Hubo un error", error);
      resultContainer.innerHTML = `
        <div class="error-message">
            <p>Sorry, we couldn't find <strong>${word}</strong></p>
            <p>Please try another search</p>
        </div>
      `
    }
  }

  searchInput.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
      handleSearch();
    }
  });

  searchBtn.addEventListener("click", handleSearch);

  window.playAudio = playAudio;
})