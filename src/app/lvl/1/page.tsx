import Image from 'next/image'
import styles from './page.module.css'
import MainStage from '@/dom/organ/stage/MainStage'
import { WIP } from './WIP'

export default function Home() {
  return (
    <main className={"h-100 bord-r-25 noverflow mt-2"} 
      style={{background: "linear-gradient(-45deg, #6ECCF033, #6ECCF0aa"}}
    >
      <div className='pos-abs z-200'>
        <div id='logo' className='pa-2 '>
          <a href="/" className='nodeco tx-black flex tx-lx  tx-shadow-5 tx-bold-6'
            style={{color: "#2E8CF0"}}
          >
            <div className='tx-altfont-1' style={{color: "#4EaCF0"}}>MIL</div>
            {/* <div className='tx-white'>-</div> */}
            <div className='flex tx-altfont-1 tx-white' >
              <div>E</div>
              <div className='pos-rel flex-col'>
                <div className="pos-abs pa-1  mb-5 box-shadow-5-b border-white bord-r-100p" style={{background: "gold"}}></div>
                i
              </div>
              <div>D</div>
            </div>
            <div className='tx-altfont-1' style={{color: "#4EaCF0"}}>I</div>
            <div className='tx-sm pt-2 tx-altfont-1' style={{color: "#4EaCF0"}}>chan</div>
          </a>
        </div>
      </div>
      <div>
        
    <div className='pos-abs mt-100 top-0 left-0 tx-lx z-800 w-100 flex-col pt-100'>
    <WIP />
      </div>
      <hr />
      <a href='/' className='tx-black tx-lg bord-r-50 px-8 border-white bg-w-10 tx-bold-8 bg-glass-10 py-2 tx-altfont-1 opaci-chov--50 '>
        Go Back
      </a>
      </div>
    </main>
  )
}
