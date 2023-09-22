const Notify = ({ notification }) => {
  console.log("from Notify:")
  console.log(notification)
  if (notification) {
    return (
      <div>
        <p style={{ color: "red", border: "solid 2px red", width: "10vw" }}>
          {notification}
        </p>
      </div>
    )
  }
  return null
}

export default Notify
