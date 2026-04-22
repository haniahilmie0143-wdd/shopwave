const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
      <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
      <div className="absolute inset-2 border-2 border-transparent border-t-primary/40 rounded-full animate-spin" style={{animationDirection:'reverse', animationDuration:'0.8s'}} />
    </div>
    <p className="text-sm text-silver font-body tracking-widest uppercase">Loading</p>
  </div>
)

export default Spinner