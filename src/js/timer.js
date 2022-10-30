// const watch = document.querySelector("#watch");
// let milliseconds = 0;
// let timer;

// const startWatch = () => {
//   watch.classList.remove("paused");
//   clearInterval(timer);
//   timer = setInterval(() => {
//     milliseconds += 1;
//     let dateTimer = new Date(milliseconds);
//     watch.innerHTML =
//       ("0" + dateTimer.getUTCMinutes()).slice(-2) +
//       ":" +
//       ("0" + dateTimer.getUTCSeconds()).slice(-3, -1);
//   }, 1000);
// }

// const pauseWatch = () => {
//   watch.classList.add("paused");
//   clearInterval(timer);
// };

// document.addEventListener("click", (e) => {
//   const element = e.target;
//   if (element.id === "start") startWatch();
//   if (element.id === "pause") pauseWatch();

// });

(function () {
  const hour = document.getElementById("hour");
  const mins = document.getElementById("mins");
  const secs = document.getElementById("secs");
  let S = "00",
    M = "00",
    H = "00";

  setInterval(function () {
    //Плюсик перед строкой преобразует его в число
    S = +S + 1;
    //Если результат меньше 10, прибавляем впереди строку '0'
    if (S < 10) {
      S = "0" + S;
    }
    if (S == 60) {
      S = "00";
      //Как только секунд стало 60, добавляем +1 к минутам
      M = +M + 1;
      //Дальше то же самое, что и для секунд
      if (M < 10) {
        M = "0" + M;
      }
      if (M == 60) {
        //Как только минут стало 60, добавляем +1 к часам.
        M = "00";
        H = +H + 1;
        if (H < 10) {
          H = "0" + H;
        }
      }
    }
    secs.innerText = S;
    mins.innerText = M;
    hour.innerText = H;
    //Тикает всё через одну функцию, раз в секунду.
  }, 1000);
})();
