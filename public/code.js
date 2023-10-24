(function(){
    const app = document.querySelector(".app");
    const socket = io();
//Front-end 
    let uname;
    app.querySelector(".join_screen #join_user").addEventListener("click",function(){
        let username = app.querySelector(".join_screen #username").value;
        if(username.length == 0){
            return;
        }
        socket.emit("newuser",username);
        uname = username;
        app.querySelector(".join_screen").classList.remove("active");
        app.querySelector(".chat_screen").classList.add("active");
    });
//Send button
    app.querySelector(".chat_screen #send_message").addEventListener("click", function(){
        let message = app.querySelector(".chat_screen #message_input").value;             //retrieves the value entered into an input field 
        if(message.length == 0){                //checks if the message entered is empty
            return;
        }
        renderMessage("my", {                   //displays the message in the chat window.
            username:uname,
            text:message
        });
        socket.emit("chat",{                    //sends an event named "chat" to the server, 
            username:uname,
            text:message
        });
        app.querySelector(".chat_screen #message_input").value = "";        //clears the input field after the message has been sent.
    });
//interactions related to exiting the chat, receiving updates, and displaying chat messages
    app.querySelector(".chat_screen #exit_chat").addEventListener("click", function(){
        socket.emit("exituser",uname);
        window.location.href = window.location.href;
    });

    socket.on("update",function(update){
        renderMessage("update",update);
    });

    socket.on("chat",function(message){
        renderMessage("other",message);
    });
    // Function responsible for posting messages of different types, such as user messages,
    // messages from other users, and system updates, within the chat interface.
    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat_screen .messages");
        if(type =="my"){                                                            //messages of current user
            let el = document.createElement("div");
            el.setAttribute("class","message my_message");
            el.innerHTML = `
                <div>
                    <div class = "name">You</div>
                    <div class = "text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "other"){                                                  //message of other user
            let el = document.createElement("div");
            el.setAttribute("class","message other_message");
            el.innerHTML = `
                <div>
                    <div class = "name">${message.username}</div>
                    <div class = "text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "update"){                                                 //update message
            let el = document.createElement("div");
            el.setAttribute("class","udpdate");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        //scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;  // ensuring that the most recent messages are visible.
    }
})();