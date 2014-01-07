$("#c1_p1_011").bind("getFocus", function() {
	$("#c1_p1_011_img_1").delay(800).fadeIn();
	$("#c1_p1_011_img_2").delay(1800).fadeIn();
	$("#c1_p1_011_img_3").delay(2800).fadeIn(function(){
		window.drcom.slide.enableNext();
	});
});
