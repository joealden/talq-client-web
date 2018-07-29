const loggedIn = () => {
  if (typeof window !== "undefined") {
    const loggedInStatus = localStorage.getItem("loggedIn");
    if (loggedInStatus === "true") {
      return true;
    } else {
      return false;
    }
  }
};

export default loggedIn;
