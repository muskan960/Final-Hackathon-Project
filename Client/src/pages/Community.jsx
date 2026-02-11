

import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart, CheckCircle, XCircle } from 'lucide-react'

function Community() {

  const [creations, setCreations] = useState([])
  const [loadingLikeId, setLoadingLikeId] = useState(null)
  const [toast, setToast] = useState({ show: false, type: '' }) 
  const [initialLoading, setInitialLoading] = useState(true) 
  const { user } = useUser()

  const fetchCreations = async () => {
    setInitialLoading(true) 
    setTimeout(() => {
      setCreations(dummyPublishedCreationData)
      setInitialLoading(false) 
    }, 2500)
  }

  const imageLikeToggle = (creationId) => {
    if (loadingLikeId === creationId) return

    setLoadingLikeId(creationId)

    setTimeout(() => {
      setCreations((prev) =>
        prev.map((creation) => {
          if (creation.id !== creationId) return creation

          const liked = creation.likes.includes(user.id)

          // 🔔 set toast type
          setToast({
            show: true,
            type: liked ? 'unliked' : 'liked',
          })

          return {
            ...creation,
            likes: liked
              ? creation.likes.filter((id) => id !== user.id)
              : [...creation.likes, user.id],
          }
        })
      )

      setLoadingLikeId(null)

      setTimeout(() => {
        setToast({ show: false, type: '' })
      }, 2000)
    }, 1500)
  }

  useEffect(() => {
    if (user) fetchCreations()
  }, [user])


  if (initialLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-6 h-full relative'>

      {/* 🔔 TOP ALERT / TOAST */}
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2
                        flex items-center gap-2
                        bg-white text-gray-800 text-sm
                        px-4 py-2 rounded-full
                        shadow-lg z-50 border">
          {toast.type === 'liked' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>
            {toast.type === 'liked'
              ? 'Creation liked'
              : 'Creation unliked'}
          </span>
        </div>
      )}

      <h2 className='font-semibold text-lg'>Creations</h2>

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index) => {
          const isLiked = creation.likes.includes(user.id)
          const isLoading = loadingLikeId === creation.id

          return (
            <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
              <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg' />
              <div className='absolute bottom-0 top-0 right-0 left-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
                <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
                <div className='flex gap-1 items-center'>
                  <p>{creation.likes.length}</p>
                  <Heart 
                    onClick={() => imageLikeToggle(creation.id)} 
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                      isLiked ? 'fill-red-500 text-red-600' : 'text-white'
                    }`} 
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Community








