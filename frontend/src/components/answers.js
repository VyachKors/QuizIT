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
        if (!userInfo) {
            location.href = '#/';
            return;
        }

        const id = this.routeParams.id;
        if (!id) {
            location.href = '#/';
            return;
        }
        this.bindAnswersLink(this.routeParams.id);

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
            if (result && result.error) throw new Error(result.error);

            this.answers = result;
            this.answersQuiz();
        } catch (e) {
            console.log(e);
            location.href = '#/';
        }
    }

    answersQuiz() {
        const fullNameDiv = document.getElementById('profile-full-name');
        const fullName = fullNameDiv ? fullNameDiv.textContent.trim() : 'Имя не указано';
        const userEmail = localStorage.getItem('userEmail') || 'Почта не указана';
        const answersAuthor = document.getElementById('answers-author');
        const span = answersAuthor && answersAuthor.querySelector('span');
        if (span) {
            span.textContent = fullName + ', ' + userEmail;
        }


        const answersBlock = document.getElementById('answers-block');
        answersBlock.innerHTML = '';

        const test = this.answers.test;
        if (!test || !Array.isArray(test.questions)) {
            answersBlock.innerHTML = '<p>Нет данных по тесту.</p>';
            return;
        }

        test.questions.forEach((question, idx) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';

            const answerTitle = document.createElement('div');
            answerTitle.className = 'answer-title';

            const span = document.createElement('span');
            span.textContent = `Вопрос ${idx + 1}:`;
            answerTitle.appendChild(span);

            const titleText = document.createTextNode(' ' + question.question);
            answerTitle.appendChild(titleText);

            answerDiv.appendChild(answerTitle);

            const answerItems = document.createElement('div');
            answerItems.className = 'answer-items';

            question.answers.forEach(answer => {
                const answerItem = document.createElement('div');
                answerItem.className = 'answer-item';

                const answerItemCircle = document.createElement('div');
                answerItemCircle.className = 'answer-item-circle';
                // Подсвечиваем правильный ответ
                if (answer.correct === true) {
                    answerItemCircle.className = 'answer-item-circle-green';
                } else if (answer.correct === false) {
                    answerItemCircle.className = 'answer-item-circle-red';
                } else {
                    answerItemCircle.className = 'answer-item-circle'
                }
                const answerItemText = document.createElement('div');
                document.createElement('div');
                if (answer.correct === true) {
                    answerItemText.className = 'answer-item-text-green';
                } else if (answer.correct === false) {
                    answerItemText.className = 'answer-item-text-red';
                } else {
                    answerItemText.className = 'answer-item-text'
                }
                answerItemText.textContent = answer.answer;

                answerItem.appendChild(answerItemCircle);
                answerItem.appendChild(answerItemText);

                answerItems.appendChild(answerItem);
            });

            answerDiv.appendChild(answerItems);
            answersBlock.appendChild(answerDiv);
        });
    }

    bindAnswersLink(id) {
        const link = document.getElementById('result-link');
        if (!link) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            location.hash = '#/result?id=' + id;
        });

    }

}
