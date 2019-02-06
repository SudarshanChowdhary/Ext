chrome.app.runtime.onLaunched.addListener(function(launchData) {


  // chrome.app.window.create('../main.html', {
  //   id: "GDriveExample",
  //   innerBounds: {
  //     width: 600,
  //     height: 600,
  //     minWidth: 600,
  //     minHeight: 600
  //   },
  //   frame: 'none'
  // });
});

chrome.runtime.onInstalled.addListener(function() {
  console.log('installed');
});

chrome.runtime.onSuspend.addListener(function() { 
  // Do some simple clean-up tasks.
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if(request.method == "getText"){
      sendResponse({data: document.all[0].innerText, method: "getText"}); //same as innerText
    }
});

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendRequest(tab.id, {method: "getText"}, function(response) {
    console.log(response)
      if(response.method=="getText"){
          alltext = response.data;
          console.log(alltext);
      }
  });
});


function getText(){
  return document.body.innerText
}
function getHTML(){
  return document.body.outerHTML
}
console.log(getText());             //Gives you all the text on the page
console.log(getHTML());             //Gives you the whole HTML of the page