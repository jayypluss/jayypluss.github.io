import {ILoadingScreen} from "@babylonjs/core"

export class LoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string
    private _loadingDiv: HTMLDivElement

    constructor(public loadingUIText: string, loadingUIBackgroundColor = 'red') {
        this.loadingUIText = loadingUIText
        this.loadingUIBackgroundColor = loadingUIBackgroundColor
    }

    public displayLoadingUI() {
        if (document.getElementById("customLoadingScreenDiv")) {
            // Do not add a loading screen if there is already one
            document.getElementById("customLoadingScreenDiv").style.display = "initial"
            return
        }
        this._loadingDiv = document.createElement("div")
        this._loadingDiv.id = "customLoadingScreenDiv"
        this._loadingDiv.innerHTML = this.loadingUIText
        this._loadingDiv.style.backgroundColor = this.loadingUIBackgroundColor
        this._loadingDiv.style.color = "white"
        this._loadingDiv.style.fontSize = "120px"
        this._loadingDiv.style.textAlign = "center"

        // this._resizeLoadingUI()
        // window.addEventListener("resize", this._resizeLoadingUI)

        document.body.appendChild(this._loadingDiv)
    }

    public hideLoadingUI() {
        document.getElementById("customLoadingScreenDiv").style.display = "none"
        console.log("scene is now loaded")
    }

    private _resizeLoadingUI() {
        return
    }
}
