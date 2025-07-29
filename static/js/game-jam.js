// The 'preload' class is used to stop animations from running on page load
document.body.classList.add('preload');
setTimeout(() => document.body.classList.remove('preload'), 100);

function setupUnityFrame(frame, buildName, folder, useUnityWebExtension = false) {
    frame.onmouseover = () => showOverlay(frame);
    frame.onmouseout = () => hideOverlay(frame);
    frame.onclick = () => instantiateUnity(frame, buildName, folder, useUnityWebExtension);

    frame.offsetHeight = (frame.offsetWidth * 9 / 16) + "px";
}

function instantiateUnity(frame, buildName, folder, useUnityWebExtension) {
    frame.onmouseover = null;
    frame.onmouseout = null;
    frame.onclick = null;

    frame.querySelector(".overlay-text").classList.add("invisible");
    frame.querySelector(".spinner").classList.remove("invisible");
    var overlay = frame.querySelector(".overlay");

    var child = document.createElement('iframe');
    child.src = "/html/game-jam-frame.html";
    child.classList.add("submission-contents");
    
    frame.appendChild(child);
    
    child.contentWindow.loadData = {
        buildName: buildName,
        folder: folder,
        parent: frame,
        cleanup: () => overlay.remove(),
        useUnityWebExtension: useUnityWebExtension
    };
}

function setupGodotFrame(frame, htmlPageLoc) {
    frame.onmouseover = () => showOverlay(frame);
    frame.onmouseout = () => hideOverlay(frame);
    frame.onclick = () => instantiateGodot(frame, htmlPageLoc);

    frame.offsetHeight = (frame.offsetWidth * 9 / 16) + "px";
}

function instantiateGodot(frame, htmlPageLoc) {
    frame.onmouseover = null;
    frame.onmouseout = null;
    frame.onclick = null;

    frame.querySelector(".overlay-text").classList.add("invisible");
    frame.querySelector(".spinner").classList.remove("invisible");
    var overlay = frame.querySelector(".overlay");

    var child = document.createElement('iframe');
    child.src = htmlPageLoc;
    child.classList.add("submission-contents");
    
    frame.appendChild(child);
    
    child.contentWindow.loadData = {
        parent: frame,
        cleanup: () => overlay.remove()
    };

    var script = document.createElement("script");
    script.textContent = "window.loadData.cleanup();";
    child.appendChild(script);
}

function setupEmscriptenFrame(frame, folder, file, weirdAspect) {
    frame.onmouseover = () => showOverlay(frame);
    frame.onmouseout = () => hideOverlay(frame);
    frame.onclick = () => instantiateEmscripten(frame, folder, file, weirdAspect);

    if (weirdAspect) {
        frame.classList.add("weird-aspect-ratio");
        frame.querySelector(".overlay").classList.add("weird-aspect-ratio");
        frame.querySelector("img").classList.add("weird-aspect-ratio");
    }

    // resizeCanvas(frame);
}

function showOverlay(frame) {
    frame.querySelector(".overlay-text").classList.remove("invisible");
    frame.querySelector(".overlay").classList.add("blur");
    frame.querySelector(".overlay").classList.add("pointer");
}

function hideOverlay(frame) {
    frame.querySelector(".overlay-text").classList.add("invisible");
    frame.querySelector(".overlay").classList.remove("blur");
    frame.querySelector(".overlay").classList.remove("pointer");
}

function instantiateEmscripten(frame, folder, file, weirdAspect) {
    frame.onmouseover = null;
    frame.onmouseout = null;
    frame.onclick = null;

    frame.querySelector(".overlay-text").classList.add("invisible");
    frame.querySelector(".spinner").classList.remove("invisible");
    var overlay = frame.querySelector(".overlay");

    var child = document.createElement('iframe');
    child.src = `${folder}/${file}`;
    child.classList.add("submission-contents");
    if (weirdAspect) {
        child.classList.add("weird-aspect-ratio");
    }
    
    frame.appendChild(child);

    child.contentWindow.loadData = {
        parent: frame,
        cleanup: () => overlay.remove()
    };

    var script = child.contentDocument.createElement("script");
    script.textContent = "window.loadData.cleanup();";
    child.contentDocument.body.appendChild(script);
}

function resizeCanvas(frame) {
    frame.offsetHeight = (frame.offsetWidth * 9 / 16) + "px";
    var canvas = frame.querySelector("canvas");
    canvas.offsetWidth = frame.offsetWidth + "px";
    canvas.offsetHeight = frame.offsetHeight + "px";

    canvas.width = frame.offsetWidth;
    canvas.height = frame.offsetHeight;
}
