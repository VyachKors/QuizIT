import {UrlManager} from "../utils/url-manager.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getUserParams();
        document.getElementById('result-score').innerText = this.routeParams.score +
            '/' + this.routeParams.total;
        this.backAnswersElement = document.getElementById('back-to-answers');
        this.backAnswersElement.onclick = function () {
            location.href = 'answers.html' + location.search;
        };
    }
}
