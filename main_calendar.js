document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'interaction', 'dayGrid' ],
      header: {
        left: 'prevYear,prev,next,nextYear today  addEventButton',
        center: 'title ',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      customButtons: {
        addEventButton: {
          text: 'add schedule',
          click: function(startDate, endDate) {
            // 일정추가버튼
            newEvent(startDate, endDate, $(this).html());
          }
        }
      },
      views: { 
        month : { eventLimit : 12 } // 한 날짜에 최대 이벤트 12개, 나머지는 + 처리됨
      },
      defaultDate: '2021-06-02',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      eventClick : function(info){
        // 일정 클릭하면 실행되는 부분
        alert(info);
      },
      dateClick: function(startDate, endDate, jsEvent, view) {
        //달력 날짜 클릭하면 실행되는 부분
      },
      events: [
        {
          title: 'All Day Event',
          start: '2021-05-01',
          color: 'red'
        },
        {
          title: 'Long Event',
          start: '2021-05-21',
          end: '2021-05-23',
          color: 'green'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2021-05-10T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2020-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2021-05-10',
          end: '2021-05-13',
          color: 'green'
        },
        {
          title: 'Meeting',
          start: '2020-02-12T10:30:00',
          end: '2020-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2020-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2020-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2020-02-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2020-02-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2020-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-02-28'
        }
      ]
    });

    // addEvent에서 긁어옴, 새로운 이벤트 추가할때 calendar.addEvent가 안돼서 집어넣음
    var eventModal = $('#eventModal');

    var modalTitle = $('.modal-title');
    var editAllDay = $('#edit-allDay');
    var editTitle = $('#edit-title');
    var editStart = $('#edit-start');
    var editEnd = $('#edit-end');
    var editType = $('#edit-type');
    var editColor = $('#edit-color');
    var editDesc = $('#edit-desc');

    var addBtnContainer = $('.modalBtnContainer-addEvent');
    var modifyBtnContainer = $('.modalBtnContainer-modifyEvent');


    /* ****************
    *  새로운 일정 생성
    * ************** */
    var newEvent = function (start, end, eventType) {

        $("#contextMenu").hide(); //메뉴 숨김

        modalTitle.html('New Task');
        editType.val(eventType).prop('selected', true);
        editTitle.val('');
        editStart.val(start);
        editEnd.val(end);
        editDesc.val('');
        
        addBtnContainer.show();
        modifyBtnContainer.hide();
        eventModal.modal('show');

        /******** 임시 RAMDON ID - 실제 DB 연동시 삭제 **********/
        var eventId = 1 + Math.floor(Math.random() * 1000);
        /******** 임시 RAMDON ID - 실제 DB 연동시 삭제 **********/

        //새로운 일정 저장버튼 클릭
        $('#save-event').unbind();
        $('#save-event').on('click', function () {

            var eventData = {
                _id: eventId,
                title: editTitle.val(),
                start: editStart.val(),
                end: editEnd.val(),
                description: editDesc.val(),
                type: editType.val(),
                username: '사나',
                backgroundColor: editColor.val(),
                textColor: '#ffffff',
                allDay: false
            };

            if (eventData.start > eventData.end) {
                alert('End date can not be previous date.');
                return false;
            }

            if (eventData.title === '') {
                alert('Name is necessary.');
                return false;
            }

            var realEndDay;

            if (editAllDay.is(':checked')) {
                eventData.start = moment(eventData.start).format('YYYY-MM-DD');
                //render시 날짜표기수정
                eventData.end = moment(eventData.end).add(1, 'days').format('YYYY-MM-DD');
                //DB에 넣을때(선택)
                realEndDay = moment(eventData.end).format('YYYY-MM-DD');

                eventData.allDay = true;
            }
            // 여기서 새로 이벤트 추가됨
            
            calendar.addEvent({
                title: eventData.title,
                start: eventData.start,
                end: eventData.end,
                color: eventData.backgroundColor
              });
            eventModal.modal('hide');
            /*
            $("#calendar").fullCalendar('renderEvent', eventData, true);
            eventModal.find('input, textarea').val('');
            editAllDay.prop('checked', false);
            

            //새로운 일정 저장
            $.ajax({
                type: "get",
                url: "",
                data: {
                    //.....
                },
                success: function (response) {
                    //DB연동시 중복이벤트 방지를 위한
                    //$('#calendar').fullCalendar('removeEvents');
                    //$('#calendar').fullCalendar('refetchEvents');
                }
            });*/
        });
    };

    // 이벤트 추가 함수 (참고할것)
    calendar.addEvent({
          title: 'aaaaa',
          start: '2021-05-25',
          end: '2021-05-26T12:30:00',
          color: 'red'
        });
    calendar.render();
  });