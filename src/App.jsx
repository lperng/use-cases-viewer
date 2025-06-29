import React, { useState, useMemo } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react'
import { marked } from 'marked'
import './App.css'
import data from './data.json'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const itemsPerPage = 12

  // 獲取類別顏色
  const getCategoryColor = (category) => {
    const colorMap = {
      '内容创作与媒体': 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 text-purple-800 dark:text-purple-200',
      '教育与培训': 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200',
      '沟通与关怀': 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 text-emerald-800 dark:text-emerald-200',
      '行政与管理': 'bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 text-amber-800 dark:text-amber-200',
      '社区服务与外展': 'bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 text-pink-800 dark:text-pink-200'
    }
    return colorMap[category] || 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200'
  }

  // 獲取所有類別
  const categories = useMemo(() => {
    const cats = [...new Set(data.map(item => item.category))]
    return cats.sort()
  }, [])

  // 篩選數據
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  // 分頁數據
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // 重置頁面當篩選改變時
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : 
        part
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 頂部導航 */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-slate-800/80 shadow-lg border-b border-purple-100 dark:border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              使用案例查看器
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* 搜尋框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜尋使用案例..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 dark:bg-slate-700/90 text-gray-900 dark:text-white w-full sm:w-80 transition-all duration-200"
                />
              </div>
              
              {/* 類別篩選 */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 dark:bg-slate-700/90 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="all">所有類別</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 結果統計 */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            顯示 {filteredData.length} 個結果
            {searchTerm && (
              <span className="ml-2">
                搜尋: "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="ml-2">
                類別: <span className="font-medium">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        {/* 數據卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.map(item => (
            <div
              key={item.id}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <Eye className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors duration-200" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                  {highlightText(item.useCase, searchTerm)}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {highlightText(item.description, searchTerm)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>ID: {item.id}</span>
                  <span>點擊查看詳情</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分頁控制 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              上一頁
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-500 bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              下一頁
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* 詳細視圖模態框 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                使用案例詳情
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${getCategoryColor(selectedItem.category)}`}>
                    {selectedItem.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedItem.useCase}
                  </h3>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">詳細說明</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">提示詞範本</h4>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {selectedItem.promptTemplate}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 回應</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <div 
                      className="text-gray-700 dark:text-gray-300 markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: marked(selectedItem.aiResponse || '') 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

