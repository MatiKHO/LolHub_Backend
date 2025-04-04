export const errorHandler = (err, req, res, next) => {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message || err.message || "Internal Server Error";
  
    console.error("🔥 Error Handler:", message);
  
    res.status(status).json({
      success: false,
      error: message,
    });
  };