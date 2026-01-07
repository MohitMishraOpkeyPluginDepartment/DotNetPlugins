$(document).ready(function () {
var canvasCheckThread=	window.setInterval(function () {


		var canvas_id = "#opkey_uppercanvas";
		var canvas = document.getElementById("opkey_uppercanvas");
		if (canvas != null) {
			window.clearInterval(canvasCheckThread);
			var ctx = canvas.getContext("2d");
			var canvasOffset = $(canvas_id).offset();
			var offsetX = canvasOffset.left;
			var offsetY = canvasOffset.top;
			var storedLines = [];
			var startX = 0;
			var startY = 0;
			var isDown;
			createControls();


			function reInitVars() {
				canvas = document.getElementById("opkey_uppercanvas");
				ctx = canvas.getContext("2d");
				canvasOffset = $(canvas_id).offset();
				offsetX = canvasOffset.left;
				offsetY = canvasOffset.top;
			}

			function handleMouseDown(e) {
				if ($("#opkey_fetchRelativeCoordinate").is(":disabled")) {
					return;
				}
				var mouseX = parseInt(e.clientX - offsetX);
				var mouseY = parseInt(e.clientY - offsetY);
				isDown = true;
				var drawLine_x = sessionStorage.getItem("drawLine_x");
				var drawLine_y = sessionStorage.getItem("drawLine_y");
				startX = drawLine_x;
				startY = drawLine_y;
			}

			function handleMouseMove(e) {
				if ($("#opkey_fetchRelativeCoordinate").is(":disabled")) {
					if ($("#opkey_fetchRelativeCoordinate").hasClass("opkeyrelativestart")) {
						$("#opkey_fetchRelativeCoordinate").removeClass("opkeyrelativestart");
						$("#opkey_fetchRelativeCoordinate").addClass("opkeyrelativeclose");
						document.body.removeEventListener("mousemove", event_bodyMouseMove, false);
						canvas.removeEventListener("mousedown", event_canvasMouseDown, false);
						canvas.removeEventListener("mousemove", event_canvasMouseMove, false);
						canvas.removeEventListener("mouseup", event_canvasMouseUp, false);
						triggerMouseClick(canvas, e.clientX, e.clientY);
					}
					document.body.removeAttribute("relativeCroppingStatus");
					return;
				}
				if (!isDown) {
					return;
				}
				redrawStoredLines();
				var mouseX = parseInt(e.clientX - offsetX);
				var mouseY = parseInt(e.clientY - offsetY);
				// draw the current line
				var _left = mouseX - startX;
				var _top = mouseY - startY;
				sessionStorage.setItem("opkey_relativeleft", _left);
				sessionStorage.setItem("opkey_relativetop", _top);
				drawArrow(startX, startY, mouseX, mouseY);
			}

			function triggerMouseClick(target, clientX, clientY) {
				// Create and dispatch a mousedown event
				const mousedownEvent = new MouseEvent("mousedown", {
					bubbles: true,
					cancelable: true,
					clientX: clientX,
					clientY: clientY,
				});
				target.dispatchEvent(mousedownEvent);
				// Create and dispatch a mouseup event
				const mouseupEvent = new MouseEvent("mouseup", {
					bubbles: true,
					cancelable: true,
					clientX: clientX,
					clientY: clientY,
				});
				target.dispatchEvent(mouseupEvent);
			}
			function handleMouseUp(e) {
				if ($("#opkey_fetchRelativeCoordinate").is(":disabled")) {
					return;
				}
				sessionStorage.setItem("canDoRelativeCrop", "false");
				isDown = false;
				var mouseX = parseInt(e.clientX - offsetX);
				var mouseY = parseInt(e.clientY - offsetY);
				storedLines.push({
					x1: startX,
					y1: startY,
					x2: mouseX,
					y2: mouseY
				});
				redrawStoredLines();
			}

			function redrawStoredLines() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				if (storedLines.length == 0) {
					return;
				}
				// redraw each stored line
				for (var i = 0; i < storedLines.length; i++) {
					ctx.beginPath();
					ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
					ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
					ctx.stroke();
				}
				storedLines.length = 0;
			}


			function drawArrow(fromx, fromy, tox, toy) {
				// variables to be used when creating the arrow
				var headlen = 10;

				var angle = Math.atan2(toy - fromy, tox - fromx);

				// starting path of the arrow from the start square to the end square and
				// drawing the stroke
				ctx.beginPath();
				ctx.setLineDash([5, 15]);
				ctx.moveTo(fromx, fromy);
				ctx.lineTo(tox, toy);
				ctx.strokeStyle = "#66ff33";
				ctx.lineWidth = 5;
				ctx.stroke();

				// starting a new path from the head of the arrow to one of the sides of the
				// point
				ctx.beginPath();
				ctx.moveTo(tox, toy);
				ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

				// path from the side point of the arrow, to the other side point
				ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

				// path from the side point back to the tip of the arrow, and then again to
				// the opposite side point
				ctx.lineTo(tox, toy);
				ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

				// draws the paths created above
				ctx.strokeStyle = "#66ff33";
				ctx.lineWidth = 5;
				ctx.stroke();
				ctx.fillStyle = "#66ff33";
				ctx.fill();
			}

			function setRelativeCroppingStatus(status) {
				document.body.setAttribute("relativeCroppingStatus", status.toString());
			}

			function event_bodyMouseMove(e) {
				e.stopPropagation();
			}

			function event_canvasMouseMove(e) {
				setRelativeCroppingStatus(true);
				e.stopPropagation();
				e.cancelBubble = true;
				e.preventDefault();
				handleMouseMove(e);
			}

			function event_canvasMouseDown(e) {
				setRelativeCroppingStatus(true);
				e.stopPropagation();
				e.cancelBubble = true;
				e.preventDefault();
				reInitVars();
				handleMouseDown(e);
			}

			function event_canvasMouseUp(e) {
				setRelativeCroppingStatus(true);
				e.stopPropagation();
				e.cancelBubble = true;
				e.preventDefault();
				handleMouseUp(e);
			}

			function createControls() {
				var _toolBarElement = $(".darkroom-toolbar");


				var _buttonGroupDiv = document.createElement("DIV");
				$(_buttonGroupDiv).addClass("darkroom-button-group");
				$(_buttonGroupDiv).html("<button type=\"button\" id=\"opkey_fetchRelativeCoordinate\" class=\"darkroom-button darkroom-button-default darkroom-button-active opkeyrelativeclose\" title=\"Fetch Relative Coordinate\"><svg class=\"darkroom-icon\"><svg class=\"svg-icon\" viewBox=\"0 0 20 20\"><path d=\"M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589\"></path></svg></svg></button>");
				$(_toolBarElement).append(_buttonGroupDiv);


				var _refreshbuttonGroupDiv = document.createElement("DIV");
				$(_refreshbuttonGroupDiv).addClass("darkroom-button-group");
				$(_refreshbuttonGroupDiv).html("<button type=\"button\" id=\"opkey_refreshImage\" class=\"darkroom-button darkroom-button-default darkroom-button-active opkeyrelativeclose\" title=\"Refresh\"><svg class=\"darkroom-icon\">" +
					"<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'" +
					"viewBox='0 0 496.166 496.166' style='enable-background:new 0 0 496.166 496.166;' xml:space='preserve'>" +
					"<path style='fill:#32BEA6;' d='M0.005,248.087C0.005,111.063,111.073,0,248.079,0c137.014,0,248.082,111.062,248.082,248.087" +
					"c0,137.002-111.068,248.079-248.082,248.079C111.073,496.166,0.005,385.089,0.005,248.087z'/>" +
					"<path style='fill:#F7F7F7;' d='M400.813,169.581c-2.502-4.865-14.695-16.012-35.262-5.891" +
					"c-20.564,10.122-10.625,32.351-10.625,32.351c7.666,15.722,11.98,33.371,11.98,52.046c0,65.622-53.201,118.824-118.828,118.824" +
					"c-65.619,0-118.82-53.202-118.82-118.824c0-61.422,46.6-111.946,106.357-118.173v30.793c0,0-0.084,1.836,1.828,2.999" +
					"c1.906,1.163,3.818,0,3.818,0l98.576-58.083c0,0,2.211-1.162,2.211-3.436c0-1.873-2.211-3.205-2.211-3.205l-98.248-57.754" +
					"c0,0-2.24-1.605-4.23-0.826c-1.988,0.773-1.744,3.481-1.744,3.481v32.993c-88.998,6.392-159.23,80.563-159.23,171.21" +
					"c0,94.824,76.873,171.696,171.693,171.696c94.828,0,171.707-76.872,171.707-171.696" +
					"C419.786,219.788,412.933,193.106,400.813,169.581z'/>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"<g>" +
					"</g>" +
					"</svg>" +
					"</svg></button>");
				$(_toolBarElement).append(_refreshbuttonGroupDiv);

				$("#opkey_fetchRelativeCoordinate").click(function (e) {
					if ($("#opkey_fetchRelativeCoordinate").hasClass("opkeyrelativeclose")) {
						$("#opkey_fetchRelativeCoordinate").removeClass("opkeyrelativeclose");
						$("#opkey_fetchRelativeCoordinate").addClass("opkeyrelativestart");
						$("#opkey_fetchRelativeCoordinate").addClass("RelativeCoordinateButtonClicked");
						document.body.addEventListener("mousemove", event_bodyMouseMove, false);
						canvas.addEventListener("mousedown", event_canvasMouseDown, false);
						canvas.addEventListener("mousemove", event_canvasMouseMove, false);
						canvas.addEventListener("mouseup", event_canvasMouseUp, false);
					}
					else if ($("#opkey_fetchRelativeCoordinate").hasClass("opkeyrelativestart")) {
						$("#opkey_fetchRelativeCoordinate").removeClass("opkeyrelativestart");
						$("#opkey_fetchRelativeCoordinate").addClass("opkeyrelativeclose");
						window.location = "/ImageCrop.html?0";
					}
				});

				$("#opkey_refreshImage").click(function (e) {

					window.location.reload();
					/*
					chrome.runtime.sendMessage({ RefreshSnippingTool: "RefreshSnippingTool" }, function (response) {
						if (chrome.runtime.lastError) { }
					});
					*/
				});
			}
		}
	}, 1000);
});
