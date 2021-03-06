"use strict";

const SHELTER_DOM = document.querySelector(".post-shelter");
const POST_WINDOW_DOM = document.querySelector(".post-window");
const URL_INPUT_DOM = document.getElementById("url-input");
const TITLE_INPUT_DOM = document.getElementById("title-input");
const CHECKBOX_DOM = document.getElementById("anonymus-check");
const WARNING_DOM = document.querySelector(".warning");

function showPostWindow(method, title, href, postid, owner) {
    if (method === 0) {
        document.getElementById("submit").style.display = "inline-block";
        document.getElementById("modify").style.display = "none";
    } else {
        if (owner !== user) {
            showReminder('not your post');
            return;
        }
        document.getElementById("submit").style.display = "none";
        document.getElementById("modify").style.display = "inline-block";
        document.getElementById("modify").addEventListener("click", function() {
            return postSubmit(1, postid, owner);
        })
    }
    if (title || href) {
        URL_INPUT_DOM.value = href;
        TITLE_INPUT_DOM.value = title;
    }
    let yOffest = -20;
    let opacity = 0;
    SHELTER_DOM.style.display = "block";
    let postWindowAnimation = setInterval(function() {
        POST_WINDOW_DOM.style.transform = "translateY(" + yOffest + "px)";
        POST_WINDOW_DOM.style.opacity = opacity;
        yOffest += 2;
        opacity += 0.1;
        if (!yOffest) {
            clearInterval(postWindowAnimation);
        }
    }, 50);
}

function hidePostWindow() {
    POST_WINDOW_DOM.style.transform = "translateY(-40px)";
    POST_WINDOW_DOM.style.opacity = 0;
    SHELTER_DOM.style.display = "none";
    postReset();
}

function postReset() {
    URL_INPUT_DOM.value = null;
    TITLE_INPUT_DOM.value = null;
    CHECKBOX_DOM.checked = false;
    WARNING_DOM.innerHTML = "";
}

function postSubmit(method, postid, owner) {
    // METHOD - 0 FOR NEW POST OR 1 FOR MODIFY
    WARNING_DOM.innerHTML = "";
    if (!TITLE_INPUT_DOM.value) {
        WARNING_DOM.innerHTML = "&larr;Title cannot be empty.";
        return;
    } else {
        let requestObj = {
            "title": TITLE_INPUT_DOM.value,
            "href": URL_INPUT_DOM.value,
            "owner": user
        }
        if (method === 0) {
            httpPostRequest(requestObj);
        } else {
            modifyPost(requestObj, postid, owner);
            document.getElementById("modify").removeEventListener("click", function() {
                return postSubmit(1, postid);
            })
        }
        hidePostWindow();
        postReset();
        let img = document.createElement("img");
        img.src = "./img/loading.gif";
        POST_LIST_DOM.innerHTML = "";
        POST_LIST_DOM.appendChild(img);
    }
}