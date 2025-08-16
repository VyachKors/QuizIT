import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.routeParams = UrlManager.getUserParams();
        this.init();
    }

    async init() {

        const userInfo = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    this.answers = result;
                    console.log(this.answers);

                }
            } catch
                (error) {
                return console.log(error);
            }

        }
    }
}