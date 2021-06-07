// ================================
// START YOUR APP HERE
// ================================
const init = {
  monList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dayList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  today: new Date(),
  monForChange: new Date().getMonth(),
  activeDate: new Date(),
  getFirstDay: (yy, mm) => new Date(yy, mm, 1),
  getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
  nextMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(++this.monForChange);
    this.activeDate = d;
    return d;
  },
  prevMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(--this.monForChange);
    this.activeDate = d;
    return d;
  },
  addZero: (num) => (num < 10) ? '0' + num : num,
  activeDTag: null,
  getIndex: function (node) {
    let index = 0;
    while (node = node.previousElementSibling) {
      index++;
    }
    return index;
  }
};

const $calBody = document.querySelector('.cal-body');
const $btnNext = document.querySelector('.btn-cal.next');
const $btnPrev = document.querySelector('.btn-cal.prev');


var clickedArray = new Array();
var start = "";
var end = "";
var chose;
var activeArr = [21, 22, 24, 25, 26, 27, 28, 29];

/**
 * @param {number} date
 * @param {number} dayIn
*/
var clickedYearMonth="";
var clickedDate = "";

function loadDate (date, dayIn) {
  clickedDate = date;
}
/**
 * @param {date} fullDate
 */
function loadYYMM (fullDate) {
  let yy = fullDate.getFullYear();
  let mm = fullDate.getMonth();
  let firstDay = init.getFirstDay(yy, mm);
  let lastDay = init.getLastDay(yy, mm);
  let markToday;  // for marking today date

  if (mm<10){
    clickedYearMonth += yy+'-0'+(mm+1);
  }
  else{
    clickedYearMonth += yy+'-'+(mm+1);
  }
  

  if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
    markToday = init.today.getDate();
  }

  document.querySelector('.cal-month').textContent = init.monList[mm];
  document.querySelector('.cal-year').textContent = yy;

  let trtd = '';
  let startCount;
  let countDay = 0;
  for (let i = 0; i < 6; i++) {
    trtd += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && !startCount && j === firstDay.getDay()) {
        startCount = 1;
      }
      if (!startCount) {
        trtd += '<td>'
      } else {
        let de = true;
        let fullDate = yy + '.' + init.addZero(mm + 1) + '.' + init.addZero(countDay + 1);
        for(let k = 0; k<activeArr.length; k++) {
          if(fullDate === "2021.06." + String(activeArr[k])) de = false;
        }
        trtd += '<td class="day';
        trtd += (de === true) ? ' day-deactive" ' : '"';
        trtd += (markToday && markToday === countDay + 1) ? ' today" ' : '"';
        trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}">`;
      }
      trtd += (startCount) ? ++countDay : '';
      if (countDay === lastDay.getDate()) {
        startCount = 0;
      }
      trtd += '</td>';

    }
    trtd += '</tr>';
  }
  $calBody.innerHTML = trtd;
}

/**
 * @param {string} val
 */
function createNewList (val) {
  let id = new Date().getTime() + '';
  let yy = init.activeDate.getFullYear();
  let mm = init.activeDate.getMonth() + 1;
  let dd = init.activeDate.getDate();
  const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);

  let date = yy + '.' + init.addZero(mm) + '.' + init.addZero(dd);

  let eventData = {};
  eventData['date'] = date;
  eventData['memo'] = val;
  eventData['complete'] = false;
  eventData['id'] = id;
  init.event.push(eventData);
  $todoList.appendChild(createLi(id, val, date));
}

loadYYMM(init.today);
loadDate(init.today.getDate(), init.today.getDay());

$btnNext.addEventListener('click', () => loadYYMM(init.nextMonth()));
$btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth()));



/**
 * 여기가 캘린더 속 날짜 클릭 시 이벤트임
 */
