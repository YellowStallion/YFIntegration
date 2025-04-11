import React, { useState, useEffect, setState } from 'react';
import Editor from './Editor'
import Configuration from './Helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Codepen() {

const [html, setHtml] = useState('')
const [css, setCss] = useState('')
const [js, setJs] = useState('')
const [srcDoc, setSrcDoc] = useState('')
const [accessToken, setAccessToken] = useState('')
const [refreshToken, setRefreshToken] = useState('')
const [loginToken, setLoginToken] = useState('')
const [signals, setSignals] = useState('')
const [explanation, setExplanation] = useState('')


const YELLOWFIN_URL="http://localhost:8080"


useEffect(() => {
  const timeout = setTimeout(() => {
    setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `)
  }, 250)

  return () => clearTimeout(timeout)
}, [html, css, js])
function saveConfiguration(){

}
function openConfiguration(){
  setExplanation(<Configuration onSave={saveConfiguration}/>);
}
function getRefreshToken(){
  fetch('refresh_token')
    .then(response => response.json())
    .then(data => {
      setRefreshToken(data)
      toast("Refresh Token Obtained: "+data)
    });
}
function getAccessToken(){
  fetch('access_token?refresh_token='+encodeURIComponent(refreshToken))
    .then(response => response.json())
    .then(data => {
      setAccessToken(data)
      toast("Access Token Obtained: "+data)
    });
}
function getLoginToken(){
  fetch('login_token?access_token='+encodeURIComponent(accessToken))
    .then(response => response.json())
    .then(data => {
      setLoginToken(data)
      toast("Login Token Obtained: "+data)
    });
}
function getSignals(){
  fetch('signals?access_token='+encodeURIComponent(accessToken))
    .then(response => response.json())
    .then(data => {
      console.log(data)
      var signalHtml = '<div class="signalList">'
      for (var signal of data.items){
        signalHtml+='\n<div class="signal">'
        //signalHtml+='\n\t<div class="narrativeDate">'+signal.narrativeDate.unformattedText+'</div>'
        signalHtml+='\n\t<div class="narrativeText">'+signal.narrativeText.unformattedText+'</div>'
        signalHtml+='\n\t<div class="narrativeValue">'+signal.narrativeValue.unformattedText+'</div>'
        signalHtml += '\n</div>'
      }
      signalHtml += '\n</div>'
      console.log(signalHtml)
      setHtml(signalHtml)
    });
}
function loadDash(){
  var token = ''
  if (loginToken.length>0){
    token = 'token='+loginToken
  }
  setHtml(`
<div id="YellowfinDiv"></div>
<script src="`+YELLOWFIN_URL+`/JsAPI/v3?`+token+`"></script>
<script>
window.yellowfin.loadDashboardAPI().then(() => { 

window.yellowfin.dashboards.loadDashboard({ 
  dashboardUUID: "e7409ff2-f846-44e1-a603-b78ec51b20b9", 
  element:  document.querySelector('#YellowfinDiv'),
            showShare: false,
}).then(dashboard => { 	});
})
</script>
    `);

}

function loadReport(){
  var token = ''
  if (loginToken.length>0){
    token = 'token='+loginToken
  }
  setHtml(`
<div id="YellowfinDiv"></div>
<script src="`+YELLOWFIN_URL+`/JsAPI/v3?`+token+`"></script>
<script>
yellowfin.loadReport({
  element: document.querySelector("#YellowfinDiv"),
  reportUUID: "80162f66-b23e-4a2b-b209-497a960d96d5",
});
</script>
  `)
}
function loadNLQ(){
  var token = ''
  if (loginToken.length>0){
    token = 'token='+loginToken
  }
  setHtml(`
<div id="YellowfinDiv"></div>
<script src="`+YELLOWFIN_URL+`/JsAPI/v3?`+token+`"></script>
<script>
yellowfin.loadNLQ({
  element: document.querySelector("#YellowfinDiv"),
});
</script>
  `)
}
function loadStory(){
  var token = ''
  if (loginToken.length>0){
    token = 'token='+loginToken
  }
  setHtml(`
<div id="YellowfinDiv"></div>
<script src="`+YELLOWFIN_URL+`/JsAPI/v3?`+token+`"></script>
<script>
yellowfin.loadStory({
  element: document.querySelector("#YellowfinDiv"),
  storyUUID: "ab6600e7-b614-4a24-9685-38b4d185161d",
});
</script>
  `)
}


function loadIFrameEntry(){
  var token = ''
  if (loginToken.length>0){
    token = loginToken
  }
  setHtml(`
<iframe src="`+YELLOWFIN_URL+`/logon.i4?LoginWebserviceId=`+token+`" width="100%" style="height:100vh" sandbox="allow-popups allow-scripts allow-forms allow-same-origin"></iframe>
  `)
}
function loadIFrameBrowse(){
  var token = ''
  if (loginToken.length>0){
    token = loginToken
  }
  setHtml(`
  <iframe src="`+YELLOWFIN_URL+`/MIPreReports.i4" width="100%" style="height:100vh"></iframe>
  `)
}
function loadIFrameSignal(){
  var token = ''
  if (loginToken.length>0){
    token = loginToken
  }
  setHtml(`
  <iframe src="`+YELLOWFIN_URL+`/RunSignal.i4?signalUUID=eef7bce8-07d8-4260-a9f8-3c5ca4330b48" width="100%" style="height:100vh"></iframe>
  `)
}
function loadIFrameDashboard(){
  var token = ''
  if (loginToken.length>0){
    token = loginToken
  }
  setHtml(`
  <iframe src="`+YELLOWFIN_URL+`/RunDashboard.i4?dashUUID=ae52f8f8-fe7e-42a1-a154-1e89644aa2a9" width="100%" style="height:100vh"></iframe>
  `)
}
return (
  <div id="container">
    <div className="pane nav">
      <div className="navHeader" onClick={openConfiguration}>Configure</div>

      <div className="navHeader">REST Authentication</div>
      <div className="navOption" onClick={getRefreshToken}>Refresh Token<div className="restStatus"><FontAwesomeIcon icon={(!refreshToken.length>0) ? faTimes : faCheck} /></div></div>
      <div className="navOption" onClick={getAccessToken}>Access Token<div className="restStatus"><FontAwesomeIcon icon={(!accessToken.length>0) ? faTimes : faCheck} /></div></div>
      <div className="navOption" onClick={getLoginToken}>Login Token<div className="restStatus"><FontAwesomeIcon icon={(!loginToken.length>0) ? faTimes : faCheck} /></div></div>
      <div className="navHeader">JS-API</div>
      <div className="navOption" onClick={loadDash}>Dashboard</div>
      <div className="navOption" onClick={loadReport}>Report</div>
      <div className="navOption" onClick={loadStory}>Story</div>
      <div className="navOption" onClick={loadNLQ}>NLQ</div>
      <div className="navHeader">IFrame</div>
      <div className="navOption" onClick={loadIFrameEntry}>IFrame Entry</div>
      <div className="navOption" onClick={loadIFrameBrowse}>Browse</div>
      <div className="navOption" onClick={loadIFrameSignal}>Signal</div>
      <div className="navOption" onClick={loadIFrameDashboard}>Dashboard</div>
      <div className="navHeader">REST Content</div>
      <div className="navOption" onClick={getSignals}>Signals</div>
    </div>
    <div className="pane top-pane">
      <div className="explanation">
          {explanation}
      </div>
      <Editor
        language="xml"
        displayName="HTML"
        value={html}
        onChange={setHtml}
        className="HtmlContainer"
      />
    </div>
    <div className="pane script-pane">
      <iframe
        srcDoc={srcDoc}
        title="output"
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms allow-popups"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
    <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />

  </div>
)
}
export default Codepen;