var extension = window.loadData.useUnityWebExtension ? ".unityweb" : "";
var buildName = window.loadData.buildName;

var buildUrl = window.loadData.folder;
var loaderUrl = buildUrl + `/${buildName}.loader.js`;
var config = {
    dataUrl: buildUrl + `/${buildName}.data` + extension,
    frameworkUrl: buildUrl + `/${buildName}.framework.js` + extension,
    codeUrl: buildUrl + `/${buildName}.wasm` + extension,
    streamingAssetsUrl: "StreamingAssets",
    productVersion: "1.0",
};

var canvas = document.getElementById("game-canvas");

canvas.addEventListener("wheel", () => canvas.style.pointerEvents = "none");
document.addEventListener("click", () => canvas.style.pointerEvents = "all");

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, _ => {}).then((unityInstance) => {
            // fullscreenButton.onclick = () => {
            //      unityInstance.SetFullscreen(1);
            // };
            // resizeCanvas(frame);
            // frame.querySelector(".overlay").remove();
            window.loadData.cleanup();

            document.body.onkeydown = (evt) => { if (evt.code == "KeyF") unityInstance.SetFullscreen(1) };
        }).catch((message) => {
            alert(message);
        });
    };

document.body.appendChild(script);
