function sendReloadRequest(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {TCPreloadPage: true});
	});
}

function initializeTogglrBtn(){
	chrome.storage.sync.get("TCPenableExtension", function(data) {
		var toggleBtn = document.getElementById("TCPenableExtension");
		toggleBtn.checked = data.TCPenableExtension===true;
		toggleBtn.onclick = function(){
			chrome.storage.sync.set({ [toggleBtn.value]: toggleBtn.checked});
			console.log(toggleBtn.value+":"+toggleBtn.checked);
			sendReloadRequest()
		}
	});
}

function initialize(){
	var inputs = document.getElementsByTagName('input');
	for(let i=0;i<inputs.length;i++){
		var value = inputs[i].value;
		inputs[i].onclick = function() {
			chrome.storage.sync.set({ [this.value]: this.checked});
			console.log(this.value+":"+this.checked);
		}
		chrome.storage.sync.get(value, function(data) {
			console.log(this.value+":"+data[this.value]);
			inputs[this.i].checked = data[this.value]===true;
		}.bind({value:value, i:i}));
	}
	initializeTogglrBtn()	
}

document.addEventListener('DOMContentLoaded', function() {
	initialize();
});