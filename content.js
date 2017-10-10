var allPropertyArray = ['color','backgroundColor','borderLeftColor','borderRightColor','borderTopColor','borderBottomColor','lightingColor','outlineColor','textDecorationColor'];
var propertyArray = new Array();
var counter = 0;
//-------------------------------------------------------------------------------------
function analizeHtml(){
	var colorArray = new Array();
	var items = document.getElementsByTagName("*");
	
	for (let i= items.length; i--;) {
		propertyArray.forEach(function(elem){
			var rgbColor = getComputedStyle(items[i])[elem];
			if(rgbColor){
				var hexColor = rgb2hex(rgbColor);
				var tmpColor = {HexColor:hexColor, RgbColor:rgbColor};
				if(!containsHex(colorArray, hexColor)){
					colorArray.push(tmpColor);
				}
			}			
		});  
	}
	
	return colorArray;
}

function rgb2hex(rgb){
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function containsHex(arr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i].HexColor === value) return true;
    }
    return false;
}

function prepareTable(arr){
	var tmpColorTable = "<table><tr><th>Color</th><th>Hex</th><th>Rgb</th></tr>";	
	
	arr.sort(function(a, b) {
		var textA = a.HexColor.toUpperCase();
		var textB = b.HexColor.toUpperCase();
		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
	
	arr.forEach(function(elem){
		tmpColorTable += "<tr>";
		tmpColorTable += "<td style='border:1px solid black;height:15px;width:15px;background-color:"+elem.HexColor+"'></td>";
		tmpColorTable += "<td style='border:1px solid black;padding:2px'>"+elem.HexColor+"</td>";
		tmpColorTable += "<td style='border:1px solid black;padding:2px'>"+elem.RgbColor+"</td>";
		tmpColorTable += "<tr>";
	});	
	tmpColorTable += "</table>"
	
	return tmpColorTable;
}

function changeTheApperance(arr){
	var tmpBody = document.body.innerHTML;
	var tmpColorPage = prepareTable(arr);
	
	var iframe = document.createElement('iframe');
	iframe.id = "ColorPaleteIframe";
	iframe.style.background = "white";
	iframe.style.height = "500px";
	iframe.style.width = "300px";
	iframe.style.position = "fixed";
	iframe.style.top = "0px";
	iframe.style.right = "0px";
	iframe.style.zIndex = "99999999";
	iframe.style.border = "2px solid black"; 
	iframe.src = 'data:text/html;charset=utf-8,' + prepareTable(arr);
	document.body.appendChild(iframe);
	iframe = document.getElementById("ColorPaleteIframe");
	
	var iframeToggleBtn = document.createElement('button');
	iframeToggleBtn.id = "iframeToggleBtn";
	iframeToggleBtn.style.background = "#ad3232";
	iframeToggleBtn.style.color = "white";
	iframeToggleBtn.style.width="30px";
	iframeToggleBtn.style.height="30px";
	iframeToggleBtn.style.position = "fixed";
	iframeToggleBtn.style.top = "0px";
	iframeToggleBtn.style.right = "304px";
	iframeToggleBtn.style.zIndex = "999999999";
	iframeToggleBtn.innerText = ">";	
	document.body.appendChild(iframeToggleBtn);
	iframeToggleBtn = document.getElementById("iframeToggleBtn");
		
	var iframeExitBtn = document.createElement('button');
	iframeExitBtn.id = "iframeExitBtn";
	iframeExitBtn.style.background = "#ad3232";
	iframeExitBtn.style.color = "white";
	iframeExitBtn.style.width="30px";
	iframeExitBtn.style.height="30px";
	iframeExitBtn.style.position = "fixed";
	iframeExitBtn.style.top = "30px";
	iframeExitBtn.style.right = "304px";
	iframeExitBtn.style.zIndex = "999999999";
	iframeExitBtn.innerText = "X";	
	document.body.appendChild(iframeExitBtn);
	iframeExitBtn = document.getElementById("iframeExitBtn");
	
	iframeToggleBtn.onclick = function() {
		opened = (iframe.style.display == 'none') ? false : true;
		iframeToggleBtn.style.right = opened?"0px":"304px";
		iframeExitBtn.style.right = opened?"0px":"304px";
		iframeToggleBtn.innerText = opened?"<":">";			
		iframe.style.display = (iframe.style.display == 'none') ? 'block' : 'none';
	};
	iframeExitBtn.onclick = function() {
		iframeExitBtn.parentNode.removeChild(iframeExitBtn);
		iframeToggleBtn.parentNode.removeChild(iframeToggleBtn);
		iframe.parentNode.removeChild(iframe);
	};

}

//-------------------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  function(request) {
	if(request.TCPreloadPage){
		window.location.reload();
	}	
  });
  
chrome.storage.sync.get('TCPenableExtension', function(data) {	
	if(data.TCPenableExtension){	
		counter = allPropertyArray.length;

		for(var i=0;i<allPropertyArray.length;i++){
			var value = allPropertyArray[i];

			chrome.storage.sync.get('TCP'+value, function(data) {
				
				if(data['TCP'+this.value]){
					propertyArray.push(this.value);
				}
				
				if(!--counter){
					changeTheApperance(analizeHtml());
				}
			}.bind({value:value}));
		}
	};
});