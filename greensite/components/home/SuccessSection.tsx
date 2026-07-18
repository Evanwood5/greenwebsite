'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

const stories = [
  { name: 'Addy',    company: 'GreenStone FCS',        avatar: '/addy.png'    },
  { name: 'Evan W',  company: 'TechSmith',              avatar: '/aaaa.JPG'    },
  { name: 'Anish S', company: 'State of Michigan',      avatar: '/stroy1.png'  },
  { name: 'Ryan A',  company: 'Ally Bank',              avatar: '/story2.png'  },
  { name: 'Jeff S',  company: 'Jackson National Life',  avatar: '/jeffrey.png' },
]

export default function SuccessSection() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="px-6 py-10 lg:py-12" style={{ background: '#0f2510' }}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#29C115' }}>
            Students · Michigan
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Real Success
          </h2>
        </div>

        <div className="relative flex items-center gap-4">
          {/* Prev button */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 text-white transition-opacity hover:opacity-70"
            aria-label="Previous"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Swiper */}
          <div className="flex-1 min-w-0">
            <Swiper
              modules={[Navigation]}
              loop
              slidesPerView={2}
              spaceBetween={12}
              breakpoints={{
                768: { slidesPerView: 3, spaceBetween: 12 },
                1024: { slidesPerView: 4, spaceBetween: 12 },
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper }}
            >
              {stories.map((s) => (
                <SwiperSlide key={s.name}>
                  <div className="flex flex-col">
                    <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '1/1' }}>
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-[13px] font-bold text-white">{s.name}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: '#29C115' }}>{s.company}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Next button */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 text-white transition-opacity hover:opacity-70"
            aria-label="Next"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}
