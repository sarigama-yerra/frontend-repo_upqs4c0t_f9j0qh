import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="backdrop-blur-md bg-slate-900/40 border border-blue-500/20 rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Smart Attendance
          </h1>
          <p className="mt-4 text-blue-100 text-lg md:text-xl max-w-2xl">
            Seamless registration, face recognition, secure QR check-ins, and geofenced verification — all in one modern portal.
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
    </section>
  )
}
