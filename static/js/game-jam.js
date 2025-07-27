// The 'preload' class is used to stop animations from running on page load
document.body.classList.add('preload');
setTimeout(() => document.body.classList.remove('preload'), 100);

function setupUnityFrame(frame, folder, useUnityWebExtension = false) {
    frame.onmouseover = () => showOverlay(frame);
    frame.onmouseout = () => hideOverlay(frame);
    frame.onclick = () => instantiateUnity(frame, folder, useUnityWebExtension);

    frame.offsetHeight = (frame.offsetWidth * 9 / 16) + "px";
}

function instantiateUnity(frame, folder, useUnityWebExtension) {
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

function setupEmscriptenFrame(frame, folder, file) {
    frame.onmouseover = () => showOverlay(frame);
    frame.onmouseout = () => hideOverlay(frame);
    frame.onclick = () => instantiateEmscripten(frame, folder, file);

    resizeCanvas(frame);
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

function instantiateEmscripten(frame, folder, file) {
    frame.onmouseover = null;
    frame.onmouseout = null;
    frame.onclick = null;

    frame.querySelector(".overlay-text").classList.add("invisible");
    frame.querySelector(".spinner").classList.remove("invisible");

    var canvas = frame.querySelector("canvas");

    canvas.addEventListener("wheel", () => {
        canvas.style.pointerEvents = "none";
    });

    frame.addEventListener("click", () => {
        canvas.style.pointerEvents = "all";
        canvas.requestPointerLock();
    });

    import(`${folder}/${file}`).then(module => {
        var locateFile = (path, prefix) => {
            return `${folder}/${path}`;
        }

        module.default({ canvas: canvas, locateFile: locateFile }).then(engine => {
            resizeCanvas(frame);
            frame.querySelector(".overlay").remove();
            canvas.requestPointerLock();

            // Have to keep track of focus, otherwise we need to press escape twice
            document.addEventListener("pointerlockchange", () => {
                if (document.pointerLockElement === canvas) engine.ccall('focusin', 'void', []);
                else engine.ccall('focusout', 'void', []);
            });
        });
    });
}

function resizeCanvas(frame) {
    frame.offsetHeight = (frame.offsetWidth * 9 / 16) + "px";
    var canvas = frame.querySelector("canvas");
    canvas.offsetWidth = frame.offsetWidth + "px";
    canvas.offsetHeight = frame.offsetHeight + "px";

    canvas.width = frame.offsetWidth;
    canvas.height = frame.offsetHeight;
}
