const startBtn = document.getElementById("start");
const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

startBtn.addEventListener("click", () => {
  recognition.lang = fromLang.value + "-US";
  recognition.start();
});

recognition.onresult = async (event) => {
  const spoken = event.results[0][0].transcript;
  originalText.textContent = spoken;

  const translated = await translateText(spoken, fromLang.value, toLang.value);
  translatedText.textContent = translated;

  speakText(translated, toLang.value);
};

recognition.onerror = (event) => {
  alert('Speech recognition error: ' + event.error);
};

async function translateText(text, from, to) {
  const proxy = "https://corsproxy.io/?";
  const api = "https://translate.argosopentech.com/translate";

  try {
    const res = await fetch(proxy + api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: "text"
      })
    });

    if (!res.ok) {
      throw new Error("Translation failed with status: " + res.status);
    }

    const data = await res.json();
    return data.translatedText || "No translation returned.";
  } catch (err) {
    console.error("Translation error:", err);
    alert("Translation failed: " + err.message);
    return "[Translation error]";
  }
}

function speakText(text, langCode) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  speechSynthesis.speak(utter);
}