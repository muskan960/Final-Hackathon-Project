

import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

function AiTools() {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Heading */}
      <div className="text-center">
                      <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tigh bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              Explore Our AI-Powered Tools
               </h1>
        <p className="text-gray-500 max-w-lg mx-auto mt-3">
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mt-10 max-w-6xl mx-auto">
        {/* First Row - 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {AiToolsData.slice(0, 3).map((tool, index) => (
            <div
              key={index}
              onClick={() => user && navigate(tool.path)}
              className="w-full max-w-sm p-8 rounded-2xl bg-white shadow-lg border border-gray-100 cursor-pointer
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 p-3 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              >
                <tool.Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>

              {/* Description */}
              <p className="text-gray-400 text-sm">{tool.description}</p>
            </div>
          ))}
        </div>

        {/* Second Row - 2 Cards centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8 place-items-center justify-items-center">
          {AiToolsData.slice(3, 5).map((tool, index) => (
            <div
              key={index}
              onClick={() => user && navigate(tool.path)}
              className="w-full max-w-sm p-8 rounded-2xl bg-white shadow-lg border border-gray-100 cursor-pointer
                hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 p-3 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              >
                <tool.Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>

              {/* Description */}
              <p className="text-gray-400 text-sm">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AiTools
