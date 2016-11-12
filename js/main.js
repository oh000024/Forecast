const CELSIUS = "℃";
const FERHENHEIT ="℉";
const NOT_FOUND_DATA = -1;


//load iconData
var newiconInfo = JSON.parse(alternateIcon);

// give me suitable data!!!!
function searchIcon(key) {
	for (var i = 0; i < newiconInfo.length; i++) {
		if (key == newiconInfo[i].iconName) {
			return newiconInfo[i];
		}
	}
	return null;
}

function cTof(cdegree) {

	var cToFahr = cdegree * 9 / 5 + 32;
	return cToFahr;
}

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var days = ['Sun', 'Mon', 'Tus', 'Wed', 'Thi', 'Fri', 'Sta'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var day = days[a.getDay()];
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = day + ' ' + date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
	return time;
}
document.addEventListener("DOMContentLoaded", function () {
	serverData.getJSON();
});

let serverData = {
	url: "https://oh000024.edumedia.ca/mad9014/weather/forecast/forecast.php",
	httpRequest: "GET",
	getJSON: function () {

		let headers = new Headers();
		headers.append("Content-Type", "text/plain");
		headers.append("Accept", "applcation/json; charset=utf-8");

		let options = {
			method: serverData.httpRequest,
			mode: "cors",
			headers: headers
		};

		let request = new Request(serverData.url, options);

		fetch(request)
			.then(function (response) {

				console.log(response);

				return response.json();
			})
			.then(function (data) {
				console.log(data);

				displayHourlyData(data.hourly);

			})
			.catch(function (err) {
				alert("Error: " + err.message);
			});
	}
};

function displayHourlyData(hourly) {
	var data = hourly.data;
	console.log(data);

	if (data.length == 0)
		return;

	const numberOfHoursTodDisplay = 24;
	let numberOfHours = null;

	if (data.length >= numberOfHoursTodDisplay) {
		numberOfHours = numberOfHoursTodDisplay;
	} else {
		numberOfHours = data.length;
	}

	let time = new Date();

	let weatherForecastDiv = document.querySelector(".weather-forecast");
	weatherForecastDiv.innerHTML = "";

	for (let i = 0; i < data.length; i++) {

		let hobj = data[i];
		console.log(hobj.icon);

		let div = document.createElement("div");
		let iTag = document.createElement("i");

		iTag.classList.add("wi");
		div.classList.add("main");

		time.setTime(hobj.time * 1000);

		let pTime = document.createElement("p");
		pTime.classList.add("time");

		let tempkey = hobj.icon.split("-")[0];
		if (0 == tempkey.length) {
			tempkey = hobj.icon;
		}

		var iconInfo = searchIcon(tempkey);

		// If the icon was not there..... create a log file and then.... do something
		if (iconInfo == null) continue;

		if (time.getHours() < 12) {
			pTime.textContent = time.getHours().toString().concat('AM');

		} else {
			pTime.textContent = time.getHours().toString().concat('PM');
		}
		iTag.classList.add(time.getHours() < 17 ? iconInfo.dvalue : iconInfo.nvalue);

		let pCe = document.createElement("p");
		pCe.classList.add("ce");

		// Split Integer Hm... -0.2... 
		let cdegree = hobj.temperature.toString().split(".")[0];

		let fdegree = cTof(cdegree).toString().split(".")[0];
		pCe.textContent = cdegree + CELSIUS + "/" + fdegree + FERHENHEIT;

		div.classList.add(tempkey);

		let p = document.createElement("p");
		p.textContent = data[i].icon;

		div.appendChild(pTime);
		div.appendChild(pCe);
		div.appendChild(iTag);

		weatherForecastDiv.appendChild(div);
	}
}