const Notify = ({ notification }) => {
  console.log(notification);
  if (notification.message) {
    return (
      <div>
        <p style={{ color: "green", border: "solid 2px green", width: "10vw" }}>
          {notification.message}
        </p>
      </div>
    );
  } else if (notification.errorMessage) {
    <div>
      <p style={{ color: "red", border: "solid 2px red", width: "10vw" }}>
        {notification.errorMessage}
      </p>
    </div>;
  }
};

export default Notify;