$calBody.addEventListener('mouseup', (e) => {

  //<!-- 우클=세부 -->
  if ((event.button == 2) || (event.which == 3)) {
      if (e.target.classList.contains('day') && !e.target.classList.contains('day-deactive')) {
        let day = Number(e.target.textContent);
        chose = e.target;
        loadDate(day, e.target.cellIndex);
        var cDate = clickedYearMonth+'-'+clickedDate;
        start = cDate;
        openModal(day);
      }
  }
  //<!-- 좌클=전체 -->
  else {
      if (e.target.classList.contains('day') && !e.target.classList.contains('day-deactive')) {
          let day = Number(e.target.textContent);
          loadDate(day, e.target.cellIndex);
          var cDate = clickedYearMonth+'-'+clickedDate;
          start = cDate;
          var delnum = false;

          var clicked = {allday : "yes", start: start, end:"none"};

          /*array로 대충 데이터보관*/
          for(var i = 0; i<clickedArray.length; i++) {
            var prev = clickedArray[i];
            if(clicked.date == prev.date) {
              if(e.target.classList.contains('day-active2')) {
                e.target.classList.remove('day-active2')
                clickedArray.splice(i, 1);
              }
              else if(e.target.classList.contains('day-active')) {
                e.target.classList.remove('day-active');
                clickedArray.splice(i, 1);
                delnum=true;
              }
            }
          }
          if(delnum==false) {
            clickedArray.push(clicked);
            e.target.classList.add('day-active');
          }
          init.activeDTag = e.target;
          init.activeDate.setDate(day);
        }
  }
});

function getURLParams(url) {
  var result = {};
  url.replace(/[?&]{1}([^=&#]+)=([^&#]*)/g, function(s, k, v) { result[k] = decodeURIComponent(v); });
  return result;
}

const gs_url = window.location.href;

//스케쥴 완료!
function confirm_gohome() {
  min = Math.ceil(0);
  max = Math.floor(clickedArray.length);
  var n = Math.floor(Math.random() * (max - min)) + min;
  var url = "index.html?index&";
  url += "flag=" + "1" + "&"+ "start=" + clickedArray[n].start + "&" + "name=" + getURLParams(gs_url).name;
  
  gs_flag = 1;
  window.location.href = url;
}

//스케쥴 고르기 취소
function delete_gohome() {
  clearArray(clickedArray);
  var url = "index.html?index&none&flag=0";
  window.location.href = url;
}

//array비우는 함수
function clearArray(array) {
  while (array.length) {
    array.pop();
  }
}

function openModal(day) {
  document.querySelector('.modal_wrap').style.display ='block';
  document.querySelector('.black_bg').style.display ='block';
  document.querySelector('.mcontainer').value = day;
}

function closeModal() {
  document.querySelector('.modal_wrap').style.display ='none';
  document.querySelector('.black_bg').style.display ='none';
}

function groupSchedule() {
  let startHour = document.querySelector('#start').value;
  let startList = startHour.split(":");
  let endHour = document.querySelector('#end').value;
  let endList = endHour.split(":");

  end = start;
  start.setHours(startList[0], startList[1], 0);
  let s = new Date(start);
  end.setHours(endList[0], endList[1], 0);
  let e = new Date(end);

  let clicked = {allday : "no", start: s, end: e};
  console.log(clicked);
  var delnum = false;

  /*array로 대충 데이터보관*/
  for(var i = 0; i<clickedArray.length; i++) {
    var prev = clickedArray[i];

    let now = clicked.start.getFullYear()+(clicked.start.getMonth()+1)+clicked.start.getDate();
    let bef = prev.start.getFullYear()+(prev.start.getMonth()+1)+prev.start.getDate();

    if(now == bef) {
      if(chose.classList.contains('day-active')) {
        chose.classList.remove('day-active')
        clickedArray.splice(i, 1);
      }
      else if(chose.classList.contains('day-active2')) {
        chose.classList.remove('day-active2');
        clickedArray.splice(i, 1);
        delnum=true;
      }
    }
  }
  if(delnum==false) {
    clickedArray.push(clicked);
    chose.classList.add('day-active2');
  }
  init.activeDTag = chose;
  let day =  document.querySelector('.mcontainer').value;
  init.activeDate.setDate(day);

  document.querySelector('.modal_wrap').style.display ='none';
  document.querySelector('.black_bg').style.display ='none';
}



