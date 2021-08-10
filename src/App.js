import React, {useState} from 'react';

import './App.css';

declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.7/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function App() {
  const [meetingNumber , setMeetingNumber] = useState('');
  const [userName, setName] = useState('');
  const [userEmail, setEmail] = useState('')
  const [passWord, setPassword] = useState('');
  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  var signatureEndpoint = 'https://pyon-pyon.herokuapp.com/'
  var apiKey = 'jkPitssHQqiJRZXQNossPw'
  var role = 0
  var leaveUrl = 'https://zoom-react.herokuapp.com/'

  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/meetings/join#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/webinars/join#join-registered-webinar
  var registrantToken = ''

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: passWord,
          tk: registrantToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom WebSDK Sample React</h1>
        <h2>{userName}</h2>
        <div>
          <label>Nama</label> <input type="text" value={userName} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label> <input type="text" value={userEmail} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Meeting ID</label> <input type="text" placeholder="ex. 7265842602" value={meetingNumber} onChange={e=>setMeetingNumber(e.target.value)} />
        </div>
        <div>
          <label>Password</label> <input type="text" placeholder="Kosongkan jika tidak ada" value={passWord} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
