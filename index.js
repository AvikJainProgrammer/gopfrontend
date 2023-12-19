class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
      openChatbotPolicy: document.querySelector(".chatbox__policy"),
      policybtn: document.querySelector(".chatbox__policy--btn"),
      policyCrossIcon: document.querySelector(".chatbox__cross--icon"),
    };
    this.state = false;
    this.messages = [];
    this.firstTime = true;
    this.showPolicy = true;
  }
  display() {
    const { openButton, chatBox, sendButton } = this.args;
    openButton.addEventListener("click", () => this.toggleState(chatBox));
    sendButton.addEventListener("click", () => this.onSendButton(chatBox));
    const node = chatBox.querySelector("input");
    node.addEventListener("keydown", (event) => {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        this.onSendButton(chatBox);
        let messageBody = document.querySelector(".chatbox__messages");
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      }
    });
  }
  toggleState(chatbox) {
    console.log("togglestate");
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
    if (this.firstTime === true) {
      this.onFirstTimeChatbotOpen();
    }
  }

  onFirstTimeChatbotOpen() {
    const firstTimeMsg = [
      `<span style="color: red;">Disclaimer:</span><br />Auto-generated chat results for information purposes only. Do not enter any personal information. Chats may be monitored for improvement
      For more information read our <span class="chatbox__policy--btn">Chatbot Privacy Policy </span>`,
      `<span style="text-decoration: underline;">Sample question you can ask :</span>
      <div>
      <ul style="list-style-position: inside; padding-left: 15px; display: flex; flex-direction: column;">
        <li style="list-style: circle;"">ਜਨਮ ਸਰਟੀਫਿਕੇਟ ਵਿੱਚ ਸੁਧਾਰ ਲਈ ਕੀ ਫੀਸ ਹੈ?/What is the fee for correction in Birth Certificate?</li>
        <li style="list-style: circle;"">ਵਿਆਹ ਦੇ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦੇਣ ਲਈ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸੂਚੀ ਬਣਾਓ/List documents needed to apply for a marriage certificate</li>
        <li style="list-style: circle;"">ਵਿਆਹ ਸੇਵਾ ਲਈ ਰਜਿਸਟਰੇਸ਼ਨ ਫੀਸ ਕੀ ਹੈ?/What is the registration fee for marriage service?</li>
        <li style="list-style: circle;"">ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਸੇਵਾ ਲਈ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ/How to apply for old age pension service</li>
      </ul>
      </div>`,
    ];

    firstTimeMsg.forEach((msg) =>
      this.messages.push({ name: "Sam", message: msg })
    );
    this.updateChatText(this.args.chatBox);
    this.firstTime = false;
    this.args.policybtn = document.querySelector(".chatbox__policy--btn");
    this.args.policybtn.addEventListener("click", () =>
      this.togglePolicy(this.args.openChatbotPolicy)
    );
    this.args.policyCrossIcon.addEventListener("click", () =>
      this.togglePolicy(this.args.openChatbotPolicy)
    );
    console.log(this.args.openChatbotPolicy);
  }
  togglePolicy(openChatbotPolicy) {
    console.log("togglePolicy");
    console.log(openChatbotPolicy);
    if (this.showPolicy) {
      openChatbotPolicy.classList.add("chatbox__policy--active");
    } else {
      openChatbotPolicy.classList.remove("chatbox__policy--active");
    }
    this.showPolicy = !this.showPolicy;
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }
    let msg1 = { name: "User", message: text1 };
    // this time we got user input
    //            console.log(msg1);
    //            const userInputTime = new Date();
    this.messages.push(msg1);
    this.messages.push({
      name: "loading",
      message: `<span class="chatbox__loading">Loading</span>`,
    });
    this.updateChatText(chatbox);
    textField.value = "";
    fetch("https://azdogrecogbackend.azurewebsites.net/get_response", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Sam", message: r.assistant_content };
        this.messages.pop();
        this.messages.push(msg2);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatbox) {
    let html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          const urlRegex = /(?:https:\/\/)[\S][^)]+/g;
          let message = item.message;
          message = message.replace(urlRegex, (url) => {
            return (
              '<a href="' +
              url +
              '" target="_blank">' +
              "Link" +
              "</a>"
            );
          });
          const docRegex = /\[d.*\]/g;
          // console.log(message);
          message = message.replace(docRegex, "");
          message = message.replace(/Link<\/a>$/g, "<br/>Document Link</a>");
          // console.log(message);
          html +=
            '<div class="messages__item messages__item--visitor"><p class="chatbox__messages_content">' +
            message +
            "</p></div>";
        } else if (item.name === "User") {
          html +=
            '<div class="messages__item messages__item--operator"><p class="chatbox__messages_content font__white">' +
            item.message +
            "</p></div>";
        } else {
          html +=
            '<div class="messages__item messages__item--visitor"><p class="chatbox__messages_content">' +
            item.message +
            "</p></div>";
        }
      });
    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
    let messageBody = document.querySelector(".chatbox__messages");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
}

const chatbox = new Chatbox();
chatbox.display();
