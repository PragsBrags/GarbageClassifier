import { useState } from 'react'
import { FileInput } from '../components/FileInput'
import { ModelSelector } from '../components/ModelSelector'
import { IntervalInput } from '../components/IntervalInput'
import { ImagePreview } from '../components/ImagePreview'
import { VideoPreview } from '../components/VideoPreview'
import { CropSelector } from '../components/CropSelector'
import { uploadImage, uploadVideo } from '../api/uploadApi'

const DEFAULT_CROP = {
  unit: '%',
  x: 10,
  y: 10,
  width: 80,
  height: 80,
}

export const UploadPage = () => {
  const [inputType, setInputType] = useState('image')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [modelType, setModelType] = useState('')
  const [interval, setInterval] = useState(1)
  const [crop, setCrop] = useState(DEFAULT_CROP)
  const [frameUrl, setFrameUrl] = useState(null)
  const [videoDimensions, setVideoDimensions] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputTypeChange = (event) => {
    const nextType = event.target.value

    setInputType(nextType)
    setFile(null)
    setPreview(null)
    setModelType('')
    setInterval(1)
    setCrop(DEFAULT_CROP)
    setFrameUrl(null)
    setVideoDimensions(null)
    setMessage('')
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setCrop(DEFAULT_CROP)
    setFrameUrl(null)
    setVideoDimensions(null)
    setMessage('')
  }

  const handleFrameCapture = (frameDataUrl, width, height) => {
    setFrameUrl(frameDataUrl)
    setVideoDimensions({ width, height })
  }

  const getVideoCropCoordinates = () => {
    if (!crop || !videoDimensions) return null

    const cropX = Number(crop.x || 0)
    const cropY = Number(crop.y || 0)
    const cropWidth = Number(crop.width || 0)
    const cropHeight = Number(crop.height || 0)

    if (cropWidth <= 0 || cropHeight <= 0) return null

    return {
      x: Math.round((cropX / 100) * videoDimensions.width),
      y: Math.round((cropY / 100) * videoDimensions.height),
      width: Math.round((cropWidth / 100) * videoDimensions.width),
      height: Math.round((cropHeight / 100) * videoDimensions.height),
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setMessage('Please select a file.')
      return
    }

    if (!modelType) {
      setMessage('Please select a model.')
      return
    }

    if (inputType === 'video' && !frameUrl) {
      setMessage('Please wait for the video preview to load.')
      return
    }

    if (inputType === 'video' && !getVideoCropCoordinates()) {
      setMessage('Please select a valid crop region.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      let response

      if (inputType === 'image') {
        console.log(file, modelType) //remove later
        response = await uploadImage(file, modelType)
        console.log(response) //remove later
      } else {
        const realCrop = getVideoCropCoordinates() 
        console.log(file, modelType, interval, realCrop) //remove later
        response = await uploadVideo(file, modelType, interval, realCrop)
        console.log(response) //remove later
      }

      setMessage(`Success: ${JSON.stringify(response)}`)
    } catch (error) {
      setMessage(`Error: ${JSON.stringify(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <h1>Garbage Classification Upload</h1>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Input Type:</label>

          <select
            value={inputType}
            onChange={handleInputTypeChange}
            disabled={loading}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <FileInput
          inputType={inputType}
          onFileChange={handleFileChange}
          disabled={loading}
        />

        {inputType === 'image' && <ImagePreview imageUrl={preview} />}

        {inputType === 'video' && (
          <VideoPreview
            videoUrl={preview}
            onFrameCapture={handleFrameCapture}
          />
        )}

        {inputType === 'video' && frameUrl && (
          <CropSelector
            imageSrc={frameUrl}
            crop={crop}
            onCropChange={setCrop}
            disabled={loading}
          />
        )}

        {inputType === 'video' && (
          <IntervalInput
            interval={interval}
            onIntervalChange={setInterval}
            disabled={loading}
          />
        )}

        <ModelSelector
          selectedModel={modelType}
          onModelChange={(event) => setModelType(event.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !file || !modelType}>
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {message ? (
        <div
          className={`message ${
            message.startsWith('Error') ? 'error' : 'success'
          }`}
        >
          {message}
        </div>
      ) : null}
    </div>
  )
}