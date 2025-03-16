(function () {
    const Answers = {
        answersTrue: null,
        quizzes: null,
        testId: null,
        name: null,
        lastname: null,
        email: null,
        userAnswers: null,
        chosenAnswerIdsArray: null,
        init() {
            const url = new URL(location.href);
            this.testId = url.searchParams.get('id');
            this.name = url.searchParams.get('name');
            this.lastname = url.searchParams.get('lastName');
            this.email = url.searchParams.get('email');

            this.userAnswers = url.searchParams.get('results');
            this.chosenAnswerIdsArray = this.userAnswers.split(',');

            if (this.testId && this.name && this.lastname && this.email) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + this.testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.answersTrue = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                }
                xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + this.testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quizzes = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                }

                this.backResultsElement = document.getElementById('back-to-results');
                this.backResultsElement.onclick = function () {
                    location.href = 'result.html' + location.search;
                };
                this.formAnswers();

            } else {
                location.href = 'index.html';
            }

        },
        formAnswers() {
            document.getElementById('pre-title-ch').innerText = this.quizzes.name;
            const answersAuthor = document.getElementById('answers-author');
            const answersAuthorText = document.createTextNode('Тест выполнил ');
            const answersAuthorSpan = document.createElement('span');
            answersAuthorSpan.innerText = this.name + ', ' + this.email;
            answersAuthor.appendChild(answersAuthorText);
            answersAuthor.appendChild(answersAuthorSpan);


            for (let i = 0; i < this.quizzes.questions.length; i++) {
                let itemElementQuestion = this.quizzes.questions[i];
                let itemElementAnswers = itemElementQuestion.answers;
                const itemAnswer = document.createElement('div');
                itemAnswer.className = 'answer';

                const itemAnswerTitle = document.createElement('div');
                itemAnswerTitle.className = 'answer-title';

                const itemAnswerTitleSpan = document.createElement('span');
                itemAnswerTitleSpan.innerText = 'Вопрос ' + (i + 1) + ': ';
                const itemAnswerTitleText = document.createTextNode(itemElementQuestion.question);

                itemAnswerTitle.appendChild(itemAnswerTitleSpan);
                itemAnswerTitle.appendChild(itemAnswerTitleText);

                const itemAnswersBlock = document.createElement('div');
                itemAnswersBlock.className = 'answer-items';
                for (let i = 0; i < itemElementAnswers.length; i++) {
                    const itemAnswersBlockElement = document.createElement('div');
                    itemAnswersBlockElement.className = 'answer-item'
                    this.colorAnswers();

                    const itemAnswersBlockElementCircle = document.createElement('div');
                    itemAnswersBlockElementCircle.className = 'answer-item-circle';
                    const itemAnswersBlockElementText = document.createElement('div');
                    itemAnswersBlockElementText.className = 'answer-item-text';
                    itemAnswersBlockElementText.innerText = itemElementAnswers[i].answer;

                    itemAnswersBlockElement.appendChild(itemAnswersBlockElementCircle);
                    itemAnswersBlockElement.appendChild(itemAnswersBlockElementText);
                    itemAnswersBlock.appendChild(itemAnswersBlockElement);
                }

                itemAnswer.appendChild(itemAnswerTitle);
                itemAnswer.appendChild(itemAnswersBlock);

                const answersBlock = document.getElementById('answers-block');
                answersBlock.appendChild(itemAnswer);
            }
        },
        colorAnswers() {
            console.log(this.chosenAnswerIdsArray);
            console.log(this.answersTrue);
            console.log(this.quizzes);
        }


    };
    Answers.init();
})();