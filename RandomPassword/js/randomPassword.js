$(function() {
	//正则判断秘密位数和数量是否合法
	$("#num").blur(function() {
		if (!(/^[0-9]*$/.test(this.value))) {
			alert("生成密码位数必须要数值型");
			$(this).css("background-color", "red");
		} else if (this.value == "") {
			alert("生成密码位数不能为空");
			$(this).css("background-color", "red");
		} else {
			$(this).css("background-color", "white");
		}
	});
	$("#number").blur(function() {
		if (!(/^[0-9]*$/.test(this.value))) {
			alert("生成密码数量必须要数值型");
			$(this).css("background-color", "red");
		} else if (this.value == "") {
			alert("生成密码数量不能为空");
			$(this).css("background-color", "red");
		} else {
			$(this).css("background-color", "white");
		}
	});

	$("#tijiao").click(function() {
		put.innerHTML = "";
		var a, b, c, d, k;
		a = b = c = d = false;
		//each遍历
		$('input[name="option1"]:checked').each(function() {
			k = $(this).val()
			if (k == "a" || k == "b" || k == "c" || k == "d") {
				if (k == "a")
					a = true;
				if (k == "b")
					b = true;
				if (k == "c")
					c = true;
				if (k == "d")
					d = true;
			}
		});
		combinationString(a, b, c, d);
	});

	function combinationString(a, b, c, d) {
		var chars;
		if (a && b && c && d) { //全选情况
			chars = generateCharacters(33, 126);
		} else if (a && b && c) { //大小写数字
			chars = generateCharacters(0, 9).concat(generateCharacters(65, 90), generateCharacters(97, 122));
		} else if (a && b && d) { //大小写加特殊字符
			chars = generateCharacters(33, 47).concat(generateCharacters(58, 126));
		} else if (c && b && d) { //小写，数字，特殊字符
			chars = generateCharacters(33, 64).concat(generateCharacters(91, 126));
		} else if (a && c && d) { //大写，数字，特殊字符
			chars = generateCharacters(33, 96).concat(generateCharacters(123, 126));
		} else if (a && b) { //大小写
			chars = generateCharacters(65, 90).concat(generateCharacters(97, 122));
		} else if (a && c) { //大写，数字
			chars = generateCharacters(0, 9).concat(generateCharacters(65, 90));
		} else if (a && d) { //大写，特殊字符
			chars = generateCharacters(33, 47).concat(generateCharacters(65, 96), generateCharacters(123, 126));
		} else if (b && c) { //小写，数字
			chars = generateCharacters(0, 9).concat(generateCharacters(97, 122));
		} else if (b && d) { //小写，特殊字符
			chars = generateCharacters(33, 47).concat(generateCharacters(58, 64), generateCharacters(91, 126));
		} else if (c && d) { //数字，特殊字符
			chars = generateCharacters(33, 64).concat(generateCharacters(91, 96), generateCharacters(123, 126));
		} else if (a || b || c || d) { //abcd只选择其中一个的情况
			switch (true) {
				case a:
					chars = generateCharacters(65, 90);
					break;
				case b:
					chars = generateCharacters(97, 122);
					break;
				case c:
					chars = generateCharacters(0, 9);
					break;
				case d:
					chars = generateCharacters(33, 47).concat(generateCharacters(58, 64), generateCharacters(
						91, 96), generateCharacters(123, 126));
					break;
			}
		} else {
			return "请选择一种密码形式生成";
		}

		generateRandomPassword(chars);
	}

	//生成a-b之间的字符
	function generateCharacters(a, b) {
		var arr = new Array();
		for (var i = a, j = 0; i <= b; i++) {
			if (i < 10) {
				arr[j] = i;
			} else {
				arr[j] = String.fromCharCode(i);
			}
			j++;
		}
		return arr;
	}

	//生成随机密码
	function generateRandomPassword(chars) {
		var num = $("#num").val(); //字符长度
		var number = $("#number").val(); //行数
		var text;

		// 自动调整输出框的大小
		if (num >= 45) {
			// $("textarea").css("cols","50")
			$("#put").attr("cols", num);
			//防止生成密码太长，输出框超出范围
			if (num >= 70) {
				$("#put").attr("cols", "70");
			}
		}
		//print
		for (k = 0; k < number; k++) {
			for (i = 0, text = ''; i < num; i++) {
				text += chars[Math.floor(Math.random() * chars.length)];
			}
			put.innerHTML += text + "\n";
		}
	}
})
