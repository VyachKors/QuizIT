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
            //получаем данные из урла для идентификации
            const url = new URL(location.href);
            this.testId = url.searchParams.get('id');
            this.name = url.searchParams.get('name');
            this.lastname = url.searchParams.get('lastName');
            this.email = url.searchParams.get('email');
            this.userAnswers = url.searchParams.get('results');  //id номеров ответов пользователя из урла
            this.chosenAnswerIdsArray = this.userAnswers.split(',').map(Number);  //массив полученых id для дальнейшей работы. разделение через запятую. тип данных "число" через функцию map

            //запросы на сервер
            if (this.testId && this.name && this.lastname && this.email) {  //проверка наличия всех идентификационных параметров
                //массив правильных ответов(answersTrue)
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
                //массив нужного теста(quizzes)
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
                //кнопка возврата к ответам
                this.backResultsElement = document.getElementById('back-to-results');
                this.backResultsElement.onclick = function () {
                    location.href = 'result.html' + location.search;
                };
                this.formAnswers(); //вызов функции formAnswers
            } else {
                location.href = 'index-q.html'; // если в урле нехватает идентификационных данных возврат на страницу регистрации
            }

        },
        //функция для создания блока ответов
        formAnswers() {
            //для элемента с id pre-title-ch добавляем текст - название теста
            document.getElementById('pre-title-ch').innerText = this.quizzes.name;
            // создаем блок автора
            const answersAuthor = document.getElementById('answers-author');
            const answersAuthorText = document.createTextNode('Тест выполнил ');
            const answersAuthorSpan = document.createElement('span');
            answersAuthorSpan.innerText = this.name + ', ' + this.email;
            answersAuthor.appendChild(answersAuthorText);
            answersAuthor.appendChild(answersAuthorSpan);


            for (let i = 0; i < this.quizzes.questions.length; i++) {
                let itemElementQuestion = this.quizzes.questions[i];
                let itemElementAnswers = itemElementQuestion.answers;
                console.log(itemElementAnswers);
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
                for (let j = 0; j < itemElementAnswers.length; j++) {
                    const itemAnswersBlockElement = document.createElement('div');
                    itemAnswersBlockElement.className = 'answer-item';
                    itemAnswersBlockElement.dataset.answerId = itemElementAnswers[j].id;
                    console.log(itemAnswersBlockElement);

                    const itemAnswersBlockElementCircle = document.createElement('div');
                    itemAnswersBlockElementCircle.className = 'answer-item-circle';


                    const itemAnswersBlockElementText = document.createElement('div');
                    itemAnswersBlockElementText.className = 'answer-item-text';
                    itemAnswersBlockElementText.innerText = itemElementAnswers[j].answer;

                    const isCorrect = this.answersTrue[i] === itemElementAnswers[j].id;
                    const isUserAnswer = this.chosenAnswerIdsArray.includes(itemElementAnswers[j].id);

                    if (isUserAnswer) {
                        if (isCorrect) {
                            itemAnswersBlockElementCircle.classList.add('answer-item-circle-green');
                            itemAnswersBlockElementText.classList.add('answer-item-text-green');
                        } else {
                            itemAnswersBlockElementCircle.classList.add('answer-item-circle-red');
                            itemAnswersBlockElementText.classList.add('answer-item-text-red');
                        }
                    } else {
                        itemAnswersBlockElementCircle.classList.add('answer-item-circle');
                        itemAnswersBlockElementText.classList.add('answer-item-text');
                    }
                    if (isCorrect && !isUserAnswer) {
                        itemAnswersBlockElementCircle.classList.add('answer-item-circle-green');
                        itemAnswersBlockElementText.classList.add('answer-item-text-green');
                    }


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


    };
    Answers.init();
})();