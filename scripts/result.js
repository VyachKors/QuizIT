(function () {
    const Result = {
        init() {
            checkUserData();
            const url = new URL(location.href);
            document.getElementById('result-score').innerText = url.searchParams.get('score') +
                '/' + url.searchParams.get('total');
            this.backAnswersElement = document.getElementById('back-to-answers');
            this.backAnswersElement.onclick = function () {
                location.href = 'answers.html' + location.search;
            };
        },
    }
    Result.init();
})();
