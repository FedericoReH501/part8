const Notify = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <div>
      <p style={{ color: "red", border: "solid 2px red", width: "10vw" }}>
        {notification}
      </p>
    </div>
  )
}

export default Notify
