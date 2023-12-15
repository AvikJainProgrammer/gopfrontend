// contentScript.js
// Fetch and inject the HTML
fetch(chrome.runtime.getURL('index.html'))
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);

    // Set image sources dynamically
    document.querySelector('.lady').src = chrome.runtime.getURL('images/lady.png');
    document.querySelector('.gop').src = chrome.runtime.getURL('images/GoP.png');
    document.querySelector('.gptlogo').src = chrome.runtime.getURL('images/chatgptlogo.png');
    document.querySelector('.chatbox__button img').src = chrome.runtime.getURL('images/chatbot-icon.png');
    document.querySelector('.chatbox__cross--icon').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/512px-Flat_cross_icon.svg.png';
    
    // Inject CSS
    const style = document.createElement('link');
    style.href = chrome.runtime.getURL('style.css');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);

    // Inject JavaScript
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('index.js');
    document.body.appendChild(script);
  })
  .catch(err => console.error(err));
