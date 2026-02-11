
import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <footer className="bg-gray-50 px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full text-gray-500 mt-20">
      
      <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-gray-300 pb-10">

        <div className="max-w-md">
<img className='h-9' src={assets.logo} alt="logo" />
          <p className="mt-5 text-sm leading-relaxed text-gray-500">
  Experience the power of AI with QuickAI. <br/> Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 md:gap-20">

          <div>
            <h2 className="font-semibold mb-4 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:text-indigo-600 transition" href="#">Home</a></li>
              <li><a className="hover:text-indigo-600 transition" href="#">About us</a></li>
              <li><a className="hover:text-indigo-600 transition" href="#">Contact us</a></li>
              <li><a className="hover:text-indigo-600 transition" href="#">Privacy policy</a></li>
            </ul>
          </div>

          <div className="max-w-sm">
            <h2 className="font-semibold text-gray-800 mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>

            <div className="flex items-center gap-2">
              <input
                className="flex-1 h-10 rounded-md px-3 text-sm border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                type="email"
                placeholder="Enter your email"
              />
              <button className="h-10 px-4 bg-primary hover:bg-indigo-700 transition text-white text-sm rounded-md">
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>

      <p className="pt-6 text-center text-xs md:text-sm text-gray-700 mb-5">
       Copyright 2026 <a className="hover:text-indigo-600" href="https://prebuiltui.com">© QuickAI</a>. All Rights Reserved.
      </p>

    </footer>
  )
}

export default Footer
