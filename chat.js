document.addEventListener("DOMContentLoaded", function () {
    const socket = io();
    let onlineUsers, currentUser;

    // UI Elements
    const currentUserElement = document.getElementById("currentUser");
    const userListElement = document.getElementById("userList");
    const recipientSelect = document.getElementById("recipient");
    const messageInput = document.getElementById("message");
    const messagesList = document.getElementById("messages");
    const sendButton = document.getElementById("sendButton");
    const divMessages = document.getElementById("divMessages");

    // Event: Update user list
    socket.on("updateUserList", (users) => {
        onlineUsers = users.filter((x) => x.id != currentUser.id);
        updateUIUserList();
    });

    // Event: Private message received
    socket.on("privateMessage", (data) => {
        appendMessage(data);
    });

    socket.on("duplicateUserName", (data) => {
        const userName = prompt(data);
        currentUser = { id: generateRandomAlphanumeric(8), UserName: userName };
        socket.emit("joinChat", currentUser);
        currentUserElement.innerHTML = 'I am ' + currentUser.UserName;
    });

    // Function to send a private message
    sendButton.addEventListener("click", sendMessage);

    function sendMessage() {
        const recipient = recipientSelect.value;
        const message = messageInput.value;

        if (recipient && message) {
            socket.emit("newMessage", {
                sender: currentUser.UserName,
                recipient,
                message,
            });
            messageInput.value = "";
            appendMessage({ sender: "Me", message: message, recipient: recipient }, recipientSelect.options[recipientSelect.selectedIndex].text);
        }
    }

    function appendMessage(data, recipientName) {       
        const recipient = data.sender == 'Me' ? recipientName : data.sender;
        const divMessage = getElementOrCreate('divMessage_' + recipient, true);

        let h3Title = divMessage.querySelector('h3');
        if (!h3Title) {
            // If the div doesn't contain a UL, create it and append it to the div
            h3Title = document.createElement('h3');
            h3Title.innerHTML = recipient;
            divMessage.appendChild(h3Title);
        }

        let ulElement = divMessage.querySelector('ul');

        if (!ulElement) {
            // If the div doesn't contain a UL, create it and append it to the div
            ulElement = document.createElement('ul');
            divMessage.appendChild(ulElement);
        }

        const li = document.createElement("li");
        li.innerHTML = `<strong>${data.sender}:</strong> ${data.message}`;
        ulElement.appendChild(li);
    }

    // Initial setup
    const userName = prompt("Enter your username::");
    currentUser = { id: generateRandomAlphanumeric(8), UserName: userName };
    socket.emit("joinChat", currentUser);
    currentUserElement.innerHTML = 'I am ' + currentUser.UserName;

    function generateRandomAlphanumeric(length) {
        const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return Array.from(
            { length },
            () => characters[Math.floor(Math.random() * characters.length)]
        ).join("");
    }

    function updateUIUserList() {
        userListElement.innerHTML = `Users Online: ${onlineUsers.map((obj) => obj.UserName).join(", ")}`;

        recipientSelect.innerHTML = "";
        onlineUsers.forEach((user) => {
            const option = document.createElement("option");
            option.value = user.id;
            option.text = user.UserName;
            recipientSelect.add(option);
        });
    }

    function getElementOrCreate(id, appendToBody) {
        let element = document.getElementById(id);

        if (!element) {
            // If the element doesn't exist, create it
            element = document.createElement('div');
            element.id = id;

            if (appendToBody)
            {
                // Append the element to the body or any other container element
                document.body.appendChild(element);
            }
        }

        return element;
    }
});
