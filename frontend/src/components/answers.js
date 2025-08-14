import {UrlManager} from "../utils/url-manager.js";

export class Answers {
    constructor() {
        this.routeParams = UrlManager.getUserParams();
        this.init();
    }
}