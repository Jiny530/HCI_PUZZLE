var calendar;
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
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
        if (info.event.title != 'Tim' && info.event.title != 'Henry' && info.event.title != 'Cathy' && info.event.title != 'Emma')
        {
            
          $('#modalTitle').html(info.event.title);/*
          $('#time').html('Date\t:\t',info.event.extendedProps.start);
          $('#participants').html('Participants\t:\tTim\tHenrry');
          $('#place').html('Place\t:\tA101');
          $('#description').html('Description\t:\t',info.event.extendedProps.description);*/
          //$('#eventUrl').attr('href',event.url);
          $('#calendarModal').modal();
        }
      },
      dateClick: function(startDate, endDate, jsEvent, view) {
        //달력 날짜 클릭하면 실행되는 부분
      },
      events: [
        {
          title: 'Tim',
          start: '2021-06-01',
          end: '2021-06-03',
          color: '#ff7979',
          description: ''
        },
        {
          title: 'Tim',
          start: '2021-06-20',
          end: '2021-06-03',
          color: '#ff7979',
          description: ''
        },
        {
          title: 'Tim',
          start: '2021-06-16',
          end: '2021-06-19',
          color: '#ff7979',
          description: ''
        },
        {
          title: 'Henry',
          start: '2021-06-07',
          end: '2021-06-09',
          color: '#ffc932',
          description: ''
        },
        {
          title: 'Henry',
          start: '2021-06-23',
          end: '2021-06-24',
          color: '#ffc932',
          description: ''
        },
        {
          title: 'Cathy',
          start: '2021-06-08',
          end: '2021-06-10',
          color: '#4edb5d',
          description: ''
        },
        {
          title: 'Cathy',
          start: '2021-06-20',
          color: '#4edb5d',
          description: ''
        },
        {
          title: 'Emma',
          start: '2021-06-12',
          end: '2021-06-13',
          color: '#6197ff',
          description: ''
        },
        {
          title: 'Emma',
          start: '2021-06-02',
          color: '#6197ff',
          description: ''
        },
        {
          title: 'Emma',
          start: '2021-06-30',
          end: '2021-07-02',
          color: '#6197ff',
          description: ''
        },
        {
          title: 'Team meeting',
          start: '2021-06-05',
          color: '#9775fa',
          description: ''
        },
        {
          title: 'Low-fi prototyping',
          start: '2021-06-10',
          end: '2021-06-12',
          color: '#9775fa',
          description: ''
        },
        {
          title: 'Heuristic evaluation',
          start: '2021-06-14',
          color: '#9775fa',
          description: ''
        },
        {
          title: 'Hi-fi prototyping',
          start: '2021-06-22',
          color: '#9775fa',
          description: ''
        },
        
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

        var m1 = document.getElementById('Tim');
        var m2 = document.getElementById('Henry');
        var m3 = document.getElementById('Cathy');
        var m4 = document.getElementById('Emma');
        var sum=0;

        /******** 임시 RAMDON ID - 실제 DB 연동시 삭제 **********/
        var eventId = 1 + Math.floor(Math.random() * 1000);
        /******** 임시 RAMDON ID - 실제 DB 연동시 삭제 *********/

        //새로운 일정 저장버튼 클릭
        $('#save-event').unbind();
        $('#save-event').on('click', function () {

          //멤버 누구누구 참여하는지 비트로 구분
          if ($(m1).prop("checked")){
            sum+=1;
          }
          if ($(m2).prop("checked")){
            sum+=2;
          }
          if ($(m3).prop("checked")){
            sum+=4;
          }
          if ($(m4).prop("checked")){
            sum+=8;
          }

            var eventData = {
                _id: String(sum),
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
                id: eventData._id,
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