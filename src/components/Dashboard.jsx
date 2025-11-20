import { useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard({ token, userMeta }) {
  const [me, setMe] = useState(null)
  const [faceImage, setFaceImage] = useState(null)
  const [message, setMessage] = useState('')
  const videoRef = useRef(null)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [qr, setQr] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchMe()
    locate()
    loadHistory()
  }, [])

  const fetchMe = async () => {
    const res = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setMe(data)
  }

  const locate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
      })
    }
  }

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.current.srcObject = stream
    await videoRef.current.play()
  }

  const captureFace = () => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      setFaceImage(blob)
    }, 'image/jpeg', 0.9)
  }

  const uploadFace = async () => {
    if (!faceImage) return
    const form = new FormData()
    form.append('file', faceImage, 'face.jpg')
    const res = await fetch(`${API}/me/photo`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
    const data = await res.json()
    setMessage(data.status || data.detail)
  }

  const markFace = async () => {
    if (!faceImage) return
    const form = new FormData()
    form.append('file', faceImage, 'face.jpg')
    form.append('lat', lat ?? '')
    form.append('lng', lng ?? '')
    const res = await fetch(`${API}/attendance/mark/face?lat=${lat??''}&lng=${lng??''}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
    const data = await res.json()
    setMessage(data.status || data.detail)
    loadHistory()
  }

  const genSelfQR = async () => {
    const res = await fetch(`${API}/qr/self`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ lat, lng }) })
    const data = await res.json()
    setQr(data.qr_token)
  }

  const markWithQR = async () => {
    const tokenStr = prompt('Paste QR token')
    if (!tokenStr) return
    const res = await fetch(`${API}/attendance/mark/qr`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ qr_token: tokenStr, lat, lng }) })
    const data = await res.json()
    setMessage(data.status || data.detail)
    loadHistory()
  }

  const loadHistory = async () => {
    const res = await fetch(`${API}/attendance/history`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setHistory(data.items || [])
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 text-blue-100">
      <h3 className="text-xl font-semibold mb-4">Welcome {me?.full_name || ''}</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="space-x-2 mb-3">
            <button onClick={startCamera} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Start Camera</button>
            <button onClick={captureFace} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Capture</button>
            <button onClick={uploadFace} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700">Save Face</button>
            <button onClick={markFace} className="px-3 py-1 rounded bg-green-600 hover:bg-green-700">Mark by Face</button>
          </div>
          <video ref={videoRef} className="w-full rounded border border-slate-700" playsInline></video>
          <p className="mt-2 text-sm text-blue-300">Location: {lat?.toFixed(5)}, {lng?.toFixed(5)}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-900/50 rounded p-3">
            <h4 className="font-semibold mb-2">QR Tools</h4>
            <button onClick={genSelfQR} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700">Generate Self QR</button>
            {qr && (
              <div className="mt-2 break-all text-xs bg-slate-800 p-2 rounded">{qr}</div>
            )}
            <button onClick={markWithQR} className="mt-2 px-3 py-1 rounded bg-green-600 hover:bg-green-700">Mark with QR</button>
          </div>

          <div className="bg-slate-900/50 rounded p-3">
            <h4 className="font-semibold mb-2">History</h4>
            <div className="max-h-64 overflow-auto text-sm space-y-2">
              {history.map(h => (
                <div key={h._id} className="flex justify-between bg-slate-800/60 rounded p-2">
                  <span>{new Date(h.created_at).toLocaleString()}</span>
                  <span className={`font-semibold ${h.status==='present'?'text-green-400':'text-red-400'}`}>{h.method} • {h.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-blue-200">{message}</div>
        </div>
      </div>
    </div>
  )
}
