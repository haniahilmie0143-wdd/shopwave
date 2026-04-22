const Message = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-primary/10 text-primary border-primary/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  }
  return (
    <div className={`border rounded-2xl px-5 py-4 text-sm leading-relaxed backdrop-blur-sm ${styles[type]}`}>
      {children}
    </div>
  )
}

export default Message