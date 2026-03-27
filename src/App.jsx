import { useState, useRef } from 'react'

const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY || ''

function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!API_KEY) {
      setError('缺少 API Key，请设置 VITE_REMOVEBG_API_KEY 环境变量')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('图片大小不能超过 4MB')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      setOriginalImage(base64)
      setResultImage(null)
      setError(null)
      setLoading(true)

      try {
        const formData = new FormData()
        formData.append('image_file', file)
        formData.append('size', 'auto')

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': API_KEY,
          },
          body: formData,
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.errors?.[0]?.title || '处理失败')
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setResultImage(url)
        setUsageCount(prev => prev + 1)
      } catch (err) {
        setError(err.message || '处理失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setResultImage(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const downloadResult = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.href = resultImage
    link.download = 'removed-background.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-600">🎨 RemoveBG Mini</h1>
        <p className="text-gray-500 mt-2">移除图片背景，一键完成</p>
        {API_KEY && (
          <p className="text-sm text-gray-400 mt-1">已使用 {usageCount} 次（免费额度 50次/月）</p>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!originalImage ? (
          /* Upload Area */
          <div
            className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="text-6xl mb-4">📤</div>
            <p className="text-lg font-medium text-gray-700">
              拖拽图片到这里，或点击选择文件
            </p>
            <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG、WebP，最大 4MB</p>
          </div>
        ) : (
          /* Preview Area */
          <div className="w-full max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">原图</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Result Image */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">结果</h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : resultImage ? (
                    <img
                      src={resultImage}
                      alt="Result"
                      className="w-full h-full object-contain"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'16\' height=\'16\' fill=\'%23ddd\'/%3E%3Crect x=\'0\' y=\'0\' width=\'8\' height=\'8\' fill=\'%23fff\'/%3E%3Crect x=\'8\' y=\'8\' width=\'8\' height=\'8\' fill=\'%23fff\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {error ? '❌' : '等待处理...'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              {resultImage && (
                <button
                  onClick={downloadResult}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  ⬇️ 下载结果
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                🔄 处理下一张
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-400">
        © 2024 RemoveBG Mini · 纯前端处理，保护隐私
      </footer>
    </div>
  )
}

export default App
