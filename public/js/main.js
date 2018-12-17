(function() {
	// 모든 html요소를 변수에 넣기
	var socket = io.connect();
	var $messageForm = $('#message-form');
	var $message = $('#message');
	var $chat = $('#chat');
	var $messageArea = $('#message-area');
	var $userForm = $('#user-form');
	var $users = $('#users');
	var $onlineUsersHeader = $('#online-users-header');
	var $username = $('#username');
	// 폼 제출 후 메시지 전송
	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit('send message', $message.val());
		$message.val('');
	});
	//새 메시지 보낼때 사용자 이름과 시간 인터페이스에 출력
	socket.on('new message', function(data) {
		var currentHours = new Date().getHours() > 9 ? new Date().getHours() : ('0' + new Date().getHours())
		var currentMinutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : ('0' + new Date().getMinutes())
		data.msg ? (
			$chat.append(`<li>[${currentHours}:${currentMinutes}]<strong> ${data.user}: </strong>${data.msg}</li>`) )
			: alert('Blank message not allow!');
	});
	//사용자 이름을 폼으로 제출
	$userForm.submit(function(e) {
		e.preventDefault();
		socket.emit('new user', $username.val(), function(data) {
			data ? (
				$userForm.hide(),
					$messageArea.show()
			) : alert('Ohps. What\'s your name!')
		});
		$username.val('');
	});
	// 로컬에 접속한 유저 전부 가져와 목록 출력
	socket.on('get userList', function(data) {
		var html = '';
		for (i = 0; i < data.length; i++) {
			html += `<li class="list-item"><strong>${data[i]}</strong></li>`;
		}
		$onlineUsersHeader.html(`<span class="card-title"> Users in the room: </span><span class="label label-success">${data.length}</span>`);
		$users.html(html);
	});

})();
